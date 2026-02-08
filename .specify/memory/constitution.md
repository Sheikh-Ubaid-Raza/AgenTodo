<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.1.0
- Modified principles: [PRINCIPLE_1_NAME] → Spec-Driven Development (SDD), [PRINCIPLE_2_NAME] → Phase-Aware Evolution, [PRINCIPLE_3_NAME] → Type Safety, [PRINCIPLE_4_NAME] → Security-First
- Added sections: Core Principles (6 total), Key Standards, Constraints, Success Criteria
- Removed sections: None
- Templates requiring updates: ✅ updated / ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

# Evolution of Todo (Multi-Phase Agentic Development) Constitution

## Core Principles

### Spec-Driven Development (SDD)
No manual coding; all implementations must be generated via Claude Code from refined specs.
<!-- Example: Every feature starts as a standalone library; Libraries must be self-contained, independently testable, documented; Clear purpose required - no organizational-only libraries -->

### Phase-Aware Evolution
Code must be modular to support easy transitions from FastAPI/SQLModel (Phase II) to MCP/Agents SDK (Phase III) and Kubernetes (Phase IV/V).
<!-- Example: Every library exposes functionality via CLI; Text in/out protocol: stdin/args → stdout, errors → stderr; Support JSON + human-readable formats -->

### Type Safety
End-to-end type safety between Next.js frontend and Python backend.
<!-- Example: TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced -->

### Security-First
Implementation of JWT-based authentication and strict user-data isolation.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

### Agentic Workflow
Use of Spec-Kit Plus for every feature implementation.
<!-- Example: Text I/O ensures debuggability; Structured logging required; Or: MAJOR.MINOR.BUILD format; Or: Start simple, YAGNI principles -->

### Clean Architecture
Separation of concerns between API routes, database models, and frontend components.
<!-- Example: Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas -->

## Key Standards
- Tech Stack Adherence: Next.js 16+ (App Router), FastAPI, SQLModel, and Neon PostgreSQL.
- Agentic Workflow: Use of Spec-Kit Plus for every feature implementation.
- Clean Architecture: Separation of concerns between API routes, database models, and frontend components.
- Documentation: Every file must have clear docstrings/comments explaining its role in the current phase.

## Constraints
- No Manual Overrides: AI must fix bugs by refining the spec/plan, not by manual user edits.
- Environment Management: Use of `.env` for shared secrets like BETTER_AUTH_SECRET.
- Resource Optimization: Minimize context bloat by keeping sub-agents and skills lean and relevant to the current phase.

## Success Criteria
- Functional Parity: All 5 Basic Level features (CRUD + Toggle) working seamlessly.
- Secure Isolation: Users can only access their own data via verified JWT tokens.
- Deployment Ready: Code structure must support Dockerization and Helm charting for future phases.
- Zero Technical Debt: All generated code must pass linting and type-checking without errors.

## Governance
All implementations must comply with the core principles outlined above. Amendments require explicit documentation and approval. The constitution supersedes all other practices and guides all development decisions throughout the project lifecycle.

**Version**: 1.1.0 | **Ratified**: 2026-02-04 | **Last Amended**: 2026-02-04
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
