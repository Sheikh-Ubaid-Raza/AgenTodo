# Quickstart Guide: Frontend Interface & Full-Stack Integration

## Prerequisites

- Node.js 18+ for frontend development
- Python 3.11+ for backend development
- PostgreSQL-compatible database (Neon PostgreSQL recommended)
- Better Auth secret key for authentication

## Setup Instructions

### 1. Clone and Initialize the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment and install dependencies:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and Better Auth secret
```

4. Run the backend:
```bash
uvicorn src.main:app --reload
```

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your backend API URL and Better Auth config
```

4. Run the frontend:
```bash
npm run dev
```

## Running the Application

1. Start the backend server on port 8000
2. Start the frontend server on port 3000
3. Access the application at http://localhost:3000

## Key Features

- **Authentication**: Users can sign up and sign in using email and password
- **Todo Management**: Create, read, update, delete, and toggle completion status of todos
- **User Isolation**: Users only see their own todos
- **Responsive UI**: Works on mobile, tablet, and desktop devices
- **Optimistic Updates**: UI updates immediately with fallback on server response

## Development Commands

### Backend
- `pytest`: Run backend tests
- `black .`: Format Python code
- `mypy .`: Run type checking

### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run lint`: Lint the codebase
- `npm test`: Run frontend tests