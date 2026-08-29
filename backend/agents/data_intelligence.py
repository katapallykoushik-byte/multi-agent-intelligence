import pandas as pd
from backend.services.data_processor import DataProcessor
from backend.services.concept_detector import ConceptDetector


class DataIntelligenceAgent:
    """
    Data Intelligence Agent

    Responsible for understanding and profiling an uploaded dataset before
    specialised analytical agents begin their analysis.
    """

    def __init__(self):
        self.processor = DataProcessor()
        self.concept_detector = ConceptDetector()

    def analyze_dataset(self, file_path=None, df=None):
        """
        Perform a complete intelligence analysis on the dataset.
        Accepts either a file_path or a pre-loaded DataFrame.
        """
        # 1. LOAD DATASET IF NOT PROVIDED
        if df is None:
            if file_path is None:
                raise ValueError("Either file_path or df must be provided.")
            df = self.processor.load_data(file_path)

        # 2. STANDARDIZE COLUMN NAMES
        df = self.processor.clean_column_names(df)

        # 3. GENERATE STRUCTURAL AND STATISTICAL INSIGHTS
        overview = self.processor.get_dataset_overview(df)
        data_types = self.processor.get_data_types(df)
        missing_values = self.processor.get_missing_values(df)
        duplicate_count = self.processor.get_duplicate_count(df)
        column_types = self.processor.identify_column_types(df)
        numeric_statistics = self.processor.get_numeric_statistics(df)
        outliers = self.processor.detect_outliers(df)
        quality_score = self.processor.calculate_quality_score(df)
        recommendations = self.processor.generate_preprocessing_recommendations(df)

        # 4. ADAPTIVE CONCEPT DETECTION
        concept_report = self.concept_detector.detect_concepts(df)

        # 5. EVALUATE PREDICTIVE READINESS
        predictive_readiness = self.processor.evaluate_predictive_readiness(df, concept_report)

        # 6. CREATE STRUCTURED AGENT REPORT (DUAL PREPROCESSING RECOMMENDATIONS FOR 100% COMPATIBILITY)
        report = {
            "agent": "Data Intelligence Agent",
            "status": "completed",
            "dataset_overview": overview,
            "data_types": data_types,
            "column_classification": column_types,
            "data_quality": {
                "quality_score": quality_score,
                "missing_values": missing_values,
                "duplicate_rows": duplicate_count,
                "potential_outliers": outliers,
                "preprocessing_recommendations": recommendations,
            },
            "numeric_statistics": numeric_statistics,
            "preprocessing_recommendations": recommendations,
            "detected_concepts": concept_report,
            "predictive_readiness": predictive_readiness,
        }

        return report, df