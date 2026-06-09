from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from src.services.ocr_service import analyze_document

router = APIRouter(prefix="/api/ocr", tags=["OCR"])

class OCRRequest(BaseModel):
    fileBase64: str
    mimeType: str
    documentType: str
    fileName: str

@router.post("/analyze")
async def analyze_document_route(request: OCRRequest):
    try:
        result = await analyze_document(
            file_base64=request.fileBase64,
            mime_type=request.mimeType,
            document_type=request.documentType,
            file_name=request.fileName,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))