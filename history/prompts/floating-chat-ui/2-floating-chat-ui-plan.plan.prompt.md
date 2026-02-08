---
id: 2
title: "Floating Chat UI Plan"
stage: plan
date_iso: 2026-02-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: floating-chat-ui
branch: 001-floating-chat-ui
user: user
command: "/sp.plan

Create:
- **UI Component Architecture**: Sketch the floating chat widget structure (Trigger Button, Chat Window, and Message List) using OpenAI ChatKit.
- **API Integration Layer**: Update the frontend API client (`/lib/api.ts`) to include a wrapper for `POST /api/{user_id}/chat` that automatically handles Better Auth JWT headers.
- **State Management Plan**: Logic for managing `conversation_id`, loading states, and displaying real-time tool execution feedback.

Decisions needing documentation:
- **Z-Index & Positioning**: Strategy to ensure the floating widget stays on top of all Phase 2 dashboard elements without blocking core functionality.
- **Token Handling**: Ensuring JWT tokens are refreshed or correctly passed from the Better Auth session to the AI Agent endpoint.
- **ChatKit Theming**: Alignment of ChatKit components with the existing Tailwind CSS design system of the Todo app.

Testing strategy:
- **UI Validation**: Verify the widget expands/collapses correctly on mobile and desktop views.
- **Auth Verification**: Confirm that the chat fails with 401 Unauthorized if the Better Auth session is invalid.
- **End-to-End Flow**: Send a natural language command (e.g., "Add milk to my list") and verify the task appears in the Phase 2 Task List.

Technical details:
- **STRICT REQUIREMENT**: Implementations MUST use relevant sub-agents in the `.claude/` directory and existing project skills.
- **DOCUMENTATION RETRIEVAL**: Use the `context7-documentation-retrieval` skill to fetch the latest 2026 implementation patterns for 'OpenAI ChatKit' and 'Better Auth client integration'.
- **Workflow**: Follow the Spec-Driven Development hierarchy: Constitution > Specify > Plan > Tasks.
- **Phases**: Research (latest SDKs) → UI Foundation (Widget) → API Bridge → Testing & Refinement."
labels: ["planning", "floating-chat-ui", "frontend", "chatkit", "integration"]
links:
  spec: "specs/001-floating-chat-ui/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-floating-chat-ui/plan.md
  - specs/001-floating-chat-ui/research.md
  - specs/001-floating-chat-ui/quickstart.md
  - specs/001-floating-chat-ui/contracts/chat-api-contract.md
tests:
  - "Implementation plan created with architecture overview"
  - "Component structure and project organization defined"
  - "API contract specified for frontend-backend communication"
  - "Research and quickstart guides created for developers"
---

## Prompt

Create:
- **UI Component Architecture**: Sketch the floating chat widget structure (Trigger Button, Chat Window, and Message List) using OpenAI ChatKit.
- **API Integration Layer**: Update the frontend API client (`/lib/api.ts`) to include a wrapper for `POST /api/{user_id}/chat` that automatically handles Better Auth JWT headers.
- **State Management Plan**: Logic for managing `conversation_id`, loading states, and displaying real-time tool execution feedback.

Decisions needing documentation:
- **Z-Index & Positioning**: Strategy to ensure the floating widget stays on top of all Phase 2 dashboard elements without blocking core functionality.
- **Token Handling**: Ensuring JWT tokens are refreshed or correctly passed from the Better Auth session to the AI Agent endpoint.
- **ChatKit Theming**: Alignment of ChatKit components with the existing Tailwind CSS design system of the Todo app.

Testing strategy:
- **UI Validation**: Verify the widget expands/collapses correctly on mobile and desktop views.
- **Auth Verification**: Confirm that the chat fails with 401 Unauthorized if the Better Auth session is invalid.
- **End-to-End Flow**: Send a natural language command (e.g., "Add milk to my list") and verify the task appears in the Phase 2 Task List.

Technical details:
- **STRICT REQUIREMENT**: Implementations MUST use relevant sub-agents in the `.claude/` directory and existing project skills.
- **DOCUMENTATION RETRIEVAL**: Use the `context7-documentation-retrieval` skill to fetch the latest 2026 implementation patterns for 'OpenAI ChatKit' and 'Better Auth client integration'.
- **Workflow**: Follow the Spec-Driven Development hierarchy: Constitution > Specify > Plan > Tasks.
- **Phases**: Research (latest SDKs) → UI Foundation (Widget) → API Bridge → Testing & Refinement.

## Response snapshot

Successfully created the implementation plan for Floating Conversational UI & API Integration.

Created artifacts:
- Implementation plan (plan.md): Complete technical architecture overview with component structure, project organization, and implementation phases
- Research document (research.md): Detailed notes on OpenAI ChatKit integration, Better Auth client patterns, and best practices
- Quickstart guide (quickstart.md): Step-by-step setup instructions for developers to implement the floating chat widget
- API contract (contracts/chat-api-contract.md): Detailed interface specification for frontend-backend communication

The plan addresses all requirements:
- UI Component Architecture with floating chat widget structure using OpenAI ChatKit
- API Integration Layer with automatic Better Auth JWT header handling
- State Management Plan for conversation_id, loading states, and tool execution feedback
- Z-Index & Positioning strategy to ensure proper layering
- Token Handling approach for JWT authentication
- ChatKit Theming alignment with existing Tailwind CSS
- Testing strategies for UI, auth, and end-to-end flows

## Outcome

- ✅ Impact: Complete implementation plan created for floating chat UI with OpenAI ChatKit
- 🧪 Tests: API contract defined and testing strategies outlined
- 📁 Files: Created plan.md, research.md, quickstart.md, and API contract
- 🔁 Next prompts: Ready for task generation phase (/sp.tasks)
- 🧠 Reflection: Plan follows SDD hierarchy and addresses all architectural decisions

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All planning requirements met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task generation phase