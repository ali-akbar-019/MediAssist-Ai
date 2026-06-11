import traceback
from google import genai
from google.genai import types
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_not_exception_type
from dotenv import load_dotenv
import os
import asyncio
from pathlib import Path

load_dotenv(Path(__file__).resolve().parents[2] / ".env")

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

print(f"🔧 GEMINI_MODEL: {GEMINI_MODEL}")


class GeminiConfigurationError(RuntimeError):
    pass


_client = None


def get_gemini_client():
    global _client

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise GeminiConfigurationError(
            "GEMINI_API_KEY is not set in environment variables"
        )

    if _client is None:
        try:
            _client = genai.Client(api_key=api_key)
            print("✅ Gemini client initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize Gemini client: {str(e)}")
            raise RuntimeError(f"Failed to initialize Gemini client: {str(e)}")

    return _client

# Generation config
GENERATION_CONFIG = {
    "temperature": 0.3,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 2048,
}


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_not_exception_type(GeminiConfigurationError),
)
async def generate_content(prompt: str) -> str:
    """Generate content from Gemini with retry logic"""
    client = get_gemini_client()

    try:
        print(f"📤 Calling Gemini API with model: {GEMINI_MODEL}")
        print(f"📝 Prompt length: {len(prompt)} characters")
        
        # Run in thread pool since the SDK might be synchronous
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=GENERATION_CONFIG["temperature"],
                top_p=GENERATION_CONFIG["top_p"],
                top_k=GENERATION_CONFIG["top_k"],
                max_output_tokens=GENERATION_CONFIG["max_output_tokens"],
            )
        )

        if not response.text:
            print("⚠️ Empty response from Gemini API")
            raise ValueError("Empty response from Gemini API")

        print(f"✅ Gemini response received: {len(response.text)} characters")
        return response.text

    except Exception as e:
        print(f"❌ Gemini API error: {type(e).__name__}: {str(e)}")
        traceback.print_exc()  # This prints the full stack trace
        raise RuntimeError(f"Gemini API error: {str(e)}")


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_not_exception_type(GeminiConfigurationError),
)
async def generate_chat_response(
    system_prompt: str,
    conversation_history: list[dict],
    new_message: str,
) -> str:
    """Generate chat response using Gemini with conversation history"""
    client = get_gemini_client()

    try:
        print(f"💬 Generating chat response")
        print(f"📝 System prompt length: {len(system_prompt)}")
        print(f"💬 New message: {new_message[:50]}...")
        
        # Build chat history as a single string with context
        chat_context = system_prompt + "\n\n"
        
        # Add conversation history
        for msg in conversation_history:
            role = "User" if msg["role"] == "user" else "Assistant"
            chat_context += f"{role}: {msg['content']}\n"
        
        # Add new message
        chat_context += f"User: {new_message}\n\nAssistant: "
        
        # Run in thread pool
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=GEMINI_MODEL,
            contents=chat_context,
            config=types.GenerateContentConfig(
                temperature=GENERATION_CONFIG["temperature"],
                top_p=GENERATION_CONFIG["top_p"],
                top_k=GENERATION_CONFIG["top_k"],
                max_output_tokens=GENERATION_CONFIG["max_output_tokens"],
            )
        )

        if not response.text:
            print("⚠️ Empty response from Gemini API")
            raise ValueError("Empty response from Gemini API")

        print(f"✅ Chat response received: {len(response.text)} characters")
        return response.text

    except Exception as e:
        print(f"❌ Gemini chat error: {type(e).__name__}: {str(e)}")
        traceback.print_exc()
        raise RuntimeError(f"Gemini chat error: {str(e)}")