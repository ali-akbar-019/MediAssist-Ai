from fastapi import APIRouter, HTTPException
from src.models.schemas import ChatRequest, ChatResponse
from src.services.gemini_service import GeminiConfigurationError
from src.services.chat_service import process_chat_message

router = APIRouter(prefix="/api/chat", tags=["Chat"])


@router.post("/message", response_model=ChatResponse)
async def send_message_route(request: ChatRequest):
    """
    Send a message to MediAssist AI doctor and get a response.
    Maintains conversation history for contextual responses.
    """
    try:
        result = await process_chat_message(request)
        return result
    except GeminiConfigurationError as e:
        raise HTTPException(
            status_code=503,
            detail=str(e),
        )
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
            detail=f"Unexpected error during chat processing: {str(e)}",
        )