# Feature Specification: Floating Conversational UI & API Integration

**Feature Branch**: `001-floating-chat-ui`
**Created**: 2026-02-05
**Status**: Draft
**Input**: User description: "Phase 3 Part 2: Floating Conversational UI & API Integration

Target audience: End-users and frontend developers
[cite_start]Focus: Integrating a floating OpenAI ChatKit UI and connecting it to the stateless FastAPI backend. [cite: 133, 435]

Success criteria:
- [cite_start]**Floating Chat Widget**: A sleek, professional chat bubble in the bottom-right corner that expands into a chat window upon clicking, ensuring the Phase 2 dashboard remains fully visible. [cite: 139]
- [cite_start]**Authenticated API Connection**: The frontend must successfully send natural language messages to `POST /api/{user_id}/chat` with the Better Auth JWT token in the 'Authorization: Bearer' header. [cite: 157, 454]
- [cite_start]**Session Continuity**: The UI must handle `conversation_id` logic to allow users to resume previous chat sessions retrieved from the database. [cite: 456, 458]
- [cite_start]**Transparency & Feedback**: Display real-time AI text responses and clear indicators for "tool_calls" (e.g., showing a status like "Marking task 3 as complete..."). [cite: 458, 475]
- [cite_start]**Error Handling**: Graceful loading states and user-friendly error messages if the backend or AI Agent is unreachable. [cite: 501]

Constraints:
- [cite_start]**Framework**: Next.js 16+ (App Router), TypeScript, and Tailwind CSS. [cite: 143]
- [cite_start]**AI UI Component**: Must use OpenAI ChatKit for the conversational interface. [cite: 435, 503]
- [cite_start]**Security**: Pass the `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` and ensure domain allowlisting is configured. [cite: 517]
- **Intelligence**: Must use existing sub-agents in `.claude/` to perform implementation and code modifications.

Not building:
- [cite_start]New backend MCP tools (Assumed functional from Part 1). [cite: 450, 460]
- [cite_start]Advanced event-driven features or Kafka producers (Reserved for Phase 5). [cite: 569, 661]
- [cite_start]Implementation of voice commands or multi-language support (Bonus features). [cite: 60]"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Floating Chat Interface (Priority: P1)

As an end-user, I want to interact with a floating chat widget that appears as a chat bubble in the bottom-right corner of the screen. When I click the bubble, it expands into a full chat window while keeping the existing dashboard visible in the background. This allows me to seamlessly switch between dashboard tasks and AI-powered conversations without losing my place in the application.

**Why this priority**: This is the core functionality that enables the AI-powered conversation experience while maintaining the existing dashboard functionality that users are familiar with.

**Independent Test**: The floating chat widget can be tested by clicking the chat bubble in the bottom-right corner and verifying that it expands into a full chat window without affecting the underlying dashboard. The widget should be accessible and usable without interfering with the main application.

**Acceptance Scenarios**:

1. **Given** the dashboard is loaded and visible, **When** I click the floating chat bubble in the bottom-right corner, **Then** the chat window expands and overlays the dashboard while keeping the dashboard visible underneath
2. **Given** the chat window is expanded, **When** I minimize or close the chat window, **Then** the dashboard returns to its original state without any visual disruption

---

### User Story 2 - Authenticated AI Conversation (Priority: P1)

As an authenticated user, I want to send natural language messages to an AI assistant through the floating chat interface. The system must securely authenticate my requests using my existing JWT token and route them to the AI backend for processing. This ensures that my conversations are personalized and secure.

**Why this priority**: Authentication is critical for security and personalization, ensuring that each user's conversations and tasks remain private and associated with their account.

**Independent Test**: The authenticated conversation flow can be tested by sending a message through the chat interface while logged in, verifying that the JWT token is properly passed to the backend API and the response is returned for the authenticated user.

**Acceptance Scenarios**:

1. **Given** I am logged in with a valid JWT token, **When** I send a message through the chat interface, **Then** the message is sent to the backend with proper authentication headers and I receive an AI-generated response
2. **Given** I am not logged in or have an invalid token, **When** I attempt to send a message, **Then** I receive an appropriate error message prompting me to authenticate

---

### User Story 3 - Conversation Session Continuity (Priority: P2)

As a returning user, I want to resume my previous conversations when I return to the chat interface. The system should remember my conversation history and allow me to continue where I left off, maintaining context and continuity across sessions.

**Why this priority**: Session continuity enhances user experience by allowing seamless conversation resumption, making the AI assistant feel more personal and helpful over time.

**Independent Test**: Conversation continuity can be tested by starting a conversation, closing the chat interface, and then reopening it to verify that the conversation history is preserved and accessible.

**Acceptance Scenarios**:

1. **Given** I have an active conversation with a conversation_id, **When** I close and reopen the chat interface, **Then** I can see the previous conversation history and continue the conversation
2. **Given** I have multiple conversations, **When** I select a specific conversation, **Then** I can resume that specific conversation thread

---

### User Story 4 - Real-time AI Response and Tool Call Indicators (Priority: P2)

As a user, I want to see real-time responses from the AI assistant and clear indicators when the AI is performing actions (like creating or updating tasks). This transparency helps me understand what the AI is doing and builds trust in the system.

**Why this priority**: Transparency and feedback are crucial for user trust and understanding of the AI's actions, especially when it's performing automated tasks on their behalf.

**Independent Test**: The response and indicator system can be tested by sending commands that trigger AI tool calls (like creating a task) and verifying that appropriate status indicators are displayed during processing and that the results are communicated clearly.

**Acceptance Scenarios**:

1. **Given** I send a message that triggers an AI tool call, **When** the AI processes the request, **Then** I see clear indicators showing the tool call in progress (e.g., "Creating task: Buy groceries...")
2. **Given** the AI is processing a request, **When** the processing completes, **Then** I see the final result and confirmation of the action taken

---

### User Story 5 - Error Handling and Loading States (Priority: P3)

As a user, I want to see clear feedback when there are issues with the AI service or network connectivity. The system should display loading states during processing and appropriate error messages when the backend or AI agent is unreachable, ensuring I understand the current status.

**Why this priority**: Proper error handling improves user experience by providing clear feedback during failures, preventing confusion and frustration when services are temporarily unavailable.

**Independent Test**: Error handling can be tested by simulating network failures or backend unavailability and verifying that appropriate loading states and error messages are displayed to the user.

**Acceptance Scenarios**:

1. **Given** the AI service is processing my request, **When** the system is waiting for a response, **Then** I see a clear loading indicator
2. **Given** the backend service is unreachable, **When** I attempt to send a message, **Then** I receive a user-friendly error message explaining the issue

---

### Edge Cases

- What happens when the user closes the browser tab during an active AI processing task?
- How does the system handle network interruptions during conversation?
- What occurs when the JWT token expires mid-conversation?
- How does the system behave when the AI service returns unexpected or malformed responses?
- What happens if the user attempts to send multiple rapid-fire messages?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a floating chat bubble in the bottom-right corner of the screen that expands into a full chat interface when clicked
- **FR-002**: System MUST maintain the underlying dashboard visibility when the chat interface is expanded
- **FR-003**: System MUST authenticate all chat API requests using Better Auth JWT tokens passed in Authorization header
- **FR-004**: System MUST send user messages to the POST /api/{user_id}/chat endpoint with proper authentication
- **FR-005**: System MUST handle conversation_id logic to enable session continuity and resume previous conversations
- **FR-006**: System MUST display real-time AI text responses in the chat interface as they are received
- **FR-007**: System MUST show clear indicators when AI is executing tool calls (e.g., "Creating task: ...", "Updating task: ...")
- **FR-008**: System MUST display appropriate loading states during AI processing and API communication
- **FR-009**: System MUST show user-friendly error messages when backend services are unreachable
- **FR-010**: System MUST integrate with OpenAI ChatKit for the conversational interface component
- **FR-011**: System MUST pass NEXT_PUBLIC_OPENAI_DOMAIN_KEY for security and domain allowlisting configuration
- **FR-012**: System MUST ensure that all user data and conversations remain isolated by user account

### Key Entities

- **Conversation**: Represents a user's chat session with the AI assistant, containing metadata like conversation_id, timestamps, and user association
- **Message**: Represents individual exchanges between user and AI within a conversation, including content, timestamp, and role (user/assistant/tool_call)
- **User**: Represents the authenticated user account with associated JWT token for authentication and conversation isolation

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can access and expand the floating chat interface within 2 clicks and have it ready for input within 1 second
- **SC-002**: 95% of authenticated user messages successfully reach the backend API and return AI responses within 10 seconds
- **SC-003**: Users can resume previous conversations with their conversation history intact 99% of the time
- **SC-004**: 90% of users successfully complete primary AI-assisted tasks (like creating tasks via natural language) on first attempt
- **SC-005**: Error conditions are handled gracefully with appropriate user feedback 100% of the time, with no crashes or unhandled exceptions
- **SC-006**: The floating chat interface does not interfere with or negatively impact the performance of the underlying dashboard (less than 5% performance degradation)
