import re
import pandas as pd
import numpy as np


class ConceptDetector:
    """
    Adaptive Concept and Semantic Column Detection Engine.

    Progressively infers business concepts from unfamiliar datasets using:
    - Lexical pattern and keyword matching (normalized tokenization)
    - Data type constraints (numeric vs categorical vs datetime)
    - Statistical distribution characteristics (cardinality, non-negativity, variance)
    - Value range and unique ratio heuristics
    - Confidence scoring (High, Medium, Low, None)
    """

    CONCEPT_DEFINITIONS = {
        "SALES": {
            "keywords": [
                "sales", "historical_sales", "total_sales", "gross_sales", 
                "net_sales", "sales_amount", "order_value", "turnover", 
                "transaction_amount", "revenue", "amount"
            ],
            "exact_matches": ["sales", "turnover", "historical_sales", "revenue"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Commercial sales or turnover figures"
        },
        "REVENUE": {
            "keywords": [
                "revenue", "expected_revenue", "total_revenue", "gross_revenue", 
                "income", "turnover", "sales_revenue", "topline"
            ],
            "exact_matches": ["revenue", "total_revenue", "expected_revenue", "income"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Total revenue or financial income generated"
        },
        "COST": {
            "keywords": [
                "cost", "expected_cost", "total_cost", "production_cost", 
                "cogs", "expense", "expenditure", "operating_cost", 
                "production_cost_per_unit", "unit_cost"
            ],
            "exact_matches": ["cost", "total_cost", "production_cost", "cogs", "expense"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Direct, operational, or unit costs"
        },
        "PROFIT": {
            "keywords": [
                "profit", "expected_profit", "total_profit", "net_profit", 
                "gross_profit", "margin", "net_income", "earnings", "operating_profit"
            ],
            "exact_matches": ["profit", "total_profit", "net_profit", "expected_profit"],
            "expected_type": "numeric",
            "must_be_positive": False,
            "description": "Gross or net profit margins"
        },
        "PRODUCT": {
            "keywords": [
                "product", "product_id", "product_name", "item", "item_id", 
                "item_name", "sku", "sku_id", "part_number", "good", "article"
            ],
            "exact_matches": ["product", "product_id", "product_name", "item", "sku"],
            "expected_type": "categorical_or_id",
            "max_unique_ratio": 0.85,
            "description": "Product identifier, name, or SKU"
        },
        "REGION": {
            "keywords": [
                "region", "territory", "location", "area", "market", 
                "country", "state", "city", "zone", "branch", "district"
            ],
            "exact_matches": ["region", "territory", "location", "market", "area", "zone"],
            "expected_type": "categorical",
            "max_unique_ratio": 0.35,
            "description": "Geographical region, territory, or location"
        },
        "CUSTOMER": {
            "keywords": [
                "customer", "client", "buyer", "user", "account", 
                "customer_id", "client_id", "purchaser", "customer_name"
            ],
            "exact_matches": ["customer", "customer_id", "client", "client_id"],
            "expected_type": "any",
            "description": "Customer identifier or profile"
        },
        "DEMAND": {
            "keywords": [
                "demand", "predicted_demand", "customer_orders", "orders", 
                "units_ordered", "quantity", "qty", "volume", "units_sold"
            ],
            "exact_matches": ["demand", "predicted_demand", "customer_orders", "quantity", "volume"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Demand volume, orders, or units"
        },
        "PRICE": {
            "keywords": [
                "price", "selling_price", "selling_price_per_unit", "unit_price", 
                "rate", "mrp", "retail_price", "list_price"
            ],
            "exact_matches": ["price", "selling_price", "selling_price_per_unit", "unit_price"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Unit pricing or retail rates"
        },
        "SUPPLIER": {
            "keywords": [
                "supplier", "vendor", "provider", "distributor", "source", "supplier_name"
            ],
            "exact_matches": ["supplier", "vendor"],
            "expected_type": "categorical",
            "description": "Supplier or vendor entity"
        },
        "INVENTORY": {
            "keywords": [
                "inventory", "inventory_level", "stock", "stock_level", 
                "units_in_stock", "on_hand", "warehouse_stock"
            ],
            "exact_matches": ["inventory", "inventory_level", "stock", "stock_level"],
            "expected_type": "numeric",
            "must_be_positive": True,
            "description": "Available stock or inventory units"
        },
        "OPERATIONS": {
            "keywords": [
                "capacity", "production_capacity", "machine_utilization", 
                "workforce_availability", "lead_time", "delivery_delay", 
                "supplier_reliability", "delay_days", "utilization_percent"
            ],
            "exact_matches": ["production_capacity", "machine_utilization_percent", "supplier_lead_time_days"],
            "expected_type": "numeric",
            "description": "Operational parameters, utilization, or lead time"
        },
        "DATE_TIME": {
            "keywords": [
                "date", "timestamp", "datetime", "time", "day", "month", "year", "period"
            ],
            "exact_matches": ["date", "timestamp", "datetime"],
            "expected_type": "datetime",
            "description": "Temporal marker or timestamp"
        },
        "IDENTIFIER": {
            "keywords": [
                "id", "code", "number", "serial", "invoice", "transaction", "uuid", "key"
            ],
            "exact_matches": ["id", "code", "invoice_no", "transaction_id"],
            "expected_type": "id",
            "description": "Unique key or transaction identifier"
        }
    }

    def detect_concepts(self, df: pd.DataFrame) -> dict:
        """
        Scan all columns of a dataframe and return a comprehensive concept registry.
        """
        if df.empty or df.shape[1] == 0:
            return {}

        concept_results = {}
        column_mappings = {}

        # 1. Score each concept against all columns
        for concept_name, rules in self.CONCEPT_DEFINITIONS.items():
            candidates = []

            for column in df.columns:
                score, rationale = self._score_column_for_concept(df, column, rules)
                if score > 0.25:
                    confidence = self._get_confidence_tier(score)
                    candidates.append({
                        "column": str(column),
                        "score": round(float(score), 3),
                        "confidence": confidence,
                        "rationale": rationale
                    })

            # Sort candidates by score descending
            candidates.sort(key=lambda x: x["score"], reverse=True)

            primary_candidate = candidates[0] if candidates else None

            concept_results[concept_name] = {
                "concept": concept_name,
                "description": rules["description"],
                "identified": bool(primary_candidate and primary_candidate["score"] >= 0.40),
                "primary_column": primary_candidate["column"] if (primary_candidate and primary_candidate["score"] >= 0.40) else None,
                "confidence": primary_candidate["confidence"] if (primary_candidate and primary_candidate["score"] >= 0.40) else "None",
                "score": primary_candidate["score"] if (primary_candidate and primary_candidate["score"] >= 0.40) else 0.0,
                "rationale": primary_candidate["rationale"] if (primary_candidate and primary_candidate["score"] >= 0.40) else "No matching column identified.",
                "all_candidates": candidates[:4]
            }

        # 2. Build reverse column -> concept map
        for column in df.columns:
            best_concept = None
            best_score = 0.0
            best_conf = "None"

            for concept_name, result in concept_results.items():
                for cand in result.get("all_candidates", []):
                    if cand["column"] == str(column) and cand["score"] > best_score:
                        best_score = cand["score"]
                        best_concept = concept_name
                        best_conf = cand["confidence"]

            column_mappings[str(column)] = {
                "inferred_concept": best_concept if best_score >= 0.40 else "UNCLASSIFIED",
                "confidence": best_conf if best_score >= 0.40 else "None",
                "score": round(best_score, 3)
            }

        return {
            "concepts": concept_results,
            "column_classifications": column_mappings,
            "summary": {
                "detected_count": sum(1 for c in concept_results.values() if c["identified"]),
                "high_confidence_concepts": [
                    c["concept"] for c in concept_results.values() if c["confidence"] == "High"
                ]
            }
        }

    def _score_column_for_concept(self, df: pd.DataFrame, column: str, rules: dict) -> tuple[float, str]:
        """
        Compute multi-factor score for a single column against concept rules.
        """
        col_str = str(column).lower().strip()
        col_series = df[column]
        score = 0.0
        reasons = []

        is_numeric = pd.api.types.is_numeric_dtype(col_series)
        is_datetime = pd.api.types.is_datetime64_any_dtype(col_series)
        is_object = pd.api.types.is_object_dtype(col_series) or pd.api.types.is_string_dtype(col_series) or pd.api.types.is_categorical_dtype(col_series)

        # 1. Lexical Exact Match Check
        if col_str in rules.get("exact_matches", []):
            score += 0.55
            reasons.append("Exact lexical match on standard business term")
        elif any(k in col_str for k in rules.get("keywords", [])):
            matched_kw = [k for k in rules["keywords"] if k in col_str][0]
            # Reward earlier position or cleaner token match
            if col_str.startswith(matched_kw) or col_str.endswith(matched_kw):
                score += 0.40
            else:
                score += 0.30
            reasons.append(f"Contains keyword '{matched_kw}'")
        else:
            # Word boundary regex search
            for kw in rules.get("keywords", []):
                pattern = r"\b" + re.escape(kw.replace("_", " ")) + r"\b"
                if re.search(pattern, col_str.replace("_", " ")):
                    score += 0.35
                    reasons.append(f"Semantic phrase match '{kw}'")
                    break

        if score == 0.0:
            return 0.0, "No keyword correlation"

        # 2. Type Suitability Evaluation
        expected_type = rules.get("expected_type", "any")

        if expected_type == "numeric":
            if is_numeric:
                score += 0.30
                reasons.append("Numeric data type confirmed")
                # Statistical check
                clean_series = col_series.dropna()
                if not clean_series.empty:
                    if rules.get("must_be_positive", False) and (clean_series >= 0).all():
                        score += 0.10
                        reasons.append("Positive value range consistent with business metric")
                    # Variance check - non-constant
                    if clean_series.nunique() > 1:
                        score += 0.05
            else:
                # Heavy penalty if expected numeric but is string
                score -= 0.40
                reasons.append("Non-numeric data type contradicts concept expectation")

        elif expected_type == "categorical":
            if is_object or (is_numeric and col_series.nunique() < 30):
                score += 0.25
                reasons.append("Discrete / categorical structure confirmed")
                unique_ratio = col_series.nunique(dropna=True) / max(len(col_series), 1)
                max_ratio = rules.get("max_unique_ratio", 0.50)
                if unique_ratio <= max_ratio:
                    score += 0.15
                    reasons.append(f"Moderate cardinality (unique ratio {round(unique_ratio, 2)}) fits category profile")
            else:
                score -= 0.30

        elif expected_type == "datetime":
            if is_datetime:
                score += 0.45
                reasons.append("Native datetime dtype")
            else:
                try:
                    converted = pd.to_datetime(col_series.dropna().head(20), errors="coerce", format="mixed")
                    if converted.notna().mean() >= 0.70:
                        score += 0.35
                        reasons.append("Values parse cleanly to timestamps")
                except Exception:
                    score -= 0.20

        elif expected_type == "id":
            unique_ratio = col_series.nunique(dropna=True) / max(len(col_series), 1)
            if unique_ratio >= 0.85 or any(k in col_str for k in ["id", "code", "key", "number"]):
                score += 0.30
                reasons.append(f"High uniqueness ratio ({round(unique_ratio, 2)}) characteristic of identifier")

        final_score = max(min(score, 1.0), 0.0)
        rationale = "; ".join(reasons) if reasons else "Partial heuristic correlation"
        return final_score, rationale

    def _get_confidence_tier(self, score: float) -> str:
        if score >= 0.75:
            return "High"
        elif score >= 0.50:
            return "Medium"
        elif score >= 0.30:
            return "Low"
        return "None"

    def identify_target_derivatives(self, df: pd.DataFrame, target_column: str) -> list[str]:
        """
        Identify columns that are direct mathematical or semantic derivatives of the target variable
        to prevent target leakage during regression or predictive modeling.
        """
        if not target_column or target_column not in df.columns:
            return []

        leakage_columns = set()
        target_clean = str(target_column).lower()

        # 1. Semantic financial/target derivatives
        derivative_terms = [
            "expected_revenue", "expected_profit", "expected_cost", 
            "revenue", "profit", "total_sales", "margin", "optimal_production", 
            "predicted_demand", "risk_score"
        ]

        for col in df.columns:
            col_str = str(col).lower()
            if col == target_column:
                continue

            # Direct name overlap or derivative naming
            if any(term in col_str for term in derivative_terms) and any(term in target_clean for term in ["sale", "revenue", "profit", "cost", "demand"]):
                leakage_columns.add(col)
                continue

            # Identifier columns should not be numerical features
            if any(k in col_str for k in ["_id", "id", "code", "invoice", "serial", "number"]):
                leakage_columns.add(col)
                continue

            # 2. Check empirical correlation if both numeric
            if pd.api.types.is_numeric_dtype(df[col]) and pd.api.types.is_numeric_dtype(df[target_column]):
                clean_pair = df[[col, target_column]].dropna()
                if len(clean_pair) >= 5:
                    std_col = clean_pair[col].std()
                    std_tgt = clean_pair[target_column].std()
                    if std_col > 0 and std_tgt > 0:
                        corr = clean_pair[col].corr(clean_pair[target_column])
                        # Abs correlation > 0.98 indicates potential direct target proxy/collinearity
                        if abs(corr) >= 0.98:
                            leakage_columns.add(col)

        return list(leakage_columns)
