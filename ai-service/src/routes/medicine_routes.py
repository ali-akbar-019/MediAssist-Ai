from fastapi import APIRouter, HTTPException
from src.models.schemas import MedicineInfoRequest, MedicineInfoResponse
from src.services.gemini_service import generate_content
from src.utils.helpers import parse_ai_json_response

router = APIRouter(prefix="/api/medicine", tags=["Medicine"])


def build_medicine_prompt(medicine_name: str) -> str:
    """Build prompt for medicine information"""
    return f"""
You are a knowledgeable pharmaceutical AI assistant.
Provide detailed information about the medicine: {medicine_name}

IMPORTANT: Respond ONLY with a valid JSON object. No extra text or markdown.

Respond with this exact JSON structure:
{{
    "name": "Official medicine name",
    "genericName": "Generic/chemical name",
    "uses": [
        "Primary use 1",
        "Primary use 2",
        "Primary use 3"
    ],
    "dosage": "General dosage information and instructions",
    "sideEffects": [
        "Common side effect 1",
        "Common side effect 2",
        "Common side effect 3",
        "Common side effect 4"
    ],
    "warnings": [
        "Important warning 1",
        "Important warning 2",
        "Important warning 3"
    ],
    "interactions": [
        "Drug interaction 1",
        "Drug interaction 2",
        "Drug interaction 3"
    ]
}}

Rules:
- Provide accurate pharmaceutical information
- uses must have 2-5 items
- sideEffects must have 3-6 items
- warnings must have 2-4 items
- interactions must have 2-4 items
- Always note that a doctor or pharmacist should be consulted
- If medicine name is not recognized, provide best available information
- Keep all text concise and clear
"""


@router.post("/info", response_model=MedicineInfoResponse)
async def get_medicine_info(request: MedicineInfoRequest):
    """
    Get detailed information about a medicine including
    uses, dosage, side effects, warnings and drug interactions.
    """
    try:
        prompt = build_medicine_prompt(request.medicineName)
        response_text = await generate_content(prompt)
        parsed_response = parse_ai_json_response(response_text)

        return MedicineInfoResponse(**parsed_response)

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
            detail=f"Unexpected error fetching medicine info: {str(e)}",
        )