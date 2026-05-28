from fastapi import APIRouter, HTTPException
from src.models.schemas import SymptomAnalysisRequest, SymptomAnalysisResponse
from src.services.symptom_analyzer import analyze_symptoms

router = APIRouter(prefix="/api/symptoms", tags=["Symptoms"])


@router.post("/analyze", response_model=SymptomAnalysisResponse)
async def analyze_symptom_route(request: SymptomAnalysisRequest):
    """
    Analyze patient symptoms using Gemini AI and return
    possible conditions, severity, recommendations and home remedies.
    """
    try:
        result = await analyze_symptoms(request)
        return result
    except RuntimeError as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error during symptom analysis: {str(e)}",
        )