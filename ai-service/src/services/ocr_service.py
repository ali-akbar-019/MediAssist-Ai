import base64
import json
import re
import os
import asyncio
from src.services.gemini_service import get_gemini_client, GeminiConfigurationError
from src.utils.helpers import parse_ai_json_response

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")


def clean_lab_values(lab_values):
    cleaned = []

    for item in lab_values or []:
        if isinstance(item, dict):
            test = item.get("test")
            value = item.get("value")
            status = item.get("status")

            if test and value and status:
                cleaned.append({
                    "test": test,
                    "value": value,
                    "status": status,
                    "unit": item.get("unit", ""),
                    "normalRange": item.get("normalRange", ""),
                    "interpretation": item.get("interpretation", "")
                })

    return cleaned


def build_ocr_prompt(document_type: str) -> str:
    base_prompt = """
You are a medical document analysis AI. Analyze the provided medical document image and extract all information.

IMPORTANT: Respond ONLY with a valid JSON object. No markdown, no extra text.
"""

    if document_type == "lab_report":
        return base_prompt + """
Extract lab report details and respond with:
{
    "rawText": "",
    "summary": "",
    "simplifiedExplanation": "",
    "extractedMedicines": [],
    "labValues": [
        {
            "test": "string",
            "value": "string",
            "unit": "string",
            "normalRange": "string",
            "status": "normal|high|low|critical",
            "interpretation": "string"
        }
    ],
    "importantNotes": [],
    "warnings": [],
    "followUpActions": [],
    "doctorName": "",
    "patientName": "",
    "date": ""
}
"""
    else:
        return base_prompt + """
{
    "rawText": "",
    "summary": "",
    "simplifiedExplanation": "",
    "extractedMedicines": [],
    "labValues": [],
    "importantNotes": [],
    "warnings": [],
    "followUpActions": [],
    "doctorName": "",
    "patientName": "",
    "date": ""
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

        image_part = {
            "inline_data": {
                "mime_type": mime_type if mime_type.startswith("image/") else "application/pdf",
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

        # ✅ FIX: sanitize before returning
        result["labValues"] = clean_lab_values(result.get("labValues"))

        return result

    except GeminiConfigurationError:
        raise
    except Exception as e:
        raise RuntimeError(f"OCR analysis failed: {str(e)}")