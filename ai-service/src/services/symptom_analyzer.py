from src.services.gemini_service import generate_content
from src.models.schemas import SymptomAnalysisRequest, SymptomAnalysisResponse
from src.utils.helpers import (
    parse_ai_json_response,
    format_symptoms_for_prompt,
    build_patient_context_string,
    get_severity_from_score,
)


def build_symptom_analysis_prompt(request: SymptomAnalysisRequest) -> str:
    """Build detailed prompt for symptom analysis"""

    patient_context = build_patient_context_string(
        age=request.patientAge,
        gender=request.patientGender,
        chronic_conditions=request.chronicConditions or [],
        allergies=request.allergies or [],
    )

    symptoms_str = format_symptoms_for_prompt(request.symptoms)
    estimated_severity = get_severity_from_score(request.severity)

    prompt = f"""
You are an experienced medical AI assistant. Analyze the following patient symptoms and provide a detailed medical assessment.

IMPORTANT: You must respond ONLY with a valid JSON object. No extra text, no markdown, no explanation outside the JSON.

PATIENT INFORMATION:
{patient_context}

SYMPTOM DETAILS:
- Affected Body Part: {request.bodyPart} ({request.bodySide} side)
- Symptoms: {symptoms_str}
- Pain Type: {request.painType}
- Pain Severity: {request.severity}/10 (estimated: {estimated_severity})
- Duration: {request.duration} {request.durationUnit}
- Symptoms worse at: {request.worseAt}
- Additional Notes: {request.additionalNotes or "None"}

Analyze these symptoms carefully considering the patient context and provide your assessment.

Respond with this exact JSON structure:
{{
    "possibleConditions": [
        {{
            "name": "Condition name",
            "probability": "high|medium|low",
            "description": "Brief description of this condition and why it matches the symptoms"
        }}
    ],
    "severity": "mild|moderate|severe|emergency",
    "recommendation": "Detailed recommendation for the patient",
    "homeRemedies": [
        "Home remedy 1",
        "Home remedy 2",
        "Home remedy 3"
    ],
    "medicinesToConsider": [
        {{
            "name": "Medicine name",
            "type": "OTC",
            "reason": "Why this medicine might be helpful based on the symptoms",
            "howToUse": "General guidance on how to use this medicine (e.g., dosage, frequency)"
        }}
    ],
    "whenToSeeDoctor": "Clear guidance on when to seek medical attention",
    "specialistType": "Type of specialist to see if needed (optional)"
}}

Rules:
- List 2-4 possible conditions ordered by probability
- severity must be exactly one of: mild, moderate, severe, emergency
- probability must be exactly one of: high, medium, low
- homeRemedies must have 2-5 items
- medicinesToConsider should be an empty array if no safe medicine recommendation is appropriate
- Each medicinesToConsider item must include name, type, reason, and howToUse
- Be specific and medically accurate
- Consider patient age, gender, and chronic conditions
- If severity is emergency, make that very clear in recommendation
- Do not diagnose definitively — use language like "may indicate", "could be", "suggests"
"""
    return prompt


async def analyze_symptoms(
    request: SymptomAnalysisRequest,
) -> SymptomAnalysisResponse:
    """Analyze symptoms using Gemini AI"""
    try:
        prompt = build_symptom_analysis_prompt(request)
        response_text = await generate_content(prompt)
        parsed_response = parse_ai_json_response(response_text)

        return SymptomAnalysisResponse(**parsed_response)

    except Exception as e:
        raise RuntimeError(f"Symptom analysis failed: {str(e)}")