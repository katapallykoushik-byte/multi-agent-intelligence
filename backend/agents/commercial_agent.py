import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from backend.services.data_processor import DataProcessor
from backend.services.concept_detector import ConceptDetector


class CommercialAnalysisAgent:
    """
    Commercial Analysis Agent.

    Analyzes commercial performance, regional variations, product distributions,
    and runs predictive regression modeling with strict target leakage prevention.
    """

    def __init__(self):
        self.processor = DataProcessor()
        self.concept_detector = ConceptDetector()

    def analyze(
        self,
        file_path=None,
        business_problem="",
        data_intelligence_report=None,
        shared_context=None,
        df=None
    ):
        data_intelligence_report = data_intelligence_report or {}
        shared_context = shared_context or {}

        # 1. LOAD DATASET IF NOT PROVIDED
        if df is None:
            if file_path is None:
                return {
                    "agent": "Commercial Analysis Agent",
                    "status": "error",
                    "message": "No dataset file or DataFrame provided."
                }
            try:
                df = self.processor.load_data(file_path)
            except Exception as e:
                return {
                    "agent": "Commercial Analysis Agent",
                    "status": "error",
                    "message": f"Failed to load dataset: {str(e)}"
                }

        # Ensure column names are standardized
        df = self.processor.clean_column_names(df)

        analysis = {}
        insights = []

        # 2. RESOLVE KEY COLUMNS VIA INFERRED CONCEPTS OR HEURISTICS
        concepts = (
            data_intelligence_report
            .get("detected_concepts", {})
            .get("concepts", {})
        )

        sales_col = self._resolve_concept_column(
            df, concepts, "SALES", ["sales", "historical_sales", "total_sales", "order_value", "turnover", "revenue", "amount"], is_numeric=True
        )

        region_col = self._resolve_concept_column(
            df, concepts, "REGION", ["region", "territory", "location", "market", "area", "zone", "branch"], is_numeric=False
        )

        product_col = self._resolve_concept_column(
            df, concepts, "PRODUCT", ["product", "product_id", "product_name", "item", "item_id", "sku"], is_numeric=None
        )

        # ----------------------------------------
        # 3. SALES SUMMARY ANALYSIS
        # ----------------------------------------
        if sales_col and sales_col in df.columns:
            sales_series = pd.to_numeric(df[sales_col], errors="coerce").dropna()

            if not sales_series.empty:
                total_sales = float(sales_series.sum())
                avg_sales = float(sales_series.mean())
                min_sales = float(sales_series.min())
                max_sales = float(sales_series.max())

                analysis["sales_summary"] = {
                    "column": sales_col,
                    "total_sales": round(total_sales, 2),
                    "average_sales": round(avg_sales, 2),
                    "minimum_sales": round(min_sales, 2),
                    "maximum_sales": round(max_sales, 2)
                }

                insights.append(
                    f"Total {sales_col.replace('_', ' ').title()} across the dataset is {round(total_sales, 2):,} with an average of {round(avg_sales, 2):,} per record."
                )

                low_sales_count = int((sales_series < avg_sales).sum())
                insights.append(
                    f"{low_sales_count} records ({round(low_sales_count / len(sales_series) * 100, 1)}%) perform below the mean benchmark."
                )
        else:
            analysis["sales_summary"] = {
                "message": "No primary commercial sales or revenue variable identified with sufficient confidence."
            }

        # ----------------------------------------
        # 4. REGIONAL PERFORMANCE
        # ----------------------------------------
        if region_col and region_col in df.columns and sales_col and sales_col in df.columns:
            try:
                regional_sales = (
                    df.groupby(region_col)[sales_col]
                    .sum()
                    .sort_values(ascending=False)
                )

                analysis["regional_performance"] = {
                    str(region): round(float(sales), 2)
                    for region, sales in regional_sales.items()
                }

                top_region = regional_sales.index[0]
                top_sales = regional_sales.iloc[0]
                insights.append(
                    f"Top performing region is '{top_region}' contributing {round(float(top_sales), 2):,} in total volume."
                )
            except Exception:
                pass

        # ----------------------------------------
        # 5. PRODUCT PERFORMANCE
        # ----------------------------------------
        if product_col and product_col in df.columns and sales_col and sales_col in df.columns:
            try:
                product_sales = (
                    df.groupby(product_col)[sales_col]
                    .sum()
                    .sort_values(ascending=False)
                )

                # Cap at top 10 products for clean display
                analysis["product_performance"] = {
                    str(prod): round(float(sales), 2)
                    for prod, sales in product_sales.head(10).items()
                }

                top_product = product_sales.index[0]
                top_prod_sales = product_sales.iloc[0]
                insights.append(
                    f"Leading product is '{top_product}' with {round(float(top_prod_sales), 2):,} in sales."
                )
            except Exception:
                pass

        # ----------------------------------------
        # 6. REGRESSION ANALYSIS WITH LEAKAGE PREVENTION
        # ----------------------------------------
        analysis["regression"] = {}

        if sales_col and sales_col in df.columns:
            # Detect target derivatives / collinear leakage
            leakage_cols = self.concept_detector.identify_target_derivatives(df, sales_col)

            # Get candidate numeric predictors
            all_numeric = df.select_dtypes(include=[np.number]).columns.tolist()
            feature_columns = [
                c for c in all_numeric
                if c != sales_col and c not in leakage_cols
            ]

            if feature_columns:
                # Subset and drop NaNs only across the chosen feature set + target
                regression_subset = df[feature_columns + [sales_col]].dropna()

                if len(regression_subset) >= 10:
                    X = regression_subset[feature_columns]
                    y = regression_subset[sales_col]

                    # Validate variance in predictors
                    valid_features = [col for col in feature_columns if X[col].nunique() > 1]

                    if valid_features:
                        X = X[valid_features]
                        model = LinearRegression()
                        model.fit(X, y)

                        predictions = model.predict(X)

                        mae = float(mean_absolute_error(y, predictions))
                        mse = float(mean_squared_error(y, predictions))
                        rmse = float(mse ** 0.5)
                        r2 = float(r2_score(y, predictions))

                        analysis["regression"] = {
                            "target": sales_col,
                            "features": valid_features,
                            "mae": round(mae, 2),
                            "mse": round(mse, 2),
                            "rmse": round(rmse, 2),
                            "r2_score": round(max(r2, 0.0), 4),
                            "sample_size": len(regression_subset),
                            "excluded_leakage_features": leakage_cols,
                            "predictions": [
                                round(float(val), 2)
                                for val in predictions[:10]
                            ]
                        }

                        insights.append(
                            f"Predictive model trained on {len(valid_features)} operational variables achieving R2 = {round(max(r2, 0.0), 4)} (target leakage excluded)."
                        )
                    else:
                        analysis["regression"] = {
                            "message": "Predictor variables lack sufficient variance for linear modeling."
                        }
                else:
                    analysis["regression"] = {
                        "message": f"Insufficient complete records ({len(regression_subset)} rows) after cleaning for regression."
                    }
            else:
                analysis["regression"] = {
                    "message": "No independent operational predictors available (collinear target derivatives excluded to ensure model integrity)."
                }
        else:
            analysis["regression"] = {
                "message": "No suitable commercial target variable identified for regression analysis."
            }

        # Ensure default insight if list is empty
        if not insights:
            insights.append("Commercial analysis completed with the available dataset parameters.")

        return {
            "agent": "Commercial Analysis Agent",
            "status": "completed",
            "business_problem": business_problem,
            "analysis": analysis,
            "key_insights": insights
        }

    def _resolve_concept_column(self, df, concepts, concept_key, fallback_keywords, is_numeric=None):
        """
        Resolve the best matching column name using detected concepts with heuristic fallback.
        """
        concept_data = concepts.get(concept_key, {})
        primary_col = concept_data.get("primary_column")

        if primary_col and primary_col in df.columns:
            if is_numeric is None or (is_numeric and pd.api.types.is_numeric_dtype(df[primary_col])):
                return primary_col

        # Fallback heuristic
        for col in df.columns:
            col_lower = str(col).lower()
            if any(kw in col_lower for kw in fallback_keywords):
                if is_numeric is True and pd.api.types.is_numeric_dtype(df[col]):
                    return col
                elif is_numeric is False and not pd.api.types.is_numeric_dtype(df[col]):
                    return col
                elif is_numeric is None:
                    return col

        return None