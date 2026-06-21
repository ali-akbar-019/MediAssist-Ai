from fastapi import APIRouter, HTTPException
from src.models.schemas import MedicineInfoRequest, MedicineInfoResponse
from src.services.gemini_service import GeminiConfigurationError, generate_content
from src.utils.helpers import parse_ai_json_response

router = APIRouter(prefix="/api/medicine", tags=["Medicine"])


def build_medicine_prompt(medicine_name: str) -> str:
    """Build prompt for medicine information"""
    return f"""
You are a knowledgeable pharmaceutical AI assistant.
Provide detailed information about the medicine: {medicine_name}

IMPORTANT: Respond ONLY with a valid JSON object. No extra text or markdown.

If the medicine IS a recognized pharmaceutical product, respond with this structure:
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

If the medicine is NOT a recognized pharmaceutical product, respond with this EXACT structure:
{{
    "name": "NOT_FOUND",
    "genericName": "",
    "uses": [],
    "dosage": "",
    "sideEffects": [],
    "warnings": [],
    "interactions": []
}}

Rules:
- Provide accurate pharmaceutical information
- uses must have 2-5 items
- sideEffects must have 3-6 items
- warnings must have 2-4 items
- interactions must have 2-4 items
- Always note that a doctor or pharmacist should be consulted
- **CRITICAL: ONLY use "NOT_FOUND" if the medicine does not exist in medical literature**
- **CRITICAL: Do NOT generate placeholder or fake information for unrecognized medicines**
- Keep all text concise and clear
"""


@router.post("/info", response_model=MedicineInfoResponse)
async def get_medicine_info(request: MedicineInfoRequest):
    """
    Get detailed information about a medicine including
    uses, dosage, side effects, warnings and drug interactions.
    """
    try:
        medicine_name = request.medicineName.strip()
        
        # Basic validation
        if not medicine_name:
            raise HTTPException(
                status_code=400,
                detail="Medicine name is required",
            )
        
        if len(medicine_name) > 100:
            raise HTTPException(
                status_code=400,
                detail="Medicine name cannot exceed 100 characters",
            )
        
        # Get AI response
        prompt = build_medicine_prompt(medicine_name)
        response_text = await generate_content(prompt)
        parsed_response = parse_ai_json_response(response_text)
        
        # Check if medicine was found
        if parsed_response.get("name") == "NOT_FOUND":
            raise HTTPException(
                status_code=404,
                detail=f"No information found for medicine: {medicine_name}",
            )
        
        # Validate required fields exist for found medicine
        required_fields = ["name", "genericName", "uses", "dosage", "sideEffects", "warnings", "interactions"]
        for field in required_fields:
            if field not in parsed_response:
                raise HTTPException(
                    status_code=500,
                    detail=f"Invalid response from medicine service: missing {field}",
                )
        
        return MedicineInfoResponse(**parsed_response)

    except GeminiConfigurationError as e:
        raise HTTPException(
            status_code=503,
            detail="Medicine information service is currently unavailable. Please try again later.",
        )
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except RuntimeError as e:
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request. Please try again.",
        )
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid response format from medicine service.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error fetching medicine info: {str(e)}",
        )