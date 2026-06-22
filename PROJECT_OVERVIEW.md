# MediAssist AI — Project Overview

## Architecture

```
User's Browser (React 19 + Vite + Tailwind v4)
       |
       | HTTP /api/* (JWT Bearer token)
       v
Backend (Node.js + Express 5 + TypeScript + Mongoose)
       |
       | HTTP (Axios) — AI tasks proxied to Python
       v
AI Service (Python FastAPI + Google Gemini 1.5 Pro / 2.5 Flash Lite)
```

- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT tokens stored in localStorage, attached via Axios interceptor
- **Monorepo**: 3 top-level folders — `backend/`, `frontend/`, `ai-service/`

---

## Folder Structure

```
mediassist-ai/
├── backend/
│   ├── src/
│   │   ├── server.ts                 # Express app entry point, middleware setup, route mounting
│   │   ├── config/
│   │   │   └── db.ts                 # MongoDB connection via Mongoose
│   │   ├── models/
│   │   │   ├── User.ts               # User schema (name, email, password, role, profile, verification, timestamps)
│   │   │   ├── Symptom.ts            # Symptom log schema (bodyPart, painType, severity, notes, userId)
│   │   │   ├── ChatHistory.ts        # Chat session schema (userId, title, messages array)
│   │   │   ├── EmergencyLog.ts       # Emergency event log schema (userId, symptoms, location, contacted)
│   │   │   ├── OCRResult.ts          # OCR scan result schema (userId, documentType, rawText, medicines, etc.)
│   │   │   └── Report.ts             # Generated PDF report schema (userId, symptomId, content)
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts     # JWT verification, attaches user to req
│   │   │   ├── adminMiddleware.ts    # Checks req.user.role === "admin"
│   │   │   ├── validateMiddleware.ts # express-validator chain runner + reusable validation chains
│   │   │   └── uploadMiddleware.ts   # Multer config for file uploads
│   │   ├── routes/
│   │   │   ├── authRoutes.ts         # /api/auth/* — register, login, verify, profile, password, logout
│   │   │   ├── symptomRoutes.ts      # /api/symptoms/* — CRUD + stats
│   │   │   ├── chatRoutes.ts         # /api/chat/* — sessions + messages
│   │   │   ├── emergencyRoutes.ts    # /api/emergency/* — contacts + event logs
│   │   │   ├── medicineRoutes.ts     # /api/medicine/* — lookup drug info
│   │   │   ├── hospitalRoutes.ts     # /api/hospitals/* — nearby + search + photo
│   │   │   ├── ocrRoutes.ts          # /api/ocr/* — analyze document + history
│   │   │   ├── reportRoutes.ts       # /api/reports/* — generate + CRUD
│   │   │   ├── timelineRoutes.ts     # /api/timeline/* — unified activity timeline
│   │   │   └── adminRoutes.ts        # /api/admin/* — stats + user management
│   │   ├── controllers/
│   │   │   ├── authController.ts     # register, login, getMe, updateProfile, changePassword, logout, verifyEmail, resendVerification
│   │   │   ├── symptomController.ts  # createSymptom (calls AI), getSymptoms, getSymptomById, deleteSymptom, getSymptomStats
│   │   │   ├── chatController.ts     # sendMessage (calls AI), createSession, getSessions, getSessionById, deleteSession
│   │   │   ├── emergencyController.ts # get/save contacts, log/resolve events
│   │   │   ├── medicineController.ts # getMedicineInfoHandler (calls AI)
│   │   │   ├── hospitalController.ts # getNearbyHospitals, searchHospitals, getHospitalPhoto
│   │   │   ├── ocrController.ts      # analyzeDocument (calls AI), getOCRHistory/Result, deleteOCRResult
│   │   │   ├── reportController.ts   # generateReport, getReports, getReportById, deleteReport
│   │   │   ├── timelineController.ts # getTimeline, getTimelineStats, getTimelineEntry
│   │   │   └── adminController.ts    # getStats, getAllUsers, updateUser
│   │   ├── services/
│   │   │   ├── aiService.ts          # HTTP client to ai-service endpoints
│   │   │   └── emailService.ts       # Nodemailer transporter + sendVerificationEmail
│   │   └── utils/
│   │       └── tokenUtils.ts         # JWT sign/verify helpers
│   ├── .env / .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx                  # React entry point
│   │   ├── App.tsx                   # Router, route config, AnimatePresence page transitions
│   │   ├── index.css                 # Tailwind directives, global glass-morphism styles
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page (hero, features, stats, CTA)
│   │   │   ├── Login.tsx             # Login form (email + password)
│   │   │   ├── Register.tsx          # Multi-step registration (personal → medical → account)
│   │   │   ├── VerifyEmail.tsx       # Email verification via token URL param
│   │   │   ├── VerifyNotice.tsx      # "Check your email" interstitial page
│   │   │   ├── Dashboard.tsx         # Health dashboard (stats cards, trends, quick actions)
│   │   │   ├── Profile.tsx           # Edit personal info, medical history, emergency contacts
│   │   │   ├── Analyzer.tsx          # Interactive body map + symptom analysis form + AI results
│   │   │   ├── Timeline.tsx          # Symptom history timeline (filterable, sortable, chart)
│   │   │   ├── Chat.tsx              # AI doctor chat (session list + message thread)
│   │   │   ├── MedicineInfo.tsx      # Drug lookup by name
│   │   │   ├── HospitalFinder.tsx    # Pakistan hospital finder (nearby + search + map)
│   │   │   ├── OCR.tsx               # Upload + analyze prescription/lab report
│   │   │   ├── Reports.tsx           # View/manage/download PDF medical reports
│   │   │   ├── Emergency.tsx         # Full-screen emergency mode (GPS, contacts, quick-dial)
│   │   │   ├── NotFound.tsx          # 404 page
│   │   │   └── admin/
│   │   │       ├── Dashboard.tsx     # Admin stats dashboard (charts, metrics)
│   │   │       └── Users.tsx         # Admin user management (search, filter, role change)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx        # Top navigation (glass, spring animations, mobile menu)
│   │   │   │   ├── Footer.tsx        # Site footer (scroll reveals, spring hover)
│   │   │   │   ├── ProtectedRoute.tsx # Auth guard (redirects to /login)
│   │   │   │   └── AdminRoute.tsx    # Admin guard (redirects to /dashboard)
│   │   │   ├── animations/
│   │   │   │   ├── PageTransition.tsx    # Fade + slide page enter/exit via framer-motion
│   │   │   │   ├── SmoothReveal.tsx     # Scroll-triggered fade + slide reveal
│   │   │   │   ├── StaggerContainer.tsx  # Staggered children entrance container
│   │   │   │   └── StaggerItem.tsx       # Individual stagger child
│   │   │   ├── BodyMap.tsx           # SVG body map (59+ zones, front/back, clickable)
│   │   │   ├── SymptomChart.tsx      # Severity trend chart (Recharts)
│   │   │   ├── SymptomForm.tsx       # Symptom entry form (bodyPart, pain, severity, notes)
│   │   │   ├── SymptomList.tsx       # Paginated symptom list with filters
│   │   │   ├── AnalysisResult.tsx    # AI analysis result card (conditions, remedies)
│   │   │   ├── AIAnalysisModal.tsx   # Modal showing detailed AI analysis
│   │   │   ├── MedicineChart.tsx     # Medicine info display card
│   │   │   ├── ReportCard.tsx        # Report summary card
│   │   │   ├── ReportModal.tsx       # Detailed report viewer modal
│   │   │   ├── HospitalCard.tsx      # Hospital result card
│   │   │   ├── EmergencyContacts.tsx # Emergency contacts manager
│   │   │   ├── EmergencyNumbers.tsx  # Pakistan emergency numbers quick-dial
│   │   │   ├── StatsCards.tsx        # Dashboard stat cards
│   │   │   ├── RecentSymptoms.tsx    # Dashboard recent symptom widget
│   │   │   ├── LoadingSpinner.tsx    # Full-screen loading spinner
│   │   │   ├── FormField.tsx         # Reusable form field with validation
│   │   │   ├── OTPInput.tsx          # OTP digit input component
│   │   │   ├── VoiceRecorder.tsx     # Voice recording for symptom notes
│   │   │   └── ThemeToggle.tsx       # Dark/light mode toggle
│   │   ├── hooks/
│   │   │   ├── useAuth.ts            # Auth state + login/register/logout/profile actions
│   │   │   ├── useSymptoms.ts        # Symptom CRUD + analysis state management
│   │   │   ├── useChat.ts            # Chat sessions + messaging state management
│   │   │   └── useEmergency.ts       # Emergency contacts + event logging
│   │   ├── store/
│   │   │   ├── authStore.ts          # Zustand store for user + token state
│   │   │   └── themeStore.ts         # Zustand store for dark/light mode
│   │   ├── services/
│   │   │   ├── api.ts                # Axios instance, interceptors (token, error handling)
│   │   │   ├── authService.ts        # Login, register, getMe, updateProfile, changePassword, logout
│   │   │   ├── symptomService.ts     # CRUD symptoms, get stats
│   │   │   ├── chatService.ts        # Sessions CRUD, send message
│   │   │   ├── emergencyService.ts   # Contacts CRUD, log/resolve events
│   │   │   ├── medicineService.ts    # Medicine info lookup
│   │   │   ├── hospitalService.ts    # Nearby/search hospitals
│   │   │   ├── ocrService.ts         # Upload+analyze, history, CRUD
│   │   │   ├── reportService.ts      # Generate, CRUD, download PDF
│   │   │   └── timelineService.ts    # Timeline entries + stats
│   │   ├── types/
│   │   │   └── index.ts              # All TypeScript interfaces/types
│   │   ├── constants/
│   │   │   └── index.ts              # Body parts, pain types, severity levels, enums
│   │   └── utils/
│   │       └── helpers.ts            # Formatters, validators, utility functions
│   ├── .env                          # VITE_BACKEND_URL, VITE_APP_NAME
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── ai-service/
│   └── src/
│       ├── main.py                   # FastAPI entry point, CORS, router mounting
│       ├── models/
│       │   └── request_models.py     # Pydantic models for all request/response schemas
│       ├── routes/
│       │   ├── symptom_routes.py     # POST /api/symptoms/analyze
│       │   ├── chat_routes.py        # POST /api/chat/message
│       │   ├── medicine_routes.py    # POST /api/medicine/info
│       │   └── ocr_routes.py         # POST /api/ocr/analyze
│       ├── services/
│       │   ├── gemini_service.py     # Gemini client wrapper, generate_content, generate_chat_response
│       │   ├── symptom_analyzer.py   # Build prompt + parse AI response for symptoms
│       │   ├── chat_service.py       # Chat system prompt + conversation context builder
│       │   └── ocr_service.py        # Document image analysis, lab value extraction
│       ├── utils/
│       │   └── helpers.py            # JSON parsing, error handling utilities
│       └── config/
│           └── .env                  # GEMINI_API_KEY, GEMINI_MODEL, PORT
│
├── scripts/
│   ├── update-admin.js              # Standalone script to elevate user to admin
│   └── elevate-admin.ts             # TypeScript version using backend imports
│
└── PROJECT_OVERVIEW.md              # This file
```

---

## Complete API Route Map

### Backend — Express (`/api/...`)

#### Auth (Public + Private)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user (sends verification email) |
| POST | `/api/auth/login` | — | Login, returns JWT + user profile |
| GET | `/api/auth/verify-email/:token` | — | Verify email via token link |
| POST | `/api/auth/resend-verification` | — | Resend verification email |
| GET | `/api/auth/me` | User | Get current user profile |
| PUT | `/api/auth/profile` | User | Update profile (name, age, gender, blood, allergies, conditions, contacts) |
| PUT | `/api/auth/change-password` | User | Change password (requires current password) |
| POST | `/api/auth/logout` | User | Logout (stateless, clears token client-side) |

#### Symptoms (Private)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/symptoms/stats` | Symptom statistics for dashboard |
| GET | `/api/symptoms` | List symptoms (paginated, filterable by severity/bodyPart) |
| POST | `/api/symptoms` | Log a symptom + trigger AI analysis |
| GET | `/api/symptoms/:id` | Get single symptom with AI analysis |
| DELETE | `/api/symptoms/:id` | Delete a symptom entry |

#### Chat (Private)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/chat/session` | Create a new chat session |
| POST | `/api/chat/message` | Send a message to AI doctor |
| GET | `/api/chat/sessions` | List chat sessions (paginated) |
| GET | `/api/chat/sessions/:sessionId` | Get session with all messages |
| DELETE | `/api/chat/sessions/:sessionId` | Delete a chat session |

#### Emergency (Private)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/emergency/contacts` | Get emergency contacts |
| PUT | `/api/emergency/contacts` | Save emergency contacts |
| POST | `/api/emergency/log` | Log an emergency event |
| GET | `/api/emergency/logs` | Get emergency event history |
| PUT | `/api/emergency/logs/:id/resolve` | Mark emergency as resolved |

#### Medicine (Private)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/medicine/info` | Look up medicine info (uses, dosage, side effects) |

#### Hospital (Public)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/hospitals/nearby` | Find hospitals near a lat/lng (Haversine) |
| GET | `/api/hospitals/search` | Search hospitals by name |
| GET | `/api/hospitals/photo/:photoReference` | Get hospital photo |

#### OCR (Private)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/ocr/analyze` | Upload + analyze medical document image |
| GET | `/api/ocr/history` | Get OCR analysis history |
| GET | `/api/ocr/:id` | Get single OCR result |
| DELETE | `/api/ocr/:id` | Delete an OCR result |

#### Reports (Private)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reports/generate/:symptomId` | Generate a PDF medical report |
| GET | `/api/reports` | List reports (paginated) |
| GET | `/api/reports/:reportId` | Get single report |
| DELETE | `/api/reports/:reportId` | Delete a report |

#### Timeline (Private)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/timeline/stats` | Timeline statistics |
| GET | `/api/timeline` | Unified activity timeline (paginated, filterable) |
| GET | `/api/timeline/:id` | Get single timeline entry |

#### Admin (Admin only)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/stats` | System-wide stats (users, symptoms, OCRs, reports, AI perf) |
| GET | `/api/admin/users` | List all users (paginated, searchable, filterable by role) |
| PUT | `/api/admin/users/:id` | Update user role |

### AI Service — FastAPI (`/api/...`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/symptoms/analyze` | Analyze symptoms → possible conditions, severity, remedies |
| POST | `/api/chat/message` | Conversational AI doctor chat |
| POST | `/api/medicine/info` | Get detailed medicine information |
| POST | `/api/ocr/analyze` | Analyze medical document image (base64) |

---

## Features

### 1. User Registration & Email Verification
- Multi-step registration form (personal info → medical history → account credentials)
- Password strength validation (min 8 chars, upper+lower+digit)
- Verification email sent via Nodemailer (Gmail SMTP)
- Token-based email verification with expiry
- Resend verification option

### 2. JWT Authentication & Session
- Login/Logout with JWT tokens
- Token stored in localStorage, attached to all API requests via Axios interceptor
- Auto-redirect to login on 401

### 3. Profile Management
- Edit name, age, gender, blood group
- Manage allergies and chronic conditions (add/remove items, inline validation)
- Manage emergency contacts (name, phone, relation)
- Change password with current password verification

### 4. Interactive Body Map (Symptom Analyzer)
- SVG-based body map with 59+ zones (front + back views)
- Click to select body part, then fill in pain details
- AI-powered analysis: possible conditions, severity, recommendations, home remedies
- Voice recording for symptom notes

### 5. AI Doctor Chat
- Conversational AI chat with session management
- Context-aware responses (considers age, gender, conditions, allergies)
- Chat history persists across sessions
- Create, switch, delete chat sessions

### 6. Medicine Information Lookup
- Search any medicine by name
- Returns: uses, dosage, side effects, warnings, drug interactions
- Powered by Gemini AI

### 7. Hospital Finder (Pakistan)
- Find nearby hospitals by lat/lng (Haversine distance calculation)
- Search hospitals by name
- Hospital photos from Google Places API
- Hospital cards with address, rating, contact info

### 8. OCR Document Scanner
- Upload prescription or lab report images
- AI extracts: raw text, summary, simplified explanation, medicines, lab values
- Analysis history with CRUD
- Lab value normalization (flag abnormal values)

### 9. Health Dashboard
- Stats cards: total symptoms, AI analyses, reports, active sessions
- Recent symptoms widget
- Quick action buttons (Analyze, Chat, Medicine, Hospitals)
- AI performance summary

### 10. Symptom Timeline
- Chronological view of all symptom entries
- Filterable by severity, body part, date range
- Severity trend chart (Recharts)
- Expandable entries with full AI analysis

### 11. Medical Report Generation
- Generate PDF reports from symptom analyses
- jsPDF with branded formatting (logo, severity badge, conditions table)
- Report history with view/download/delete
- Includes: patient info, symptoms, AI analysis, disclaimer

### 12. Emergency Mode
- Full-screen emergency interface
- GPS location sharing
- Quick-dial Pakistan emergency numbers
- Emergency contact notification
- Emergency event logging with resolution tracking

### 13. Admin Panel
- Admin dashboard: system stats, user growth chart, role distribution pie chart
- Admin user management: search, filter by role, paginated user table
- Change user roles (prevent self-demotion, protect last admin)

### 14. Animations & UI
- Spring-physics micro-interactions (hover, tap, menu open/close)
- Page transitions (fade + slide with custom cubic-bezier)
- Scroll-triggered reveals (fade-in on scroll)
- Staggered list animations
- Glass-morphism design (backdrop blur, semi-transparent backgrounds)
- Dark/light mode toggle (Zustand store)
- Fully responsive (mobile hamburger menu, fluid layouts)

### 15. Security & Validation
- Frontend + backend field validation (names letters-only, no pure numbers for medical fields, etc.)
- express-validator chains on all mutation endpoints
- Multer file upload handling
- Rate limiting on auth endpoints (via Axios interceptor detection)
- CORS enabled
- MongoDB injection prevention (Mongoose + sanitization)

---

## Data Flow

### Symptom Analysis Flow
```
User → BodyMap (select zone) → SymptomForm (pain details, severity, notes)
     → POST /api/symptoms (Express saves to MongoDB)
     → Backend calls POST /api/symptoms/analyze (FastAPI)
     → FastAPI calls Gemini API with structured prompt
     → Gemini returns JSON (conditions, severity, remedies)
     → FastAPI returns structured response
     → Backend saves AI result alongside symptom
     → Frontend renders AnalysisResult card
```

### Chat Flow
```
User → Chat.tsx (type message) → POST /api/chat/message (Express)
     → Backend calls POST /api/chat/message (FastAPI)
     → FastAPI builds conversation context (system prompt + history + new message)
     → FastAPI calls Gemini API
     → Gemini returns response text
     → Response flows back to frontend
     → Message appended to chat thread
```

### OCR Flow
```
User → OCR.tsx (select file + document type)
     → POST /api/ocr/analyze (Express, multipart upload via Multer)
     → Backend saves file temporarily, converts to base64
     → Calls POST /api/ocr/analyze (FastAPI, base64 payload)
     → FastAPI sends base64 image + prompt to Gemini
     → Gemini returns structured document analysis
     → FastAPI returns parsed result (rawText, summary, medicines, labValues)
     → Backend saves OCRResult to MongoDB
     → Frontend displays analysis
```

### Report Flow
```
User → Reports.tsx → click "Generate" on a symptom
     → POST /api/reports/generate/:symptomId (Express)
     → Backend fetches symptom + AI analysis from MongoDB
     → Generates report content (structured JSON)
     → Saves Report to MongoDB
     → Frontend renders ReportCard with "Download PDF" button
     → PDF generated client-side via jsPDF (no server load)
```

### Emergency Flow
```
User → Emergency.tsx → "Start Emergency" button
     → GPS location captured (browser Geolocation API)
     → Emergency contacts loaded from backend
     → POST /api/emergency/log (symptoms, location, contacts)
     → Backend logs event, marks active
     → User can call emergency numbers via tel: links
     → After resolution: PUT /api/emergency/logs/:id/resolve
```

---

## Database Models (MongoDB/Mongoose)

### User
- `name`, `email`, `password` (hashed bcrypt)
- `age`, `gender`, `bloodGroup`
- `allergies`, `chronicConditions` (arrays of strings)
- `emergencyContact` (single, legacy): `{ name, phone, relation }`
- `emergencyContacts` (array): `[{ name, phone, relation }]`
- `role`: `"user" | "admin"`
- `isVerified`: boolean
- `verificationToken`, `verificationTokenExpires`
- Timestamps: `createdAt`, `updatedAt`

### Symptom
- `userId` (ref User)
- `bodyPart`, `side`, `painType` (enum: sharp, dull, burning, throbbing, stabbing, aching)
- `severity` (1-10)
- `duration`, `worseAt` (enum: morning, afternoon, evening, night)
- `notes`
- `aiAnalysis`: `{ possibleConditions[], severity, recommendation, homeRemedies[], medicinesToConsider[], whenToSeeDoctor, specialistType }`
- Timestamps

### ChatHistory
- `userId` (ref User)
- `title`
- `messages[]`: `{ role: "user" | "assistant", content, timestamp }`
- Timestamps

### EmergencyLog
- `userId` (ref User)
- `symptoms`, `location` (lat, lng, address)
- `notifiedContacts[]`
- `resolved`: boolean
- `resolvedAt`
- Timestamps

### OCRResult
- `userId` (ref User)
- `documentType`: `"prescription" | "lab_report"`
- `fileName`, `fileSize`, `mimeType`
- `rawText`, `summary`, `simplifiedExplanation`
- `extractedMedicines[]`, `labValues[]`
- `importantNotes[]`, `warnings[]`, `followUpActions[]`
- `doctorName`, `patientName`, `date`
- Timestamps

### Report
- `userId` (ref User)
- `symptomId` (ref Symptom)
- `content` (JSON object with full analysis)
- Timestamps

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mediassist
JWT_SECRET=<secret>
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<gmail>
SMTP_PASS=<app-password>
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=MediAssist AI
```

### AI Service (`ai-service/.env`)
```
GEMINI_API_KEY=<key>
GEMINI_MODEL=gemini-2.5-flash-lite
PORT=8000
```
