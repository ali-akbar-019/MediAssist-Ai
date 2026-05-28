import json
import re
from typing import Any


def clean_json_response(text: str) -> str:
    """Remove markdown code blocks from AI response"""
    text = re.sub(r"```json\s*", "", text)
    text = re.sub(r"```\s*", "", text)
    return text.strip()


def parse_ai_json_response(response_text: str) -> dict[str, Any]:
    """Safely parse JSON from AI response"""
    try:
        cleaned = clean_json_response(response_text)
        return json.loads(cleaned)
    except json.JSONDecodeError:
        # Try to extract JSON from response
        json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group())
            except json.JSONDecodeError:
                pass
        raise ValueError("Could not parse AI response as JSON")


def format_symptoms_for_prompt(symptoms: list[str]) -> str:
    """Format symptoms list for AI prompt"""
    return ", ".join(symptoms)


def format_chronic_conditions(conditions: list[str]) -> str:
    """Format chronic conditions for AI prompt"""
    if not conditions:
        return "None"
    return ", ".join(conditions)


def format_allergies(allergies: list[str]) -> str:
    """Format allergies for AI prompt"""
    if not allergies:
        return "None"
    return ", ".join(allergies)


def get_severity_from_score(score: int) -> str:
    """Convert numeric severity score to label"""
    if score <= 3:
        return "mild"
    elif score <= 5:
        return "moderate"
    elif score <= 8:
        return "severe"
    return "emergency"


def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    text = text.strip()
    text = re.sub(r"[<>]", "", text)
    return text


def truncate_text(text: str, max_length: int = 500) -> str:
    """Truncate text to max length"""
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."


def build_patient_context_string(
    age: int | None,
    gender: str | None,
    chronic_conditions: list[str],
    allergies: list[str],
) -> str:
    """Build patient context string for AI prompt"""
    context_parts = []

    if age:
        context_parts.append(f"Age: {age} years")
    if gender:
        context_parts.append(f"Gender: {gender}")
    if chronic_conditions:
        context_parts.append(
            f"Chronic Conditions: {format_chronic_conditions(chronic_conditions)}"
        )
    if allergies:
        context_parts.append(f"Allergies: {format_allergies(allergies)}")

    if not context_parts:
        return "No additional patient context available"

    return " | ".join(context_parts)