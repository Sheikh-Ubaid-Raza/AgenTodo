# **Hackathon II**

# **Todo App Feature Progression**

## **Basic Level (Core Essentials)**

These form the foundation—quick to build, essential for any MVP:

1. Add Task – Create new todo items  
2. Delete Task – Remove tasks from the list  
3. Update Task – Modify existing task details  
4. View Task List – Display all tasks  
5. Mark as Complete – Toggle task completion status

# **Phase II: Todo Full-Stack Web Application**

*Basic Level Functionality*

**Objective:** Using Claude Code and Spec-Kit Plus transform the console app into a modern multi-user web application with persistent storage.

💡**Development Approach:** Use the [Agentic Dev Stack workflow](#the-agentic-dev-stack:-agents.md-+-spec-kitplus-+-claude-code): Write spec → Generate plan → Break into tasks → Implement via Claude Code. No manual coding allowed. We will review the process, prompts, and iterations to judge each phase and project.

## **Requirements**

* Implement all 5 Basic Level features as a web application  
* Create RESTful API endpoints  
* Build responsive frontend interface  
* Store data in Neon Serverless PostgreSQL database  
* Authentication – Implement user signup/signin using Better Auth

## **Technology Stack**

| Layer | Technology |
| :---- | :---- |
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Spec-Driven | Claude Code \+ Spec-Kit Plus |
| Authentication | Better Auth |

## **API Endpoints**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/{user\_id}/tasks | List all tasks |
| POST | /api/{user\_id}/tasks | Create a new task |
| GET | /api/{user\_id}/tasks/{id} | Get task details |
| PUT | /api/{user\_id}/tasks/{id} | Update a task |
| DELETE | /api/{user\_id}tasks/{id} | Delete a task |
| PATCH | /api/{user\_id}tasks/{id}/complete | Toggle completion |

# **Securing the REST API**

*Better Auth \+ FastAPI Integration*

# **The Challenge**

Better Auth is a JavaScript/TypeScript authentication library that runs on your **Next.js frontend**. However, your **FastAPI backend** is a separate Python service that needs to verify which user is making API requests.

# **The Solution: JWT Tokens**

Better Auth can be configured to issue **JWT (JSON Web Token)** tokens when users log in. These tokens are self-contained credentials that include user information and can be verified by any service that knows the secret key.

# **How It Works**

* User logs in on Frontend → Better Auth creates a session and issues a JWT token  
* Frontend makes API call → Includes the JWT token in the Authorization: Bearer \<token\> header  
* Backend receives request → Extracts token from header, verifies signature using shared secret  
* Backend identifies user → Decodes token to get user ID, email, etc. and matches it with the user ID in the URL  
* Backend filters data → Returns only tasks belonging to that user

# **What Needs to Change**

| Component | Changes Required |
| :---- | :---- |
| **Better Auth Config** | Enable JWT plugin to issue tokens |
| **Frontend API Client** | Attach JWT token to every API request header |
| **FastAPI Backend** | Add middleware to verify JWT and extract user |
| **API Routes** | Filter all queries by the authenticated user's ID |

# **The Shared Secret**

Both frontend (Better Auth) and backend (FastAPI) must use the **same secret key** for JWT signing and verification. This is typically set via environment variable **BETTER\_AUTH\_SECRET** in both services.

# **Security Benefits**

| Benefit | Description |
| :---- | :---- |
| **User Isolation** | Each user only sees their own tasks |
| **Stateless Auth** | Backend doesn't need to call frontend to verify users |
| **Token Expiry** | JWTs expire automatically (e.g., after 7 days) |
| **No Shared DB Session** | Frontend and backend can verify auth independently |

# **API Behavior Change**

**After Auth:**

| All endpoints require valid JWT token |
| :---- |
| Requests without token receive 401 Unauthorized |
| Each user only sees/modifies their own tasks |
| Task ownership is enforced on every operation |

# **Bottom Line**

The REST API endpoints stay the same (**GET /api/user\_id/tasks**, **POST /api/user\_id/tasks**, etc.), but every request now must include a JWT token, and all responses are filtered to only include that user's data.

