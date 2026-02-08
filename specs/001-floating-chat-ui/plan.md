# Implementation Plan: Floating Conversational UI & API Integration

**Feature**: Floating Conversational UI & API Integration
**Branch**: 001-floating-chat-ui
**Date**: 2026-02-05
**Author**: AI Assistant

## Technical Context

This plan outlines the implementation of a floating conversational UI that integrates OpenAI ChatKit with the existing Todo app dashboard. The solution will provide a seamless chat experience that overlays the existing dashboard while maintaining full functionality of the underlying application.

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           Browser/Client                │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │     Existing Todo Dashboard     │    │
│  │                                 │    │
│  │  ┌─────────────────────────┐    │    │
│  │  │   Floating Chat Widget  │    │    │
│  │  │                         │    │    │
│  │  │  ┌───────────────────┐  │    │    │
│  │  │  │   Chat Window     │  │    │    │
│  │  │  │                   │  │    │    │
│  │  │  │  Message List     │  │    │    │
│  │  │  │  Input Area       │  │    │    │
│  │  │  │  Tool Indicators  │  │    │    │
│  │  │  └───────────────────┘  │    │    │
│  │  └─────────────────────────┘    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Component Structure

The floating chat widget consists of three main components:

1. **Trigger Button**: Fixed position button in bottom-right corner
2. **Chat Container**: Overlay container that manages open/closed state
3. **Chat Window**: Full chat interface with message history and input

## Project Structure

```
frontend/
├── components/
│   ├── chat/
│   │   ├── FloatingChatWidget.tsx     # Main widget component
│   │   ├── ChatTrigger.tsx            # Trigger button component
│   │   ├── ChatWindow.tsx             # Chat interface component
│   │   ├── MessageList.tsx            # Message display component
│   │   └── MessageInput.tsx           # Input area component
│   └── ui/
│       └── [shared components]
├── lib/
│   ├── api.ts                         # API client with auth wrapper
│   ├── auth.ts                        # Better Auth integration
│   └── chat.ts                        # Chat-specific utilities
├── hooks/
│   ├── useChat.ts                     # Chat state management
│   └── useAuth.ts                     # Authentication state
└── pages/
    └── dashboard/
        └── page.tsx                   # Main dashboard page
```

## Implementation Details

### 1. UI Component Architecture

#### FloatingChatWidget.tsx
- State management for open/closed state
- Positioning logic with z-index management
- Theme integration with existing Tailwind CSS

#### ChatTrigger.tsx
- Fixed positioning in bottom-right corner
- Animation for hover and active states
- Badge notification for unread messages

#### ChatWindow.tsx
- Expandable/collapsible chat interface
- Integration with OpenAI ChatKit components
- Loading states and tool call indicators

### 2. API Integration Layer

#### lib/api.ts - Enhanced with Chat API

```typescript
// Wrapper for chat endpoint with automatic JWT handling
export const chatAPI = {
  sendMessage: async (userId: string, message: string) => {
    const token = await getValidToken();
    return fetch(`/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
  }
};
```

### 3. State Management Plan

#### hooks/useChat.ts
- Conversation ID management
- Message history state
- Loading and error states
- Tool call execution indicators

#### State Structure
```typescript
interface ChatState {
  isOpen: boolean;
  conversationId?: string;
  messages: Message[];
  isLoading: boolean;
  toolExecution: {
    isActive: boolean;
    toolName: string;
    status: string;
  };
  error?: string;
}
```

## Key Implementation Decisions

### Z-Index & Positioning Strategy
- Use z-index of 9999 to ensure the chat widget stays above all dashboard elements
- Implement modal overlay when chat is open to prevent interaction with background
- Responsive design for mobile and desktop views
- Position fixed with bottom-4 and right-4 Tailwind classes

### Token Handling Strategy
- Leverage Better Auth's useAuth hook to get current session
- Implement token refresh mechanism before each API call
- Handle 401 responses by redirecting to login or refreshing session
- Store conversation context separately from authentication state

### ChatKit Theming Approach
- Customize ChatKit components to match existing Tailwind CSS design
- Extract color palette from existing theme
- Ensure accessibility compliance with contrast ratios
- Maintain consistent typography with existing application

## Frontend Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with existing theme
- **UI Components**: OpenAI ChatKit, shadcn/ui components
- **Authentication**: Better Auth client SDK
- **State Management**: React hooks, Zustand (if needed)

## Performance Goals

- Chat widget opens in < 200ms
- Message responses display in < 1 second (network dependent)
- Minimal impact on dashboard performance (< 5% degradation)
- Efficient memory management for conversation history

## Security Considerations

- JWT tokens passed securely in Authorization header
- Client-side token storage using Better Auth's secure mechanisms
- Input sanitization for chat messages
- Rate limiting on client-side to prevent abuse

## Testing Strategy

### UI Validation
- Widget expansion/collapse functionality on mobile and desktop
- Positioning accuracy across different screen sizes
- Animation smoothness and responsiveness
- Overlay behavior and z-index correctness

### Authentication Verification
- Verify 401 responses when JWT token is invalid/expired
- Confirm proper token passing to backend
- Test token refresh mechanisms
- Validate user isolation between different sessions

### End-to-End Flow
- Send natural language command (e.g., "Add milk to my list")
- Verify AI response processing
- Confirm task creation in Phase 2 Task List
- Test conversation continuity with conversation_id

## Integration Points

### With Existing Dashboard
- Minimal changes to existing dashboard components
- Non-blocking overlay approach
- Consistent styling with existing theme
- Shared authentication state

### With Backend API
- POST /api/{user_id}/chat endpoint integration
- JWT authentication handling
- Conversation ID management
- Error response handling

## Development Phases

### Phase 1: UI Foundation
- Create floating trigger button
- Implement expandable chat window
- Basic styling and animations
- Positioning and z-index management

### Phase 2: API Bridge
- Integrate with existing API client
- Implement JWT token handling
- Connect to chat endpoint
- Error handling implementation

### Phase 3: State Management
- Conversation ID persistence
- Loading and tool call indicators
- Message history management
- Real-time updates

### Phase 4: Testing & Refinement
- Comprehensive UI testing
- Authentication flow validation
- End-to-end scenario testing
- Performance optimization

## Dependencies & Setup

### New Dependencies
- openai-chatkit (for ChatKit components)
- better-auth (for authentication integration)
- Additional devDependencies for testing

### Environment Variables
- NEXT_PUBLIC_OPENAI_DOMAIN_KEY (for ChatKit security)

## Risks & Mitigation

### Potential Risks
- Performance impact on existing dashboard
- Authentication token expiration during conversations
- Mobile responsiveness issues
- Conflicts with existing UI components

### Mitigation Strategies
- Implement lazy loading for chat components
- Add token refresh logic before each API call
- Thorough responsive design testing
- Z-index audit to prevent conflicts

## Success Metrics

- Chat widget loads and opens within 200ms
- 95% success rate for authenticated API calls
- 99% uptime for chat functionality
- User satisfaction score > 4.0/5.0 for chat experience