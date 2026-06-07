MediAssist AI — Project Overview

1. What this project is

- MediAssist AI is a full-stack medical assistant monorepo that provides symptom analysis, AI chat with a medical assistant, medicine information, hospital finder, and medical report generation.
- Tech stack:
  - Frontend: React + Vite + TypeScript
  - Backend API: Node.js + Express + TypeScript, MongoDB for persistence
  - AI microservice: Python (FastAPI) that uses Google Gemini (via genai SDK)

2. High-level architecture and interaction

- The frontend (client) calls the backend Express API (`BACKEND_URL`, default http://localhost:5000).
- The backend handles authentication, data persistence, and orchestration. For AI tasks it calls the AI microservice via `AI_SERVICE_URL` (default http://localhost:8000).
- The AI microservice (FastAPI) calls Google Gemini to produce structured JSON outputs for symptom analysis, chat, and medicine information.

3. How to run locally (from README)

- Frontend
  - cd frontend
  - npm install
  - npm run dev
- Backend
  - cd backend
  - npm install
  - npm run dev
- AI Service
  - cd ai-service
  - pip install -r requirements.txt
  - uvicorn src.main:app --reload

4. Important environment variables (examples)

- AI service: `GEMINI_API_KEY`, `GEMINI_MODEL`, `ALLOWED_ORIGINS`
- Backend: `MONGO_URI`, `JWT_SECRET`, `AI_SERVICE_URL`, `GOOGLE_MAPS_API_KEY`, `FRONTEND_URL`, `PORT`, rate limit settings
- Frontend: `VITE_BACKEND_URL`, `VITE_AI_SERVICE_URL`

5. AI microservice (ai-service) — routes and behavior

- Root and health:
  - GET / => root info and docs link
  - GET /health => health check
- Symptoms:
  - POST /api/symptoms/analyze
    - Request model: `SymptomAnalysisRequest` (bodyPart, bodySide, symptoms[], painType, severity 1-10, duration + unit, worseAt, optional patientAge, patientGender, chronicConditions, allergies, additionalNotes)
    - Calls Gemini with a carefully constructed prompt and expects a strict JSON response matching `SymptomAnalysisResponse`:
      - possibleConditions: [{name, probability (high|medium|low), description}]
      - severity: one of mild|moderate|severe|emergency
      - recommendation: string
      - homeRemedies: list
      - medicinesToConsider: list of {name,type,reason,howToUse}
      - whenToSeeDoctor: string
      - specialistType: optional string
- Chat:
  - POST /api/chat/message
    - Request model: `ChatRequest` (sessionId, message, conversationHistory[], optional patientContext)
    - Uses Gemini conversation generation (system prompt includes safety and empathy rules). Returns `ChatResponse` {message, sessionId}.
- Medicine:
  - POST /api/medicine/info
    - Request model: `MedicineInfoRequest` {medicineName}
    - Builds a medicine-specific prompt requiring pure JSON and expects `MedicineInfoResponse` with name, genericName, uses[], dosage, sideEffects[], warnings[], interactions[]
- Implementation notes:
  - `gemini_service.py` wraps genai client with retries and timeouts; `helpers.py` contains JSON cleaning/parsing utilities and prompt helpers.

6. Backend API (Express) — public/private routes and controllers

- Base prefix: `/api` (index.ts mounts routes under `/api/...`). Health: GET /health
- Authentication (`/api/auth`)
  - POST /api/auth/register — register new user (public)
  - POST /api/auth/login — login (public)
  - GET /api/auth/me — get current user (private)
  - PUT /api/auth/profile — update profile (private)
  - PUT /api/auth/change-password — change password (private)
  - POST /api/auth/logout — logout (private)
- Symptoms (`/api/symptoms`) — all private (authMiddleware)
  - POST /api/symptoms — create new symptom entry and trigger AI analysis (calls `/api/symptoms/analyze` on AI service)
  - GET /api/symptoms — list user's symptoms (pagination)
  - GET /api/symptoms/:id — get single symptom
  - DELETE /api/symptoms/:id — delete symptom
  - GET /api/symptoms/stats — dashboard stats (severity distribution, body part counts, recent symptoms)
- Chat (`/api/chat`) — all private
  - POST /api/chat/message — send a message, persists chat history and calls AI microservice `/api/chat/message`
  - POST /api/chat/session — create new chat session (returns sessionId)
  - GET /api/chat/sessions — list chat sessions
  - GET /api/chat/sessions/:sessionId — get messages for a session
  - DELETE /api/chat/sessions/:sessionId — soft-delete session
- Reports (`/api/reports`) — private
  - POST /api/reports/generate/:symptomId — generate report from a symptom's AI analysis and persist it
  - GET /api/reports — list reports
  - GET /api/reports/:reportId — get single report
  - DELETE /api/reports/:reportId — delete report
- Hospitals (`/api/hospitals`) — public
  - GET /api/hospitals/nearby?lat=&lng=&radius=&type= — return hospitals from embedded Pakistan DB (distance calculation)
  - GET /api/hospitals/search?query=&lat=&lng= — search hospitals
  - GET /api/hospitals/photo/:photoReference — returns placeholder photo URL
- Medicine (`/api/medicine`) — private
  - POST /api/medicine/info — forwards to AI microservice `/api/medicine/info` and returns structured medicine information

7. Backend ↔ AI service integration

- The backend's `aiService.ts` uses `AI_SERVICE_URL` and calls these AI endpoints:
  - POST /api/symptoms/analyze
  - POST /api/chat/message
  - POST /api/medicine/info
  - GET /health
- Each call includes retry logic and distinguishes client (4xx) vs server/network errors.

8. Frontend (client) — pages, key routes and API usages

- Client routes (UI pages):
  - / (Home), /login, /register, /analyzer, /chat, /dashboard, /medicine, /hospitals, plus NotFound
- Key frontend API wrappers (call backend endpoints):
  - `authService.ts` => /api/auth/register, /api/auth/login, /api/auth/me, /api/auth/profile, /api/auth/change-password, /api/auth/logout
  - `symptomService.ts` => /api/symptoms (POST, GET, GET/:id, DELETE/:id, GET /stats)
  - `chatService.ts` => /api/chat/message, /api/chat/session, /api/chat/sessions, /api/chat/sessions/:sessionId
  - `reportService.ts` => /api/reports/generate/:symptomId, /api/reports...
  - `reportService` includes client-side PDF generation (jsPDF) to download reports
  - `api.ts` sets `BACKEND_URL` (VITE env var), attaches bearer token from `authStore` and handles common errors
- UI features:
  - Symptom analyzer UI with body-map and symptom form
  - AI Chat UI with conversation history
  - Dashboard showing stats + recent symptoms
  - Medicine information lookup
  - Hospital finder UI that consumes `/api/hospitals` endpoints (client components include a `HospitalFinder`)
  - Reports list and PDF download

9. Data models (high-level)

- Backend Mongoose models (summary): `User`, `Symptom`, `Report`, `ChatHistory` (files in backend/src/models)
- AI service request/response models (Pydantic in ai-service/src/models/schemas.py): `SymptomAnalysisRequest`, `SymptomAnalysisResponse`, `ChatRequest`, `ChatResponse`, `MedicineInfoRequest`, `MedicineInfoResponse`

10. Security & operational notes

- Backend uses JWT-based `authMiddleware` to protect private routes
- CORS configured in both backend and ai-service; allowed origins set via env
- Rate limiting applied on `/api` in backend
- AI service requires `GEMINI_API_KEY`; if missing the ai-service raises on startup
- The ai-service expects the Gemini SDK (`google-genai`) and uses retry/backoff for reliability

11. Developer notes & next steps

- Default ports used in code/comments: backend `5000`, ai-service example `8000`, frontend Vite default `3000`.
- To test end-to-end locally set `VITE_BACKEND_URL` and `VITE_AI_SERVICE_URL` in frontend env, set `AI_SERVICE_URL` in backend .env to point to running ai-service.
- Pay attention to Gemini API costs and API key safety.

12. File references (entry points)

- Backend server: [backend/src/index.ts](backend/src/index.ts#L1)
- Backend AI integration: [backend/src/services/aiService.ts](backend/src/services/aiService.ts#L1)
- AI microservice entry: [ai-service/src/main.py](ai-service/src/main.py#L1)
- AI microservice routes: [ai-service/src/routes/symptom_routes.py](ai-service/src/routes/symptom_routes.py#L1), [ai-service/src/routes/chat_routes.py](ai-service/src/routes/chat_routes.py#L1), [ai-service/src/routes/medicine_routes.py](ai-service/src/routes/medicine_routes.py#L1)
- Frontend API wrapper: [frontend/src/services/api.ts](frontend/src/services/api.ts#L1)
