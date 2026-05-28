# MediAssist AI

MediAssist AI is a full-stack health assistant monorepo with three parts:

- `frontend`: React + Vite + TypeScript client
- `backend`: Node.js + Express + TypeScript API
- `ai-service`: Python FastAPI-style AI service layer

The project is organized so the frontend talks to the backend API, and the backend can coordinate with the Python service for AI-driven features.

## Project Structure

```text
mediassist-ai/
├── ai-service/
├── backend/
├── frontend/
├── .gitignore
└── README.md
```

## Requirements

- Node.js 18 or newer
- npm
- Python 3.10 or newer

## Setup

Install dependencies for each app separately:

```bash
cd frontend
npm install

cd ../backend
npm install

cd ../ai-service
pip install -r requirements.txt
```

## Environment Variables

Create the needed `.env` files in the service folders before running the apps. The exact values depend on your deployment, but typical settings include database URLs, JWT secrets, API base URLs, and AI provider keys.

- `backend/.env` for the API server
- `frontend/.env` for the client app
- `ai-service/.env` for Python service credentials

## Running Locally

Run each service in its own terminal:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

```bash
cd ai-service
uvicorn src.main:app --reload
```

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Notes

- The repository includes a root `.gitignore` that already filters out common dependency folders, build output, logs, and local environment files.
- If you want to publish this project to GitHub, initialize Git at the root, commit the files, and push to your remote repository.
