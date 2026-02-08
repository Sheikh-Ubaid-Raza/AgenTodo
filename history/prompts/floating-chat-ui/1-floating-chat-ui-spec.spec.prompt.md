---
id: 1
title: "Floating Chat UI Spec"
stage: spec
date_iso: 2026-02-05
surface: agent
model: claude-sonnet-4-5-20250929
feature: floating-chat-ui
branch: 001-floating-chat-ui
user: user
command: "/sp.specify Phase 3 Part 2: Floating Conversational UI & API Integration

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
labels: ["spec", "floating-chat-ui", "frontend", "chatkit", "integration"]
links:
  spec: "specs/001-floating-chat-ui/spec.md"
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-floating-chat-ui/spec.md
  - specs/001-floating-chat-ui/checklists/requirements.md
tests:
  - "Specification quality checklist validated"
  - "User scenarios and acceptance criteria defined"
  - "Functional requirements testable and measurable"
---

## Prompt

Phase 3 Part 2: Floating Conversational UI & API Integration

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
- [cite_start]Implementation of voice commands or multi-language support (Bonus features). [cite: 60]

## Response snapshot

Successfully created the feature specification for Floating Conversational UI & API Integration.

Created artifacts:
- Feature specification (spec.md): Complete specification with user scenarios, functional requirements, key entities, and success criteria
- Quality checklist (checklists/requirements.md): Validation checklist to ensure specification completeness

The specification addresses all requirements:
- Floating chat widget in bottom-right corner with expand/collapse functionality
- Authenticated API connection using Better Auth JWT tokens
- Session continuity with conversation_id logic for resuming conversations
- Real-time AI response display with tool call indicators
- Error handling with loading states and user-friendly messages
- Integration with OpenAI ChatKit component
- Security considerations with NEXT_PUBLIC_OPENAI_DOMAIN_KEY

User stories prioritized with P1 (core functionality), P2 (enhanced experience), and P3 (error handling) priorities.
Functional requirements defined with specific, testable capabilities (FR-001 through FR-012).
Success criteria established with measurable outcomes (SC-001 through SC-006) that are technology-agnostic.

## Outcome

- ✅ Impact: Complete specification created for floating chat UI integration with OpenAI ChatKit
- 🧪 Tests: Specification quality validated with checklist and testable requirements
- 📁 Files: Created spec.md and requirements checklist in feature directory
- 🔁 Next prompts: Ready for planning phase (/sp.plan)
- 🧠 Reflection: Specification follows SDD hierarchy and captures all user requirements

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS - All validation criteria met
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase