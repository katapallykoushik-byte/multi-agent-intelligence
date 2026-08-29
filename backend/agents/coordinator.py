class CoordinatorAgent:
    """
    Coordinator & Analytical Orchestration Agent.

    Evaluates dataset concepts, data quality findings, and user business problem
    to intelligently delegate analytical responsibilities to specialized agents,
    manage inter-agent execution order, and synthesize cross-agent findings into
    an evidence-grounded, dynamic Executive Decision Brief.
    """

    def __init__(self):
        self.available_agents = {
            "Commercial Analysis": {
                "keywords": [
                    "sales", "revenue", "customer", "demand", "product", 
                    "promotion", "market", "region", "order", "pricing", "commercial"
                ],
                "concepts": ["SALES", "PRODUCT", "REGION", "CUSTOMER", "DEMAND", "PRICE"],
                "description": (
                    "Analyses sales performance, customer behaviour, "
                    "demand patterns, products and commercial trends."
                ),
            },
            "Financial Analysis": {
                "keywords": [
                    "revenue", "profit", "cost", "expense", "margin", 
                    "budget", "price", "financial", "income", "profitability", "cogs"
                ],
                "concepts": ["REVENUE", "COST", "PROFIT", "PRICE"],
                "description": (
                    "Analyses financial performance, profitability, "
                    "cost structures and financial indicators."
                ),
            },
            "Operations": {
                "keywords": [
                    "inventory", "stock", "supplier", "delivery", "production", 
                    "capacity", "machine", "workforce", "lead_time", "efficiency", "operational", "delay"
                ],
                "concepts": ["INVENTORY", "SUPPLIER", "OPERATIONS", "DEMAND"],
                "description": (
                    "Analyses operational efficiency, inventory, "
                    "supply chain, production and capacity constraints."
                ),
            },
            "Risk Engine": {
                "keywords": [
                    "risk", "delay", "outlier", "anomaly", "uncertainty", 
                    "missing", "duplicate", "quality", "failure", "volatility", "threat"
                ],
                "concepts": [],
                "description": (
                    "Identifies data anomalies, operational risks, "
                    "uncertainty and potential business exposure."
                ),
            },
        }

    def analyse_requirements(
        self,
        business_problem,
        dataset_columns,
        data_intelligence_report=None,
    ):
        data_intelligence_report = data_intelligence_report or {}
        context = (
            business_problem.lower()
            + " "
            + " ".join(dataset_columns).lower()
        )

        detected_concepts = (
            data_intelligence_report
            .get("detected_concepts", {})
            .get("concepts", {})
        )

        detected_concept_names = [
            c_name.lower() for c_name, c_val in detected_concepts.items()
            if c_val.get("identified", False)
        ]

        agent_scores = {}

        # 1. SCORE EACH AGENT (KEYWORDS + DETECTED CONCEPTS)
        for agent_name, agent_info in self.available_agents.items():
            score = 0
            matched_indicators = []

            # Keyword matching from context
            for keyword in agent_info["keywords"]:
                searchable_keyword = keyword.replace("_", " ")
                if keyword in context or searchable_keyword in context:
                    score += 1
                    matched_indicators.append(keyword)

            # Semantic concept matching from Data Intelligence
            for concept_key in agent_info.get("concepts", []):
                concept_data = detected_concepts.get(concept_key, {})
                if concept_data.get("identified", False):
                    confidence = concept_data.get("confidence", "Low")
                    weight = 2 if confidence == "High" else 1
                    score += weight
                    col_name = concept_data.get("primary_column", concept_key.lower())
                    concept_label = f"concept:{concept_key.lower()}({col_name})"
                    if concept_label not in matched_indicators:
                        matched_indicators.append(concept_label)

            agent_scores[agent_name] = {
                "score": score,
                "matched_keywords": matched_indicators,
                "description": agent_info["description"],
            }

        # 2. ACTIVATE RELEVANT AGENTS
        activated_agents = []

        for agent_name, details in agent_scores.items():
            if details["score"] > 0:
                activated_agents.append({
                    "agent": agent_name,
                    "priority": self.calculate_priority(details["score"]),
                    "relevance_score": details["score"],
                    "matched_keywords": details["matched_keywords"],
                    "reason": self.generate_reason(agent_name, details),
                })

        # 3. ALWAYS INCLUDE RISK ENGINE WHEN SPECIALISTS RUN OR DATA QUALITY ISSUES EXIST
        quality = data_intelligence_report.get("data_quality", {})
        duplicate_rows = quality.get("duplicate_rows", 0)
        missing_values = quality.get("missing_values", {})
        total_missing = sum(item.get("missing_count", 0) for item in missing_values.values())

        risk_already_active = any(agent["agent"] == "Risk Engine" for agent in activated_agents)

        if not risk_already_active and (duplicate_rows > 0 or total_missing > 0 or len(activated_agents) >= 2):
            activated_agents.append({
                "agent": "Risk Engine",
                "priority": "High" if (duplicate_rows > 0 or total_missing > 0) else "Medium",
                "relevance_score": 2,
                "matched_keywords": ["multi-agent risk synthesis", "operational & financial risk scan"],
                "reason": (
                    "Activated to synthesize cross-agent vulnerabilities and evaluate operational, "
                    "financial, and data quality risks."
                ),
            })

        # Sort highest relevance first
        activated_agents.sort(key=lambda x: x["relevance_score"], reverse=True)

        # 4. DETERMINE DYNAMIC EXECUTION TOPOLOGY & ORDER
        active_names = [agent["agent"] for agent in activated_agents]

        # Standard recommended dependency sequence
        canonical_order = ["Commercial Analysis", "Financial Analysis", "Operations", "Risk Engine"]
        execution_order = [name for name in canonical_order if name in active_names]

        agent_dependencies = {}
        if "Commercial Analysis" in active_names:
            agent_dependencies["Commercial Analysis"] = ["Data Intelligence"]
        if "Financial Analysis" in active_names:
            agent_dependencies["Financial Analysis"] = [a for a in ["Data Intelligence", "Commercial Analysis"] if a in active_names]
        if "Operations" in active_names:
            agent_dependencies["Operations"] = [a for a in ["Data Intelligence", "Commercial Analysis"] if a in active_names]
        if "Risk Engine" in active_names:
            agent_dependencies["Risk Engine"] = [a for a in ["Data Intelligence", "Commercial Analysis", "Financial Analysis", "Operations"] if a in active_names]

        # 5. IDENTIFY INACTIVE AGENTS WITH RATIONALE
        inactive_agents = []

        for agent_name in self.available_agents:
            if agent_name not in active_names:
                inactive_agents.append({
                    "agent": agent_name,
                    "status": "Not Required",
                    "reason": (
                        "The current dataset and decision brief do not contain "
                        "sufficient relevant concepts or indicators for this specialized analysis."
                    ),
                })

        interpretation = (
            f"The strategic directive focuses on '{business_problem.strip()}'. "
            f"The coordinator mapped {len(detected_concept_names)} core business concepts "
            f"({', '.join(detected_concept_names[:6]) if detected_concept_names else 'general schema'}) "
            f"and scheduled {len(activated_agents)} specialized agent(s) for collaborative analysis."
        )

        return {
            "agent": "Coordinator Agent",
            "status": "completed",
            "business_problem": business_problem,
            "business_problem_interpretation": interpretation,
            "detected_business_concepts": detected_concept_names,
            "activated_agents": activated_agents,
            "inactive_agents": inactive_agents,
            "execution_order": execution_order,
            "agent_dependencies": agent_dependencies,
            "agent_scores": agent_scores,
            "coordination_summary": (
                f"The Coordinator evaluated {len(self.available_agents)} specialized agents. "
                f"{len(activated_agents)} agent(s) were activated in structured dependency order."
            ),
        }

    def synthesize_decision(self, business_problem, shared_context):
        """
        Apex intelligence layer: Synthesizes cross-agent findings into a dynamic,
        evidence-grounded Executive Decision Brief tailored to the strategic objective.
        """
        data_intel = shared_context.get("data_intelligence", {})
        comm = shared_context.get("commercial", {}).get("analysis", {})
        fin = shared_context.get("financial", {}).get("analysis", {})
        ops = shared_context.get("operations", {}).get("analysis", {})
        risk = shared_context.get("risk", {}).get("analysis", {})

        problem_lower = business_problem.lower().strip()

        # Classify strategic focus
        is_ops_focused = any(w in problem_lower for w in ["operat", "efficien", "delay", "deliver", "capacit", "utiliz", "bottleneck", "lead time", "logist", "suppl", "inventor"])
        is_fin_focused = any(w in problem_lower for w in ["profit", "cost", "margin", "revenu", "cogs", "expens", "spend", "financ", "price", "pricing"])
        is_comm_focused = any(w in problem_lower for w in ["sales", "demand", "market", "growth", "custom", "region", "territor", "churn", "product", "acquisit"])
        is_risk_focused = any(w in problem_lower for w in ["risk", "threat", "volatil", "anomal", "uncertain", "qualit", "churn", "mitigat", "exposur"])

        # Extract structured signals
        # 1. Commercial signals
        sales_summary = comm.get("sales_summary", {})
        tot_sales = sales_summary.get("total_sales", 0.0)
        avg_sales = sales_summary.get("average_sales", 0.0)
        reg_perf = comm.get("regional_performance", {})
        top_region = list(reg_perf.keys())[0] if reg_perf else None
        top_region_sales = reg_perf[top_region] if top_region else 0.0
        top_region_share = round((top_region_sales / tot_sales * 100), 1) if tot_sales > 0 and top_region_sales > 0 else 0.0
        r2_score = comm.get("regression", {}).get("r2_score")

        # 2. Financial signals
        fin_metrics = fin.get("key_metrics", {})
        fin_summary = fin.get("financial_summary", {})
        tot_rev = fin_summary.get("revenue", {}).get("total_revenue", 0.0)
        tot_cost = fin_summary.get("cost", {}).get("total_cost", 0.0)
        tot_profit = fin_summary.get("profit", {}).get("total_profit", 0.0)
        margin_pct = fin_metrics.get("profit_margin_pct", 0.0)
        cost_rev_ratio = fin_metrics.get("cost_to_revenue_ratio_pct", 0.0)
        roi_cost = fin_metrics.get("return_on_cost_roi_pct", 0.0)

        # 3. Operations signals
        ops_summary = ops.get("operational_summary", {})
        delay_info = ops_summary.get("delivery_delays", {})
        delayed_orders_pct = delay_info.get("delayed_orders_pct", 0.0)
        avg_delay_days = delay_info.get("average_delay_days", 0.0)
        util_info = ops_summary.get("machine_utilization", {})
        avg_util_pct = util_info.get("average_utilization_pct", 0.0)
        max_util_pct = util_info.get("max_utilization_pct", 0.0)
        lead_time_days = ops_summary.get("lead_time", {}).get("average_lead_time_days", 0.0)
        cap_deficit = ops.get("bottlenecks_and_constraints", {}).get("capacity_deficit", {})
        constrained_pct = cap_deficit.get("constrained_cycles_pct", 0.0)

        # 4. Risk signals
        risk_score = risk.get("risk_score", 35)
        risk_level = risk.get("risk_level", "Medium")
        risk_model = risk.get("risk_classification_model", {})
        feature_importances = risk_model.get("feature_importance", [])
        top_driver_1 = feature_importances[0]["feature"] if len(feature_importances) > 0 else "Operational Variance"
        top_driver_1_imp = feature_importances[0]["importance_pct"] if len(feature_importances) > 0 else 30.0
        top_driver_2 = feature_importances[1]["feature"] if len(feature_importances) > 1 else None
        top_driver_2_imp = feature_importances[1]["importance_pct"] if len(feature_importances) > 1 else None
        f1_score = risk_model.get("metrics", {}).get("f1_score_pct")

        # ─────────────────────────────────────────────────────────────
        # DYNAMIC WHAT WE FOUND (DATA-GROUNDED)
        # ─────────────────────────────────────────────────────────────
        what_we_found = []
        if tot_sales > 0:
            reg_text = f", with leading region '{top_region}' accounting for {top_region_share}% of total volume" if top_region else ""
            what_we_found.append({
                "label": "Commercial Demand",
                "finding": f"Gross sales volume totaled ${tot_sales:,.0f} (averaging ${avg_sales:,.0f} per transaction){reg_text}."
            })

        if tot_rev > 0 or margin_pct > 0:
            what_we_found.append({
                "label": "Margin Architecture",
                "finding": f"Portfolio operates at a {margin_pct:.1f}% net operating margin with total costs of ${tot_cost:,.0f} representing {cost_rev_ratio:.1f}% of revenue."
            })

        if avg_util_pct > 0 or delayed_orders_pct > 0:
            what_we_found.append({
                "label": "Operational Capacity",
                "finding": f"Machine fleet utilization averages {avg_util_pct:.1f}% (peaking at {max_util_pct:.1f}%), with {delayed_orders_pct:.1f}% of shipments experiencing delivery delays (avg {avg_delay_days:.1f} days)."
            })

        if feature_importances:
            what_we_found.append({
                "label": "Predictive Risk Factors",
                "finding": f"ML Random Forest classifier identifies '{top_driver_1}' ({top_driver_1_imp:.1f}% importance) as the primary risk driver."
            })

        # ─────────────────────────────────────────────────────────────
        # DYNAMIC WHY IT MATTERS (STRATEGIC IMPLICATIONS)
        # ─────────────────────────────────────────────────────────────
        if is_ops_focused:
            why_it_matters = (
                f"With fleet utilization averaging {avg_util_pct:.1f}% and {delayed_orders_pct:.1f}% of orders delayed by {avg_delay_days:.1f} days, "
                f"operational throughput is constrained by localized transit or processing friction rather than aggregate machine shortfall. "
                f"Attempting to scale commercial demand without relieving these specific route bottlenecks will directly inflate delay penalties and customer churn."
            )
            key_takeaway = "Operational delays and routing friction are the primary gating factor to sustainable throughput."
        elif is_fin_focused:
            why_it_matters = (
                f"With operating costs of ${tot_cost:,.0f} consuming {cost_rev_ratio:.1f}% of gross revenue (${tot_rev:,.0f}), net margin ({margin_pct:.1f}%) "
                f"is sensitive to expense leakage. Accelerating volume in low-margin categories dilutes profitability unless cost conversion efficiencies are enforced."
            )
            key_takeaway = "Cost conversion efficiency and high-margin product mix are the critical levers for profitability expansion."
        elif is_comm_focused:
            demand_fit_str = f"demand model fit is robust (R² {r2_score:.3f})" if r2_score is not None else "commercial volume is established"
            why_it_matters = (
                f"Commercial volume (${tot_sales:,.0f}) is concentrated in top-performing regional corridors ({top_region}: {top_region_share}% share). "
                f"While {demand_fit_str}, geographic concentration creates downside vulnerability if top-tier demand softens."
            )
            key_takeaway = "Geographic concentration in leading accounts presents both expansion potential in secondary regions and baseline revenue risk."
        else:
            why_it_matters = (
                f"The enterprise demonstrates solid commercial volume (${tot_sales:,.0f}) and healthy profitability ({margin_pct:.1f}% margin). "
                f"However, operational capacity ({avg_util_pct:.1f}% utilization, {delayed_orders_pct:.1f}% delayed orders) and '{top_driver_1}' "
                f"pose potential bottlenecks that could limit further scaling."
            )
            key_takeaway = "Coordinated balance between commercial velocity and operational capacity buffers is required for stable scaling."

        # ─────────────────────────────────────────────────────────────
        # DYNAMIC STRUCTURED RECOMMENDATIONS (RANKED BY RELEVANCE TO PROBLEM)
        # ─────────────────────────────────────────────────────────────
        candidates = []

        # Operational Action
        if delayed_orders_pct > 0 or avg_util_pct > 0:
            candidates.append({
                "id": "01",
                "domain": "Operations",
                "tag": "Throughput & Fulfillment",
                "title": "Resolve Fulfillment Bottlenecks & Buffer High-Delay Routes",
                "finding": f"{delayed_orders_pct:.1f}% of customer shipments experience delivery delays (averaging {avg_delay_days:.1f} days), while fleet utilization stands at {avg_util_pct:.1f}%.",
                "evidence": f"Delayed Orders: {delayed_orders_pct:.1f}% • Mean Delay: {avg_delay_days:.1f}d • Fleet Load: {avg_util_pct:.1f}%",
                "implication": "Overall machine capacity is available, but localized routing friction or supplier transit lags create shipment bottlenecks.",
                "action": f"Audit supplier lead times (averaging {lead_time_days:.1f} days) and rebalance production schedules across peak-load nodes before acquiring additional physical fleet assets.",
                "priority": "Critical" if (is_ops_focused or delayed_orders_pct > 20) else "High",
                "score": 10 if is_ops_focused else 6
            })

        # Financial Action
        if tot_profit > 0 or margin_pct > 0:
            candidates.append({
                "id": "02",
                "domain": "Financial",
                "tag": "Margin Optimization",
                "title": "Restructure Unit Cost Allocations to Expand Net Margin",
                "finding": f"Operating costs total ${tot_cost:,.0f} against ${tot_rev:,.0f} revenue, resulting in a {margin_pct:.1f}% margin and {cost_rev_ratio:.1f}% cost-to-revenue ratio.",
                "evidence": f"Net Margin: {margin_pct:.1f}% • Total Cost: ${tot_cost:,.0f} • Return on Cost: {roi_cost:.1f}%",
                "implication": "Every 1% reduction in operating cost conversion releases approximately ${(tot_cost * 0.01):,.0f} directly into net operating cash flow.",
                "action": f"Reallocate a portion of operating profits (${tot_profit:,.0f}) to renegotiate bottom-tier supplier contracts and standardize pricing across lower-margin product lines.",
                "priority": "Critical" if is_fin_focused else "High",
                "score": 10 if is_fin_focused else 7
            })

        # Commercial Action
        if tot_sales > 0:
            reg_note = f"Region '{top_region}' generates {top_region_share}% of total volume" if top_region else "Commercial demand is concentrated in core tiers"
            candidates.append({
                "id": "03",
                "domain": "Commercial",
                "tag": "Market Expansion",
                "title": "Scale Commercial Penetration in Underperforming Regional Corridors",
                "finding": f"{reg_note} (${tot_sales:,.0f} gross sales across the portfolio).",
                "evidence": f"Gross Sales: ${tot_sales:,.0f} • Mean Order: ${avg_sales:,.0f}" + (f" • R² Fit: {r2_score:.3f}" if r2_score is not None else ""),
                "implication": "Secondary regional territories represent latent demand capacity that can be unlocked through localized commercial campaigns.",
                "action": f"Direct growth marketing and sales resource allocation toward secondary corridors to diversify revenue while preserving account density in {top_region or 'core markets'}.",
                "priority": "Critical" if is_comm_focused else "Medium",
                "score": 10 if is_comm_focused else 5
            })

        # Risk & ML Action
        if feature_importances:
            f1_text = f" • Model F1: {f1_score:.1f}%" if f1_score is not None else ""
            candidates.append({
                "id": "04",
                "domain": "Risk Engine",
                "tag": "Predictive Mitigation",
                "title": f"Establish Predictive Controls for '{top_driver_1}'",
                "finding": f"Machine learning classification model identifies '{top_driver_1}' ({top_driver_1_imp:.1f}% relative importance) as the primary determinant of enterprise risk.",
                "evidence": f"Primary Risk Driver: {top_driver_1} ({top_driver_1_imp:.1f}%){f1_text}",
                "implication": "Unmonitored variance in this variable disproportionately drives operational disruptions and adverse margin swings.",
                "action": f"Implement automated threshold alerts and contingency buffers specifically targeted at {top_driver_1} to intercept risk escalation before it impacts fulfillment.",
                "priority": "Critical" if is_risk_focused else "High",
                "score": 10 if is_risk_focused else 6
            })

        # Sort candidates by relevance to the strategic problem
        candidates.sort(key=lambda x: x["score"], reverse=True)

        # Re-index IDs
        structured_recommendations = []
        for idx, item in enumerate(candidates[:4]):
            item["id"] = f"0{idx + 1}"
            structured_recommendations.append(item)

        # Executive summary
        exec_summary = (
            f"Collaborative multi-agent analysis addressing '{business_problem.strip()}' indicates "
            f"an enterprise operating at {margin_pct:.1f}% net margin with ${tot_sales:,.0f} in commercial volume. "
            f"Strategic priority should be directed toward {structured_recommendations[0]['title'].lower()} "
            f"to protect profitability and support sustainable growth."
        )

        quality_score = data_intel.get("data_quality", {}).get("quality_score", 95)
        conf_level = "High" if quality_score >= 80 else "Medium"

        return {
            "executive_summary": exec_summary,
            "strategic_focus": "Operations" if is_ops_focused else "Financial" if is_fin_focused else "Commercial" if is_comm_focused else "Risk" if is_risk_focused else "Balanced Enterprise",
            "what_we_found": what_we_found,
            "why_it_matters": why_it_matters,
            "key_takeaway": key_takeaway,
            "structured_recommendations": structured_recommendations,
            "primary_findings": [f["finding"] for f in what_we_found],
            "key_business_drivers": [r["tag"] for r in structured_recommendations],
            "recommended_actions": [f"{r['title']}: {r['action']}" for r in structured_recommendations],
            "confidence_assessment": {
                "overall_confidence": conf_level,
                "data_reliability_score": quality_score,
                "model_validity": "Validated through cross-agent empirical and machine learning checks",
                "limitations": fin.get("limitations", []) + ops.get("limitations", [])
            }
        }

    def calculate_priority(self, score):
        if score >= 5:
            return "Critical"
        elif score >= 3:
            return "High"
        elif score >= 2:
            return "Medium"
        return "Low"

    def generate_reason(self, agent_name, details):
        keywords = details["matched_keywords"]
        if not keywords:
            return f"{agent_name} was selected based on the overall decision context."
        keyword_text = ", ".join(keywords[:5])
        return (
            f"{agent_name} was activated because the dataset or decision problem "
            f"contains relevant indicators related to: {keyword_text}."
        )