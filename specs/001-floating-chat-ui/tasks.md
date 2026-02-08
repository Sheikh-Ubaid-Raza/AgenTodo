# Tasks: Floating Conversational UI & API Integration

**Feature**: Floating Conversational UI & API Integration
**Branch**: 001-floating-chat-ui
**Generated**: 2026-02-05
**Input**: spec.md, plan.md, contracts/

## Implementation Strategy

MVP scope: Implement User Story 1 (Floating Chat Interface) and User Story 2 (Authenticated AI Conversation) with minimal viable functionality. This will include the basic floating widget with chat bubble, expandable chat window, and authenticated communication with the backend API. Subsequent user stories will build upon this foundation.

## Dependencies

User stories can be implemented in parallel after foundational tasks are complete:
- User Story 1 (Floating Chat Interface) and User Story 2 (Authenticated AI Conversation) can be developed simultaneously as they share core components
- User Story 3 (Conversation Session Continuity) depends on User Story 1 and 2 for the base UI and API infrastructure
- User Story 4 (Real-time AI Response and Tool Call Indicators) depends on User Story 2 for the API communication layer
- User Story 5 (Error Handling and Loading States) can be implemented alongside other stories for comprehensive error handling

## Parallel Execution Examples

Each user story can be developed in parallel after foundational tasks:
- US1 team: Focus on floating chat widget components (trigger, window, message display)
- US2 team: Focus on API integration and authentication handling
- US3 team: Focus on conversation ID management and history persistence
- US4 team: Focus on tool call indicators and real-time feedback
- US5 team: Focus on error handling and loading states

---

## Phase 1: Setup

- [X] T001 Create frontend directory structure per implementation plan
- [X] T002 Install dependencies: openai-chatkit, better-auth
- [X] T003 Add NEXT_PUBLIC_OPENAI_DOMAIN_KEY to environment variables
- [X] T004 Set up component directory structure at frontend/components/chat/

## Phase 2: Foundational

- [X] T005 Create useChat hook in frontend/hooks/useChat.ts for state management
- [X] T006 Define ChatState interface with all required properties
- [X] T007 Create API client wrapper in frontend/lib/api.ts for chat endpoint
- [X] T008 Implement JWT token retrieval from Better Auth session
- [X] T009 Create chat utilities in frontend/lib/chat.ts

## Phase 3: [US1] Floating Chat Interface

**Goal**: Display a floating chat bubble in the bottom-right corner that expands into a full chat interface when clicked, while keeping the underlying dashboard visible.

**Independent Test**: The floating chat widget can be tested by clicking the chat bubble in the bottom-right corner and verifying that it expands into a full chat window without affecting the underlying dashboard. The widget should be accessible and usable without interfering with the main application.

- [X] T010 [P] [US1] Create ChatTrigger component in frontend/components/chat/ChatTrigger.tsx
- [X] T011 [P] [US1] Implement fixed positioning and styling for trigger button
- [X] T012 [P] [US1] Add animation for hover and active states
- [X] T013 [US1] Create ChatWindow component in frontend/components/chat/ChatWindow.tsx
- [X] T014 [US1] Implement expand/collapse functionality
- [X] T015 [US1] Add z-index management with value 9999
- [X] T016 [US1] Create FloatingChatWidget component in frontend/components/chat/FloatingChatWidget.tsx
- [X] T017 [US1] Implement state management for open/closed state
- [X] T018 [US1] Integrate trigger and window components
- [X] T019 [US1] Add responsive design for mobile and desktop views
- [X] T020 [US1] Implement overlay behavior to prevent background interaction
- [ ] T021 [US1] Test widget expansion/collapse functionality across different screen sizes

## Phase 4: [US2] Authenticated AI Conversation

**Goal**: Enable authenticated communication between the chat interface and the backend API using Better Auth JWT tokens.

**Independent Test**: The authenticated conversation flow can be tested by sending a message through the chat interface while logged in, verifying that the JWT token is properly passed to the backend API and the response is returned for the authenticated user.

- [X] T022 [P] [US2] Enhance chatAPI with sendMessage function in frontend/lib/api.ts
- [X] T023 [P] [US2] Implement JWT header handling in API client
- [X] T024 [US2] Create MessageInput component in frontend/components/chat/MessageInput.tsx
- [X] T025 [US2] Implement message sending functionality with authentication
- [X] T026 [US2] Add MessageList component in frontend/components/chat/MessageList.tsx
- [X] T027 [US2] Integrate API client with chat components
- [X] T028 [US2] Implement token refresh mechanism before API calls
- [X] T029 [US2] Handle 401 responses for invalid/expired tokens
- [X] T030 [US2] Validate user isolation between different sessions
- [ ] T031 [US2] Test authenticated message sending and response handling

## Phase 5: [US3] Conversation Session Continuity

**Goal**: Implement conversation_id logic to enable users to resume previous conversations and maintain session continuity across visits.

**Independent Test**: Conversation continuity can be tested by starting a conversation, closing the chat interface, and then reopening it to verify that the conversation history is preserved and accessible.

- [X] T032 [P] [US3] Enhance useChat hook with conversation_id management
- [X] T033 [P] [US3] Implement conversation history state in useChat hook
- [X] T034 [US3] Add conversation_id to sendMessage API calls
- [X] T035 [US3] Implement persistence for conversation_id in localStorage
- [X] T036 [US3] Add functionality to resume previous conversations
- [X] T037 [US3] Create conversation selection interface
- [X] T038 [US3] Handle multiple conversation threads
- [ ] T039 [US3] Test conversation history preservation and resumption

## Phase 6: [US4] Real-time AI Response and Tool Call Indicators

**Goal**: Display real-time AI responses and clear indicators when the AI is executing tool calls, providing transparency to the user about AI actions.

**Independent Test**: The response and indicator system can be tested by sending commands that trigger AI tool calls (like creating a task) and verifying that appropriate status indicators are displayed during processing and that the results are communicated clearly.

- [X] T040 [P] [US4] Enhance useChat hook with tool execution state management
- [X] T041 [P] [US4] Implement tool call status indicators in ChatWindow
- [X] T042 [US4] Add visual indicators for tool call execution (e.g., "Creating task: ...")
- [X] T043 [US4] Display real-time AI text responses as they are received
- [X] T044 [US4] Show loading indicators during AI processing
- [X] T045 [US4] Implement status updates for tool call progression (pending → executing → completed)
- [X] T046 [US4] Add success/failure indicators for completed tool calls
- [ ] T047 [US4] Test tool call indicators and real-time response display

## Phase 7: [US5] Error Handling and Loading States

**Goal**: Implement comprehensive error handling and loading states to provide clear feedback when there are issues with the AI service or network connectivity.

**Independent Test**: Error handling can be tested by simulating network failures or backend unavailability and verifying that appropriate loading states and error messages are displayed to the user.

- [X] T048 [P] [US5] Add error state management to useChat hook
- [X] T049 [P] [US5] Implement loading states for API communication
- [X] T050 [US5] Create error display components for different error types
- [X] T051 [US5] Handle 400 Bad Request responses with user-friendly messages
- [X] T052 [US5] Handle 403 Forbidden responses appropriately
- [X] T053 [US5] Implement rate limit handling for 429 responses
- [X] T054 [US5] Add retry logic for 5xx server errors
- [ ] T055 [US5] Test error handling for various failure scenarios

## Phase 8: Polish & Cross-Cutting Concerns

- [X] T056 Add proper TypeScript typing throughout all components
- [X] T057 Implement proper error boundaries for ChatKit components
- [X] T058 Add accessibility features (ARIA labels, keyboard navigation)
- [X] T059 Customize ChatKit theming to match existing Tailwind CSS design
- [X] T060 Add performance optimizations (memoization, virtual scrolling)
- [X] T061 Implement proper cleanup for useEffect hooks
- [X] T062 Add input sanitization for chat messages
- [ ] T063 Add comprehensive error logging for debugging
- [ ] T064 Test complete end-to-end flow: send natural language command and verify task appears in dashboard
- [ ] T065 Add unit tests for custom hooks and utility functions