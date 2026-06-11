import base64
import json
import re
import os
import asyncio
from src.services.gemini_service import get_gemini_client, GeminiConfigurationError
from src.utils.helpers import parse_ai_json_response

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

def build_ocr_prompt(document_type: str) -> str:
    base_prompt = """
You are a medical document analysis AI. Analyze the provided medical document image and extract all information.

IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no extra text.

"""
    if document_type == "prescription":
        return base_prompt + """
Extract prescription details and respond with:
{
    "rawText": "all text extracted from document",
    "summary": "brief summary of the prescription",
    "simplifiedExplanation": "explain in simple everyday language what this prescription is for and what the patient should do",
    "extractedMedicines": [
        {
            "name": "medicine name",
            "dosage": "dosage amount",
            "frequency": "how many times per day",
            "duration": "for how long",
            "instructions": "special instructions like take with food"
        }
    ],
    "labValues": [],
    "importantNotes": ["important notes for patient"],
    "warnings": ["any warnings or precautions"],
    "followUpActions": ["follow up actions for patient"],
    "doctorName": "doctor name if visible",
    "patientName": "patient name if visible",
    "date": "prescription date if visible"
}
"""
    elif document_type == "lab_report":
        return base_prompt + """
Extract lab report details and respond with:
{
    "rawText": "all text extracted from document",
    "summary": "brief summary of lab results",
    "simplifiedExplanation": "explain in simple language what these results mean for the patient's health",
    "extractedMedicines": [],
    "labValues": [
        {
            "test": "test name",
            "value": "result value",
            "unit": "unit of measurement",
            "normalRange": "normal reference range",
            "status": "normal|high|low|critical",
            "interpretation": "what this result means in simple language"
        }
    ],
    "importantNotes": ["key findings"],
    "warnings": ["any critical values or warnings"],
    "followUpActions": ["recommended follow up actions"],
    "doctorName": "doctor name if visible",
    "patientName": "patient name if visible",
    "date": "report date if visible"
}
"""
    else:
        return base_prompt + """
Extract medical document details and respond with:
{
    "rawText": "all text extracted from document",
    "summary": "brief summary of the document",
    "simplifiedExplanation": "explain in simple language what this document says",
    "extractedMedicines": [],
    "labValues": [],
    "importantNotes": ["key information from document"],
    "warnings": ["any warnings or important flags"],
    "followUpActions": ["recommended actions"],
    "doctorName": "doctor name if visible",
    "patientName": "patient name if visible",
    "date": "document date if visible"
}
"""

async def analyze_document(
    file_base64: str,
    mime_type: str,
    document_type: str,
    file_name: str,
) -> dict:
    try:
        client = get_gemini_client()
        prompt = build_ocr_prompt(document_type)

        # Build image part
        image_part = {
            "inline_data": {
                "mime_type": mime_type if mime_type.startswith("image/") else "image/jpeg",
                "data": file_base64,
            }
        }

        # For PDF, convert prompt
        if mime_type == "application/pdf":
            # Gemini can handle PDFs directly
            image_part = {
                "inline_data": {
                    "mime_type": "application/pdf",
                    "data": file_base64,
                }
            }

        response = await asyncio.to_thread(
            client.models.generate_content,
            model=GEMINI_MODEL,
            contents=[prompt, image_part],
        )

        if not response.text:
            raise ValueError("Empty response from Gemini")

        result = parse_ai_json_response(response.text)
        return result

    except GeminiConfigurationError:
        raise
    except Exception as e:
        raise RuntimeError(f"OCR analysis failed: {str(e)}")