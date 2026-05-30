from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum


class PainType(str, Enum):
    sharp = "sharp"
    dull = "dull"
    burning = "burning"
    throbbing = "throbbing"
    aching = "aching"
    stabbing = "stabbing"


class BodySide(str, Enum):
    front = "front"
    back = "back"


class DurationUnit(str, Enum):
    hours = "hours"
    days = "days"
    weeks = "weeks"
    months = "months"


class WorseAt(str, Enum):
    morning = "morning"
    afternoon = "afternoon"
    evening = "evening"
    night = "night"
    always = "always"


class SeverityLevel(str, Enum):
    mild = "mild"
    moderate = "moderate"
    severe = "severe"
    emergency = "emergency"


class Probability(str, Enum):
    high = "high"
    medium = "medium"
    low = "low"


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"


# Request Schemas
class SymptomAnalysisRequest(BaseModel):
    bodyPart: str = Field(..., min_length=1, description="Affected body part")
    bodySide: BodySide = Field(..., description="Front or back of body")
    symptoms: List[str] = Field(..., min_length=1, description="List of symptoms")
    painType: PainType = Field(..., description="Type of pain")
    severity: int = Field(..., ge=1, le=10, description="Pain severity 1-10")
    duration: str = Field(..., description="Duration value")
    durationUnit: DurationUnit = Field(..., description="Duration unit")
    worseAt: WorseAt = Field(..., description="When symptoms are worse")
    additionalNotes: Optional[str] = Field(None, description="Additional notes")
    patientAge: Optional[int] = Field(None, ge=1, le=120)
    patientGender: Optional[str] = Field(None)
    chronicConditions: Optional[List[str]] = Field(default=[])
    allergies: Optional[List[str]] = Field(default=[])


class ConversationMessage(BaseModel):
    role: MessageRole
    content: str


class PatientContext(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    chronicConditions: Optional[List[str]] = Field(default=[])
    allergies: Optional[List[str]] = Field(default=[])


class ChatRequest(BaseModel):
    sessionId: str = Field(..., description="Unique session identifier")
    message: str = Field(..., min_length=1, max_length=1000)
    conversationHistory: List[ConversationMessage] = Field(default=[])
    patientContext: Optional[PatientContext] = None


class MedicineInfoRequest(BaseModel):
    medicineName: str = Field(..., min_length=1, description="Medicine name")


# Response Schemas
class PossibleCondition(BaseModel):
    name: str
    probability: Probability
    description: str


class MedicineToConsider(BaseModel):
    name: str
    type: str  # OTC or Prescription
    reason: str
    howToUse: str = Field(
        default="",
        description="General guidance on how to use this medicine",
    )


class SymptomAnalysisResponse(BaseModel):
    possibleConditions: List[PossibleCondition]
    severity: SeverityLevel
    recommendation: str
    homeRemedies: List[str]
    medicinesToConsider: List[MedicineToConsider] = Field(default_factory=list)
    whenToSeeDoctor: str
    specialistType: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    sessionId: str


class MedicineInfoResponse(BaseModel):
    name: str
    genericName: str
    uses: List[str]
    dosage: str
    sideEffects: List[str]
    warnings: List[str]
    interactions: List[str]


class HealthCheckResponse(BaseModel):
    status: str
    message: str
    version: str