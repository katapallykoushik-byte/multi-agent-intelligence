from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid

from backend.agents.data_intelligence import DataIntelligenceAgent
from backend.agents.coordinator import CoordinatorAgent
from backend.agents.commercial_agent import CommercialAnalysisAgent
from backend.agents.financial_agent import FinancialAnalysisAgent
from backend.agents.operations_agent import OperationsAnalysisAgent
from backend.agents.risk_agent import RiskAnalysisAgent


# ==========================================================
# FASTAPI APPLICATION
# ==========================================================

app = FastAPI(
    title="Enterprise Multi-Agent Decision Support API",
    description="Intelligent Collaborative Multi-Agent Decision Support Framework",
    version="0.3"
)


# ==========================================================
# CORS CONFIGURATION
# ==========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# CREATE UPLOAD DIRECTORY
# ==========================================================

UPLOAD_DIRECTORY = "uploads"

os.makedirs(
    UPLOAD_DIRECTORY,
    exist_ok=True
)


# ==========================================================
# INITIALIZE AGENT MATRIX
# ==========================================================

data_agent = DataIntelligenceAgent()
coordinator = CoordinatorAgent()
commercial_agent = CommercialAnalysisAgent()
financial_agent = FinancialAnalysisAgent()
operations_agent = OperationsAnalysisAgent()
risk_agent = RiskAnalysisAgent()


# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/")
def home():
    return {
        "system": "Enterprise Multi-Agent Decision Support API",
        "status": "operational",
        "version": "0.3",
        "agents": [
            "Data Intelligence Agent",
            "Coordinator Agent",
            "Commercial Analysis Agent",
            "Financial Analysis Agent",
            "Operations Analysis Agent",
            "Risk Analysis Agent"
        ]
    }


# ==========================================================
# MULTI-AGENT DATASET ANALYSIS ENDPOINT
# ==========================================================

@app.post("/analyze")
async def analyze_dataset(
    file: UploadFile = File(...),
    business_problem: str = Form(...)
):
    # ------------------------------------------------------
    # 1. VALIDATE FILE TYPE
    # ------------------------------------------------------
    allowed_extensions = (
        ".csv",
        ".xlsx",
        ".xls"
    )

    if not file.filename.lower().endswith(allowed_extensions):
        return {
            "status": "error",
            "message": "Only CSV and Excel files (.csv, .xlsx, .xls) are supported."
        }

    # ------------------------------------------------------
    # 2. CREATE TEMPORARY FILE
    # ------------------------------------------------------
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # --------------------------------------------------
        # 3. DATA INTELLIGENCE LAYER (STEP 1)
        # --------------------------------------------------
        report, df = data_agent.analyze_dataset(file_path=file_path)

        # --------------------------------------------------
        # 4. COORDINATOR ORCHESTRATION LAYER (STEP 2)
        # --------------------------------------------------
        coordinator_result = coordinator.analyse_requirements(
            business_problem=business_problem,
            dataset_columns=report["dataset_overview"]["column_names"],
            data_intelligence_report=report
        )

        # --------------------------------------------------
        # 5. INITIALIZE SHARED ANALYTICAL CONTEXT
        # --------------------------------------------------
        shared_context = {
            "data_intelligence": report,
            "commercial": None,
            "financial": None,
            "operations": None,
            "risk": None
        }

        specialist_results = {}
        execution_order = coordinator_result.get("execution_order", [])

        # --------------------------------------------------
        # 6. EXECUTE SPECIALIST AGENTS IN COLLABORATIVE ORDER (STEP 3)
        # --------------------------------------------------
        for agent_name in execution_order:

            # COMMERCIAL ANALYSIS
            if agent_name == "Commercial Analysis":
                commercial_result = commercial_agent.analyze(
                    business_problem=business_problem,
                    data_intelligence_report=report,
                    shared_context=shared_context,
                    df=df
                )
                specialist_results["commercial_analysis"] = commercial_result
                shared_context["commercial"] = commercial_result

            # FINANCIAL ANALYSIS
            elif agent_name == "Financial Analysis":
                financial_result = financial_agent.analyze(
                    business_problem=business_problem,
                    data_intelligence_report=report,
                    shared_context=shared_context,
                    df=df
                )
                specialist_results["financial_analysis"] = financial_result
                shared_context["financial"] = financial_result

            # OPERATIONS ANALYSIS
            elif agent_name == "Operations":
                operations_result = operations_agent.analyze(
                    business_problem=business_problem,
                    data_intelligence_report=report,
                    shared_context=shared_context,
                    df=df
                )
                specialist_results["operations_analysis"] = operations_result
                shared_context["operations"] = operations_result

            # RISK ENGINE
            elif agent_name == "Risk Engine":
                risk_result = risk_agent.analyze(
                    business_problem=business_problem,
                    data_intelligence_report=report,
                    shared_context=shared_context,
                    df=df
                )
                specialist_results["risk_analysis"] = risk_result
                shared_context["risk"] = risk_result

        # --------------------------------------------------
        # 7. EXECUTIVE DECISION SYNTHESIS (STEP 4)
        # --------------------------------------------------
        decision_synthesis = coordinator.synthesize_decision(
            business_problem=business_problem,
            shared_context=shared_context
        )

        # --------------------------------------------------
        # 8. RETURN UNIFIED DECISION INTELLIGENCE RESPONSE
        # --------------------------------------------------
        return {
            "status": "success",
            "business_problem": business_problem,
            "analysis": report,
            "coordinator": coordinator_result,
            "specialist_analysis": specialist_results,
            "decision_synthesis": decision_synthesis
        }

    except Exception as exc:
        return {
            "status": "error",
            "message": f"Analysis execution failed: {str(exc)}"
        }

    # ------------------------------------------------------
    # 9. CLEAN UP TEMPORARY FILE
    # ------------------------------------------------------
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass