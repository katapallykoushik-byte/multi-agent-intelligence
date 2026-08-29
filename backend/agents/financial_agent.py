import pandas as pd
import numpy as np
from backend.services.data_processor import DataProcessor
from backend.services.concept_detector import ConceptDetector


class FinancialAnalysisAgent:
    """
    Financial Analysis Agent.

    Analyzes financial performance, profitability structures, unit economics,
    budget variances, and cross-references commercial volumes with margin health.
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
                    "agent": "Financial Analysis Agent",
                    "status": "error",
                    "message": "No dataset file or DataFrame provided."
                }
            try:
                df = self.processor.load_data(file_path)
            except Exception as e:
                return {
                    "agent": "Financial Analysis Agent",
                    "status": "error",
                    "message": f"Failed to load dataset: {str(e)}"
                }

        df = self.processor.clean_column_names(df)

        analysis = {}
        insights = []
        limitations = []

        # 2. IDENTIFY FINANCIAL & DIMENSIONAL COLUMNS VIA CONCEPTS
        concepts = (
            data_intelligence_report
            .get("detected_concepts", {})
            .get("concepts", {})
        )

        numeric_columns = df.select_dtypes(include=["number"]).columns.tolist()

        # Revenue resolution
        revenue_col = self._resolve_column(df, concepts, "REVENUE", ["revenue", "expected_revenue", "total_revenue", "sales", "turnover", "income"], numeric_columns)
        # Cost resolution
        cost_col = self._resolve_column(df, concepts, "COST", ["expected_cost", "total_cost", "cost", "production_cost", "expense", "cogs"], numeric_columns)
        # Profit resolution
        profit_col = self._resolve_column(df, concepts, "PROFIT", ["expected_profit", "total_profit", "profit", "net_profit", "margin", "earnings"], numeric_columns)
        # Budget resolution
        budget_col = self._resolve_column(df, concepts, None, ["available_budget", "budget", "allocated_budget", "target_budget"], numeric_columns)
        # Dimensions
        product_col = concepts.get("PRODUCT", {}).get("primary_column")
        region_col = concepts.get("REGION", {}).get("primary_column")

        # Fallback: if revenue & cost exist but no profit column, compute synthetic profit
        if revenue_col and cost_col and not profit_col:
            df["computed_profit"] = df[revenue_col] - df[cost_col]
            profit_col = "computed_profit"

        # ----------------------------------------
        # 3. FINANCIAL SUMMARY & REVENUE / COST / PROFIT
        # ----------------------------------------
        financial_summary = {}
        tot_rev = 0.0
        tot_cost = 0.0
        tot_profit = 0.0

        if revenue_col and revenue_col in df.columns:
            rev_series = pd.to_numeric(df[revenue_col], errors="coerce").dropna()
            if not rev_series.empty:
                tot_rev = float(rev_series.sum())
                avg_rev = float(rev_series.mean())
                min_rev = float(rev_series.min())
                max_rev = float(rev_series.max())

                rev_dict = {
                    "column": revenue_col,
                    "total_revenue": round(tot_rev, 2),
                    "average_revenue": round(avg_rev, 2),
                    "minimum_revenue": round(min_rev, 2),
                    "maximum_revenue": round(max_rev, 2)
                }
                analysis["revenue_analysis"] = rev_dict
                financial_summary["revenue"] = rev_dict
                insights.append(
                    f"Total {revenue_col.replace('_', ' ').title()} generated is {round(tot_rev, 2):,} (average {round(avg_rev, 2):,} per record)."
                )
        else:
            limitations.append("No high-confidence revenue or income column identified in the dataset.")

        if cost_col and cost_col in df.columns:
            cost_series = pd.to_numeric(df[cost_col], errors="coerce").dropna()
            if not cost_series.empty:
                tot_cost = float(cost_series.sum())
                avg_cost = float(cost_series.mean())
                min_cost = float(cost_series.min())
                max_cost = float(cost_series.max())

                cost_dict = {
                    "column": cost_col,
                    "total_cost": round(tot_cost, 2),
                    "average_cost": round(avg_cost, 2),
                    "minimum_cost": round(min_cost, 2),
                    "maximum_cost": round(max_cost, 2)
                }
                analysis["cost_analysis"] = cost_dict
                financial_summary["cost"] = cost_dict
                insights.append(
                    f"Total {cost_col.replace('_', ' ').title()} incurred is {round(tot_cost, 2):,}."
                )
        else:
            limitations.append("No distinct cost or expense variable identified.")

        if profit_col and profit_col in df.columns:
            profit_series = pd.to_numeric(df[profit_col], errors="coerce").dropna()
            if not profit_series.empty:
                tot_profit = float(profit_series.sum())
                avg_profit = float(profit_series.mean())
                min_profit = float(profit_series.min())
                max_profit = float(profit_series.max())

                profit_dict = {
                    "column": profit_col,
                    "total_profit": round(tot_profit, 2),
                    "average_profit": round(avg_profit, 2),
                    "minimum_profit": round(min_profit, 2),
                    "maximum_profit": round(max_profit, 2)
                }
                analysis["profit_analysis"] = profit_dict
                financial_summary["profit"] = profit_dict
                insights.append(
                    f"Total Net Profit is {round(tot_profit, 2):,} (average {round(avg_profit, 2):,} per transaction)."
                )
        else:
            limitations.append("Profit could not be directly extracted or derived.")

        analysis["financial_summary"] = financial_summary

        # ----------------------------------------
        # 4. KEY FINANCIAL METRICS & MARGINS
        # ----------------------------------------
        key_metrics = {}

        if tot_rev > 0:
            margin_pct = (tot_profit / tot_rev) * 100
            cost_ratio_pct = (tot_cost / tot_rev) * 100 if tot_cost > 0 else 0.0

            key_metrics["profit_margin_pct"] = round(margin_pct, 2)
            key_metrics["cost_to_revenue_ratio_pct"] = round(cost_ratio_pct, 2)
            if tot_cost > 0:
                roi_pct = (tot_profit / tot_cost) * 100
                key_metrics["return_on_cost_roi_pct"] = round(roi_pct, 2)

            analysis["profitability"] = {
                "profit_margin": round(margin_pct, 2),
                "cost_to_revenue_ratio": round(cost_ratio_pct, 2)
            }
            insights.append(
                f"Overall business profit margin stands at {round(margin_pct, 2)}% with a cost-to-revenue ratio of {round(cost_ratio_pct, 2)}%."
            )

        analysis["key_metrics"] = key_metrics

        # ----------------------------------------
        # 5. SEGMENT PROFITABILITY (PRODUCT & REGION)
        # ----------------------------------------
        profitability_analysis = {}

        if profit_col and profit_col in df.columns:
            # By Product
            if product_col and product_col in df.columns:
                try:
                    product_profit = df.groupby(product_col)[profit_col].sum().sort_values(ascending=False)
                    profitability_analysis["product_profitability"] = {
                        str(k): round(float(v), 2)
                        for k, v in product_profit.head(10).items()
                    }
                    top_prod = product_profit.index[0]
                    top_prod_profit = product_profit.iloc[0]
                    insights.append(
                        f"Most profitable product is '{top_prod}' generating {round(float(top_prod_profit), 2):,} in net earnings."
                    )
                except Exception:
                    pass

            # By Region
            if region_col and region_col in df.columns:
                try:
                    region_profit = df.groupby(region_col)[profit_col].sum().sort_values(ascending=False)
                    profitability_analysis["regional_profitability"] = {
                        str(k): round(float(v), 2)
                        for k, v in region_profit.items()
                    }
                    top_reg = region_profit.index[0]
                    top_reg_profit = region_profit.iloc[0]
                    insights.append(
                        f"Leading territory for profitability is '{top_reg}' contributing {round(float(top_reg_profit), 2):,}."
                    )

                    # AGENT COLLABORATION: Cross-reference with Commercial Findings
                    commercial_regions = shared_context.get("commercial", {}).get("analysis", {}).get("regional_performance", {})
                    if commercial_regions:
                        top_sales_reg = list(commercial_regions.keys())[0] if commercial_regions else None
                        if top_sales_reg and top_sales_reg != top_reg:
                            insights.append(
                                f"Cross-Agent Signal: Highest sales volume occurs in '{top_sales_reg}', but highest net profitability is in '{top_reg}', indicating margin variance across territories."
                            )
                except Exception:
                    pass

        analysis["profitability_analysis"] = profitability_analysis

        # ----------------------------------------
        # 6. VARIANCE ANALYSIS (BUDGET VS COST)
        # ----------------------------------------
        variance_analysis = {}

        if budget_col and budget_col in df.columns and cost_col and cost_col in df.columns:
            tot_budget = float(df[budget_col].sum())
            tot_actual_cost = float(df[cost_col].sum())
            variance = tot_budget - tot_actual_cost
            utilization_pct = (tot_actual_cost / tot_budget * 100) if tot_budget > 0 else 0.0

            variance_analysis = {
                "budget_column": budget_col,
                "total_budget": round(tot_budget, 2),
                "total_actual_cost": round(tot_actual_cost, 2),
                "budget_variance": round(variance, 2),
                "budget_utilization_pct": round(utilization_pct, 2),
                "status": "Under Budget" if variance >= 0 else "Over Budget"
            }
            insights.append(
                f"Budget utilization is at {round(utilization_pct, 1)}% with a remaining surplus of {round(variance, 2):,} ({variance_analysis['status']})."
            )
        else:
            limitations.append("Budget variance analysis omitted (no allocated budget variable detected).")

        analysis["variance_analysis"] = variance_analysis
        analysis["limitations"] = limitations

        if not insights:
            insights.append("Financial evaluation completed with available structured data.")

        return {
            "agent": "Financial Analysis Agent",
            "status": "completed",
            "business_problem": business_problem,
            "analysis": analysis,
            "key_insights": insights,
            "limitations": limitations
        }

    def _resolve_column(self, df, concepts, concept_key, candidate_keywords, numeric_columns):
        if concept_key:
            col = concepts.get(concept_key, {}).get("primary_column")
            if col and col in numeric_columns:
                return col

        for kw in candidate_keywords:
            for col in numeric_columns:
                if kw in col.lower():
                    return col
        return None