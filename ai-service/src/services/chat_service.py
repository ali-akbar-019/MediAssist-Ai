from src.services.gemini_service import generate_chat_response
from src.models.schemas import ChatRequest, ChatResponse


SYSTEM_PROMPT = """
You are MediAssist AI, a compassionate and knowledgeable medical AI assistant. 
Your role is to help patients understand their symptoms, provide general health guidance, 
and encourage them to seek professional medical care when necessary.

IMPORTANT GUIDELINES:
1. Always be empathetic, clear, and professional
2. Never provide definitive diagnoses — use language like "this may indicate", "could suggest", "you might want to consider"
3. Always recommend consulting a real doctor for serious concerns
4. Ask relevant follow-up questions to better understand the patient's condition
5. Provide practical, actionable advice when appropriate
6. If symptoms sound like an emergency (chest pain, difficulty breathing, severe bleeding, stroke symptoms), 
   immediately advise calling emergency services
7. Be culturally sensitive and respectful
8. Keep responses concise but thorough — avoid overwhelming the patient
9. If asked about medications, provide general information only and always recommend consulting a pharmacist or doctor
10. Remember previous messages in the conversation to provide contextual responses

You have access to the patient's context if provided. Use it to personalize your responses.
Always end serious consultations with a reminder that you are an AI and professional medical advice is essential.
"""


def build_system_prompt_with_context(request: ChatRequest) -> str:
    """Build system prompt with patient context"""
    system_prompt = SYSTEM_PROMPT

    if request.patientContext:
        context = request.patientContext
        context_parts = []

        if context.age:
            context_parts.append(f"Age: {context.age} years")
        if context.gender:
            context_parts.append(f"Gender: {context.gender}")
        if context.chronicConditions:
            context_parts.append(
                f"Chronic Conditions: {', '.join(context.chronicConditions)}"
            )
        if context.allergies:
            context_parts.append(
                f"Known Allergies: {', '.join(context.allergies)}"
            )

        if context_parts:
            patient_info = " | ".join(context_parts)
            system_prompt += f"\n\nPATIENT CONTEXT:\n{patient_info}\nUse this context to personalize your responses."

    return system_prompt


async def process_chat_message(request: ChatRequest) -> ChatResponse:
    """Process chat message and return AI response"""
    try:
        system_prompt = build_system_prompt_with_context(request)

        # Build conversation history for Gemini
        conversation_history = [
            {
                "role": msg.role.value,
                "content": msg.content,
            }
            for msg in request.conversationHistory
        ]

        # Generate response
        response_text = await generate_chat_response(
            system_prompt=system_prompt,
            conversation_history=conversation_history,
            new_message=request.message,
        )

        return ChatResponse(
            message=response_text,
            sessionId=request.sessionId,
        )

    except Exception as e:
        raise RuntimeError(f"Chat processing failed: {str(e)}")