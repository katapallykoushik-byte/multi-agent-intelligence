import pandas as pd
import numpy as np
from backend.services.data_processor import DataProcessor
from backend.services.concept_detector import ConceptDetector


class OperationsAnalysisAgent:
    """
    Operations Analysis Agent.

    Analyzes operational efficiency, supply chain stability, capacity bottlenecks,
    supplier scorecards, lead times, and delivery delays.
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
                    "agent": "Operations Analysis Agent",
                    "status": "error",
                    "message": "No dataset file or DataFrame provided."
                }
            try:
                df = self.processor.load_data(file_path)
            except Exception as e:
                return {
                    "agent": "Operations Analysis Agent",
                    "status": "error",
                    "message": f"Failed to load dataset: {str(e)}"
                }

        df = self.processor.clean_column_names(df)

        analysis = {}
        insights = []
        limitations = []

        # 2. IDENTIFY OPERATIONAL COLUMNS VIA CONCEPTS & HEURISTICS
        concepts = (
            data_intelligence_report
            .get("detected_concepts", {})
            .get("concepts", {})
        )

        numeric_columns = df.select_dtypes(include=["number"]).columns.tolist()

        inventory_col = self._find_col(df, concepts, "INVENTORY", ["inventory_level", "inventory", "stock", "stock_level", "units_in_stock"], numeric_columns)
        capacity_col = self._find_col(df, concepts, "OPERATIONS", ["production_capacity", "capacity", "max_capacity"], numeric_columns)
        utilization_col = self._find_col(df, concepts, None, ["machine_utilization_percent", "machine_utilization", "utilization", "plant_utilization"], numeric_columns)
        workforce_col = self._find_col(df, concepts, None, ["workforce_availability_percent", "workforce_availability", "workforce", "labor_capacity"], numeric_columns)
        lead_time_col = self._find_col(df, concepts, None, ["supplier_lead_time_days", "lead_time_days", "lead_time", "procurement_time"], numeric_columns)
        delay_col = self._find_col(df, concepts, None, ["delivery_delay_days", "delivery_delay", "delay_days", "shipping_delay"], numeric_columns)
        demand_col = self._find_col(df, concepts, "DEMAND", ["customer_orders", "predicted_demand", "demand", "order_volume", "orders"], numeric_columns)
        supplier_col = concepts.get("SUPPLIER", {}).get("primary_column") or self._find_categorical_col(df, ["supplier", "vendor", "distributor", "provider"])
        region_col = concepts.get("REGION", {}).get("primary_column")

        # ----------------------------------------
        # 3. OPERATIONAL SUMMARY
        # ----------------------------------------
        summary = {}

        if inventory_col:
            inv_series = pd.to_numeric(df[inventory_col], errors="coerce").dropna()
            summary["inventory"] = {
                "column": inventory_col,
                "total_inventory": round(float(inv_series.sum()), 2),
                "average_inventory": round(float(inv_series.mean()), 2),
                "min_inventory": round(float(inv_series.min()), 2),
                "max_inventory": round(float(inv_series.max()), 2)
            }
            insights.append(
                f"Average inventory on hand is {round(float(inv_series.mean()), 1):,} units with total buffer of {round(float(inv_series.sum()), 1):,}."
            )
        else:
            limitations.append("Inventory level data was not detected in the dataset.")

        if capacity_col:
            cap_series = pd.to_numeric(df[capacity_col], errors="coerce").dropna()
            summary["production_capacity"] = {
                "column": capacity_col,
                "average_capacity": round(float(cap_series.mean()), 2),
                "max_capacity": round(float(cap_series.max()), 2)
            }
            insights.append(
                f"Average daily/unit production capacity is {round(float(cap_series.mean()), 1):,} units."
            )

        if utilization_col:
            util_series = pd.to_numeric(df[utilization_col], errors="coerce").dropna()
            avg_util = float(util_series.mean())
            summary["machine_utilization"] = {
                "column": utilization_col,
                "average_utilization_pct": round(avg_util, 2),
                "max_utilization_pct": round(float(util_series.max()), 2)
            }
            insights.append(
                f"Machine utilization averages {round(avg_util, 1)}% across operational runs."
            )

        if workforce_col:
            wf_series = pd.to_numeric(df[workforce_col], errors="coerce").dropna()
            summary["workforce_availability"] = {
                "column": workforce_col,
                "average_availability_pct": round(float(wf_series.mean()), 2)
            }

        if lead_time_col:
            lt_series = pd.to_numeric(df[lead_time_col], errors="coerce").dropna()
            summary["lead_time"] = {
                "column": lead_time_col,
                "average_lead_time_days": round(float(lt_series.mean()), 2),
                "max_lead_time_days": round(float(lt_series.max()), 2)
            }
            insights.append(
                f"Supplier procurement lead time averages {round(float(lt_series.mean()), 1)} days (peak: {round(float(lt_series.max()), 1)} days)."
            )

        if delay_col:
            del_series = pd.to_numeric(df[delay_col], errors="coerce").dropna()
            delayed_count = int((del_series > 0).sum())
            delay_pct = (delayed_count / len(del_series) * 100) if len(del_series) > 0 else 0.0
            summary["delivery_delays"] = {
                "column": delay_col,
                "average_delay_days": round(float(del_series.mean()), 2),
                "max_delay_days": round(float(del_series.max()), 2),
                "delayed_orders_pct": round(delay_pct, 2)
            }
            insights.append(
                f"Delivery delays occur in {round(delay_pct, 1)}% of fulfillment operations, averaging {round(float(del_series.mean()), 1)} days."
            )

        analysis["operational_summary"] = summary

        # ----------------------------------------
        # 4. BOTTLENECKS & CAPACITY CONSTRAINTS
        # ----------------------------------------
        bottlenecks = {}

        if capacity_col and demand_col:
            cap_series = pd.to_numeric(df[capacity_col], errors="coerce")
            dem_series = pd.to_numeric(df[demand_col], errors="coerce")
            valid_mask = cap_series.notna() & dem_series.notna()

            deficit_mask = valid_mask & (dem_series > cap_series)
            deficit_count = int(deficit_mask.sum())
            total_valid = int(valid_mask.sum())
            deficit_pct = (deficit_count / total_valid * 100) if total_valid > 0 else 0.0

            if deficit_count > 0:
                max_deficit = float((dem_series[deficit_mask] - cap_series[deficit_mask]).max())
                bottlenecks["capacity_deficit"] = {
                    "constrained_cycles_count": deficit_count,
                    "constrained_cycles_pct": round(deficit_pct, 2),
                    "max_demand_deficit_units": round(max_deficit, 2),
                    "status": "Capacity Bottleneck Detected"
                }
                insights.append(
                    f"Operational Bottleneck: Demand exceeds production capacity in {deficit_count} instances ({round(deficit_pct, 1)}% of cycles), creating unmet order risks."
                )
            else:
                bottlenecks["capacity_deficit"] = {
                    "constrained_cycles_count": 0,
                    "status": "Adequate Capacity (No Deficits)"
                }

        if utilization_col:
            util_series = pd.to_numeric(df[utilization_col], errors="coerce").dropna()
            high_stress_count = int((util_series >= 85.0).sum())
            if high_stress_count > 0:
                bottlenecks["equipment_stress"] = {
                    "high_utilization_cycles_count": high_stress_count,
                    "high_utilization_pct": round(high_stress_count / len(util_series) * 100, 2),
                    "threshold_pct": 85.0
                }
                insights.append(
                    f"Machine Stress: {high_stress_count} cycles ({round(high_stress_count / len(util_series) * 100, 1)}%) operate above 85% utilization threshold."
                )

        analysis["bottlenecks_and_constraints"] = bottlenecks

        # ----------------------------------------
        # 5. SUPPLIER PERFORMANCE SCORECARD
        # ----------------------------------------
        supplier_scorecard = {}

        if supplier_col and supplier_col in df.columns:
            try:
                # Group by supplier
                agg_dict = {}
                rel_col = self._find_col(df, concepts, None, ["supplier_reliability", "reliability", "quality_rating"], numeric_columns)

                if lead_time_col and lead_time_col in df.columns:
                    agg_dict[lead_time_col] = "mean"
                if rel_col and rel_col in df.columns:
                    agg_dict[rel_col] = "mean"
                if delay_col and delay_col in df.columns:
                    agg_dict[delay_col] = "mean"

                if agg_dict:
                    sup_grouped = df.groupby(supplier_col).agg(agg_dict)

                    for supplier_name, row in sup_grouped.iterrows():
                        entry = {}
                        if lead_time_col in row:
                            entry["avg_lead_time_days"] = round(float(row[lead_time_col]), 2)
                        if rel_col in row:
                            entry["avg_reliability_score"] = round(float(row[rel_col]), 2)
                        if delay_col in row:
                            entry["avg_delivery_delay_days"] = round(float(row[delay_col]), 2)

                        supplier_scorecard[str(supplier_name)] = entry

                    analysis["supplier_performance"] = supplier_scorecard

                    # Find best and worst suppliers
                    if rel_col and rel_col in sup_grouped.columns:
                        best_sup = sup_grouped[rel_col].idxmax()
                        worst_sup = sup_grouped[rel_col].idxmin()
                        insights.append(
                            f"Supplier Benchmark: Top reliable vendor is '{best_sup}' (Reliability: {round(float(sup_grouped[rel_col].max()), 2)}), while '{worst_sup}' has lowest reliability ({round(float(sup_grouped[rel_col].min()), 2)})."
                        )
            except Exception:
                pass
        else:
            limitations.append("Supplier attribution not present for vendor benchmarking.")

        # ----------------------------------------
        # 6. REGIONAL LOGISTICS & INTER-AGENT SIGNALS
        # ----------------------------------------
        if region_col and region_col in df.columns and delay_col and delay_col in df.columns:
            try:
                reg_delays = df.groupby(region_col)[delay_col].mean().sort_values(ascending=False)
                analysis["regional_fulfillment"] = {
                    str(k): round(float(v), 2)
                    for k, v in reg_delays.items()
                }
                worst_reg = reg_delays.index[0]
                worst_delay = reg_delays.iloc[0]
                insights.append(
                    f"Territory Delivery Variance: Region '{worst_reg}' encounters the highest fulfillment delays ({round(float(worst_delay), 2)} days avg)."
                )

                # Cross-reference with Commercial high demand regions
                commercial_top_reg = list(shared_context.get("commercial", {}).get("analysis", {}).get("regional_performance", {}).keys())
                if commercial_top_reg and worst_reg == commercial_top_reg[0]:
                    insights.append(
                        f"Cross-Agent Critical Signal: Region '{worst_reg}' generates the highest commercial sales volume but simultaneously suffers from the longest delivery delays, signaling acute fulfillment bottleneck risk."
                    )
            except Exception:
                pass

        analysis["limitations"] = limitations

        if not insights:
            insights.append("Operational evaluation completed with available parameters.")

        return {
            "agent": "Operations Analysis Agent",
            "status": "completed",
            "business_problem": business_problem,
            "analysis": analysis,
            "key_insights": insights,
            "limitations": limitations
        }

    def _find_col(self, df, concepts, concept_key, candidate_keywords, numeric_columns):
        if concept_key:
            col = concepts.get(concept_key, {}).get("primary_column")
            if col and col in numeric_columns:
                return col
        for kw in candidate_keywords:
            for col in numeric_columns:
                if kw in col.lower():
                    return col
        return None

    def _find_categorical_col(self, df, candidate_keywords):
        cat_cols = df.select_dtypes(include=["object", "category"]).columns.tolist()
        for kw in candidate_keywords:
            for col in cat_cols:
                if kw in col.lower():
                    return col
        return None
