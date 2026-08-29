import pandas as pd
import numpy as np


class DataProcessor:

    def load_data(self, file_path):
        """
        Load CSV or Excel datasets automatically with encoding fallbacks.
        """
        if file_path.endswith(".csv"):
            try:
                df = pd.read_csv(file_path)
            except UnicodeDecodeError:
                df = pd.read_csv(file_path, encoding="latin1")

        elif file_path.endswith(".xlsx") or file_path.endswith(".xls"):
            df = pd.read_excel(file_path)

        else:
            raise ValueError(
                "Unsupported file format. Please upload CSV or Excel."
            )

        return df

    def clean_column_names(self, df):
        """
        Standardize column names to clean snake_case while preserving original meaning.
        """
        df = df.copy()

        cleaned_columns = []
        for col in df.columns:
            clean = str(col).strip().lower()
            clean = clean.replace(" ", "_")
            clean = pd.Series([clean]).str.replace(r"[^\w_]", "", regex=True).iloc[0]
            clean = pd.Series([clean]).str.replace(r"_+", "_", regex=True).iloc[0].strip("_")
            cleaned_columns.append(clean if clean else "unnamed_column")

        df.columns = cleaned_columns
        return df

    def get_dataset_overview(self, df):
        """
        Return basic structural information.
        """
        return {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "column_names": df.columns.tolist(),
            "memory_usage_mb": round(
                float(df.memory_usage(deep=True).sum() / (1024 * 1024)),
                2
            )
        }

    def get_data_types(self, df):
        """
        Return datatype information.
        """
        return {
            column: str(dtype)
            for column, dtype in df.dtypes.items()
        }

    def get_missing_values(self, df):
        """
        Analyse missing values.
        """
        missing = df.isnull().sum()
        missing_percentage = (df.isnull().mean() * 100).round(2)

        return {
            column: {
                "missing_count": int(missing[column]),
                "missing_percentage": float(missing_percentage[column])
            }
            for column in df.columns
        }

    def get_duplicate_count(self, df):
        """
        Count duplicate rows.
        """
        return int(df.duplicated().sum())

    def identify_column_types(self, df):
        """
        Separate numerical, categorical, and datetime columns.
        """
        numerical_columns = df.select_dtypes(
            include=np.number
        ).columns.tolist()

        categorical_columns = df.select_dtypes(
            include=["object", "category", "bool"]
        ).columns.tolist()

        datetime_columns = []
        for col in df.columns:
            if pd.api.types.is_datetime64_any_dtype(df[col]):
                datetime_columns.append(col)
            elif col in categorical_columns:
                # Test if converts to datetime cleanly
                try:
                    sample = df[col].dropna().head(20)
                    if not sample.empty:
                        converted = pd.to_datetime(sample, errors="coerce", format="mixed")
                        if converted.notna().mean() >= 0.80:
                            datetime_columns.append(col)
                except Exception:
                    pass

        # Avoid double listing
        categorical_columns = [c for c in categorical_columns if c not in datetime_columns]

        return {
            "numerical": numerical_columns,
            "categorical": categorical_columns,
            "datetime": datetime_columns
        }

    def get_numeric_statistics(self, df):
        """
        Generate descriptive statistics for numerical variables safely.
        """
        numerical_df = df.select_dtypes(include=np.number)

        if numerical_df.empty:
            return {}

        # Replace NaN / inf values in describe() output
        statistics = numerical_df.describe().round(2).fillna(0.0)
        return statistics.to_dict()

    def detect_outliers(self, df):
        """
        Detect potential outliers using the IQR method.
        """
        numerical_columns = df.select_dtypes(include=np.number).columns
        outlier_results = {}

        for column in numerical_columns:
            series = df[column].dropna()

            if len(series) < 4:
                outlier_results[column] = {
                    "outlier_count": 0,
                    "outlier_percentage": 0.0
                }
                continue

            q1 = float(series.quantile(0.25))
            q3 = float(series.quantile(0.75))
            iqr = q3 - q1

            if iqr == 0:
                outlier_count = 0
            else:
                lower_bound = q1 - 1.5 * iqr
                upper_bound = q3 + 1.5 * iqr
                outliers = series[(series < lower_bound) | (series > upper_bound)]
                outlier_count = int(len(outliers))

            outlier_results[column] = {
                "outlier_count": outlier_count,
                "outlier_percentage": round(
                    float(outlier_count / len(series) * 100) if len(series) > 0 else 0.0,
                    2
                )
            }

        return outlier_results

    def calculate_quality_score(self, df):
        """
        Calculate a comprehensive data quality score out of 100.
        """
        if df.empty:
            return 0.0

        score = 100.0
        total_cells = df.shape[0] * df.shape[1]

        if total_cells > 0:
            missing_cells = int(df.isnull().sum().sum())
            missing_ratio = missing_cells / total_cells
            score -= min(missing_ratio * 60, 40)

        duplicate_ratio = (df.duplicated().sum() / len(df)) if len(df) > 0 else 0
        score -= min(duplicate_ratio * 40, 30)

        # Penalty for constant columns
        constant_cols = sum(1 for col in df.columns if df[col].nunique(dropna=False) <= 1)
        score -= min(constant_cols * 5, 20)

        return round(max(score, 0.0), 2)

    def evaluate_predictive_readiness(self, df, concept_map):
        """
        Assess whether the dataset has structural readiness for predictive regression.
        """
        numerical_columns = df.select_dtypes(include=np.number).columns.tolist()
        row_count = len(df.dropna(how="all"))

        sales_concept = concept_map.get("concepts", {}).get("SALES", {})
        has_sales_target = sales_concept.get("identified", False)

        has_enough_rows = row_count >= 10
        has_predictors = len(numerical_columns) >= 2

        is_ready = has_enough_rows and has_predictors and has_sales_target

        reasons = []
        if not has_enough_rows:
            reasons.append(f"Insufficient sample size ({row_count} rows, minimum 10 required)")
        if not has_predictors:
            reasons.append("Insufficient numerical variables for feature modeling")
        if not has_sales_target:
            reasons.append("No primary commercial target variable identified with high confidence")

        return {
            "predictive_ready": is_ready,
            "target_candidate": sales_concept.get("primary_column"),
            "numerical_feature_count": max(len(numerical_columns) - 1, 0),
            "sample_size": row_count,
            "limitations": reasons if not is_ready else []
        }

    def generate_preprocessing_recommendations(self, df):
        """
        Generate actionable preprocessing recommendations based on dataset inspection.
        """
        recommendations = []

        missing_total = int(df.isnull().sum().sum())
        duplicates = int(df.duplicated().sum())

        if missing_total > 0:
            recommendations.append(
                "Handle missing values using appropriate median/mode imputation or record filtering."
            )

        if duplicates > 0:
            recommendations.append(
                "Deduplicate identical records before training statistical models."
            )

        numerical_columns = df.select_dtypes(include=np.number).columns.tolist()
        if numerical_columns:
            recommendations.append(
                "Consider feature scaling or standardization for numerical variables when required by the selected algorithm."
            )

        categorical_columns = df.select_dtypes(include=["object", "category", "bool"]).columns.tolist()
        if categorical_columns:
            recommendations.append(
                "Encode categorical dimensions (e.g. Region, Product) before multivariate regression."
            )

        if not recommendations:
            recommendations.append(
                "The dataset structure is clean and ready for downstream specialist analysis."
            )

        return recommendations