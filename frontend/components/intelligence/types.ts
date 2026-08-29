export type AnalysisResult = {
  status: string;
  business_problem: string;

  analysis: {
    agent: string;
    status: string;

    dataset_overview: {
      rows: number;
      columns: number;
      column_names: string[];
      memory_usage_mb: number;
    };

    data_types: Record<string, string>;

    column_classification: {
      numerical: string[];
      categorical: string[];
      datetime: string[];
    };

    data_quality: {
      quality_score: number;
      missing_values: Record<
        string,
        {
          missing_count: number;
          missing_percentage: number;
        }
      >;
      duplicate_rows: number;
      potential_outliers: Record<
        string,
        {
          outlier_count: number;
          outlier_percentage: number;
        }
      >;
      preprocessing_recommendations?: string[];
    };

    preprocessing_recommendations?: string[];
    detected_concepts?: Record<string, any>;
    predictive_readiness?: Record<string, any>;
  };

  coordinator: {
    agent: string;
    status: string;
    business_problem: string;
    business_problem_interpretation?: string;
    detected_business_concepts?: string[];
    activated_agents: Array<{
      agent: string;
      priority: string;
      relevance_score?: number;
      matched_keywords: string[];
      reason: string;
    }>;
    inactive_agents?: Array<{
      agent: string;
      status: string;
      reason: string;
    }>;
    execution_order?: string[];
    agent_dependencies?: Record<string, string[]>;
    coordination_summary?: string;
  };

  specialist_analysis?: {
    commercial_analysis?: {
      agent: string;
      status: string;
      business_problem: string;
      analysis: {
        sales_summary?: {
          column?: string;
          total_sales?: number;
          average_sales?: number;
          minimum_sales?: number;
          maximum_sales?: number;
          message?: string;
        };
        regional_performance?: Record<string, number>;
        product_performance?: Record<string, number>;
        regression?: {
          target?: string;
          features?: string[];
          mae?: number;
          mse?: number;
          rmse?: number;
          r2_score?: number;
          sample_size?: number;
          predictions?: number[];
          excluded_leakage_features?: string[];
          message?: string;
        };
      };
      key_insights: string[];
    };

    financial_analysis?: {
      agent: string;
      status: string;
      business_problem: string;
      analysis: {
        financial_summary?: {
          revenue?: {
            column: string;
            total_revenue: number;
            average_revenue: number;
            minimum_revenue: number;
            maximum_revenue: number;
          };
          cost?: {
            column: string;
            total_cost: number;
            average_cost: number;
            minimum_cost: number;
            maximum_cost: number;
          };
          profit?: {
            column: string;
            total_profit: number;
            average_profit: number;
            minimum_profit: number;
            maximum_profit: number;
          };
        };
        revenue_analysis?: Record<string, any>;
        cost_analysis?: Record<string, any>;
        profit_analysis?: Record<string, any>;
        key_metrics?: {
          profit_margin_pct?: number;
          cost_to_revenue_ratio_pct?: number;
          return_on_cost_roi_pct?: number;
        };
        profitability?: {
          profit_margin?: number;
          cost_to_revenue_ratio?: number;
        };
        profitability_analysis?: {
          product_profitability?: Record<string, number>;
          regional_profitability?: Record<string, number>;
        };
        variance_analysis?: {
          budget_column?: string;
          total_budget?: number;
          total_actual_cost?: number;
          budget_variance?: number;
          budget_utilization_pct?: number;
          status?: string;
        };
        limitations?: string[];
      };
      key_insights: string[];
      limitations?: string[];
    };

    operations_analysis?: {
      agent: string;
      status: string;
      business_problem: string;
      analysis: {
        operational_summary?: {
          inventory?: {
            column: string;
            total_inventory: number;
            average_inventory: number;
            min_inventory: number;
            max_inventory: number;
          };
          production_capacity?: {
            column: string;
            average_capacity: number;
            max_capacity: number;
          };
          machine_utilization?: {
            column: string;
            average_utilization_pct: number;
            max_utilization_pct: number;
          };
          workforce_availability?: {
            column: string;
            average_availability_pct: number;
          };
          lead_time?: {
            column: string;
            average_lead_time_days: number;
            max_lead_time_days: number;
          };
          delivery_delays?: {
            column: string;
            average_delay_days: number;
            max_delay_days: number;
            delayed_orders_pct: number;
          };
        };
        bottlenecks_and_constraints?: {
          capacity_deficit?: {
            constrained_cycles_count?: number;
            constrained_cycles_pct?: number;
            max_demand_deficit_units?: number;
            status?: string;
          };
          equipment_stress?: {
            high_utilization_cycles_count?: number;
            high_utilization_pct?: number;
            threshold_pct?: number;
          };
        };
        supplier_performance?: Record<
          string,
          {
            avg_lead_time_days?: number;
            avg_reliability_score?: number;
            avg_delivery_delay_days?: number;
          }
        >;
        regional_fulfillment?: Record<string, number>;
        limitations?: string[];
      };
      key_insights: string[];
      limitations?: string[];
    };

    risk_analysis?: {
      agent: string;
      status: string;
      business_problem: string;
      analysis: {
        risk_score: number;
        risk_level: string;
        risk_matrix?: {
          data_risk: number;
          commercial_risk: number;
          financial_risk: number;
          operational_risk: number;
        };
        identified_risks: Array<{
          category: string;
          severity: string;
          risk: string;
          impact: string;
        }>;
        risk_drivers: Array<{
          driver: string;
          contribution_pct: number;
          severity: string;
        }>;
        cross_agent_signals: string[];
        recommended_actions: string[];
        risk_classification_model?: {
          status: string;
          model_name?: string;
          target_variable?: string;
          target_source?: string;
          leakage_status?: string;
          metrics?: {
            accuracy_pct: number;
            precision_pct: number;
            recall_pct: number;
            f1_score_pct: number;
            total_validation_records?: number;
          };
          confusion_matrix?: {
            classes: string[];
            matrix: number[][];
          };
          class_metrics?: Record<
            string,
            {
              precision_pct: number;
              recall_pct: number;
              f1_score_pct: number;
              support: number;
            }
          >;
          feature_importance?: Array<{
            rank: string;
            feature: string;
            raw_feature?: string;
            importance_pct: number;
            role?: string;
          }>;
          methodology?: {
            description: string;
            tags: string[];
          };
          message?: string;
        };
      };
      key_insights: string[];
    };
  };

  decision_synthesis?: {
    executive_summary: string;
    strategic_focus?: string;
    what_we_found?: Array<{
      label: string;
      finding: string;
    }>;
    why_it_matters?: string;
    key_takeaway?: string;
    structured_recommendations?: Array<{
      id: string;
      domain: string;
      tag: string;
      title: string;
      finding: string;
      evidence: string;
      implication: string;
      action: string;
      priority: string;
      score?: number;
    }>;
    primary_findings: string[];
    cross_agent_connections: string[];
    key_business_drivers: string[];
    major_risks: string[];
    recommended_actions: string[];
    confidence_assessment?: {
      overall_confidence: string;
      data_reliability_score: number;
      model_validity: string;
      limitations: string[];
    };
  };
};

export type MarqueeCardData = {
  id: string;
  category: "COMMERCIAL" | "FINANCIAL" | "OPERATIONS" | "RISK";
  agentTag: string;
  title: string;
  primaryValue: string;
  subValue?: string;
  badge?: string;
  badgeType?: "accent" | "warning" | "neutral" | "success";
  chartType?: "sparkline" | "bar" | "matrix" | "features" | "meter";
  chartData?: any;
  targetSectionId: string;
};
