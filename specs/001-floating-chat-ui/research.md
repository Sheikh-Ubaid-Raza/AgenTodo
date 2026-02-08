# Research & Implementation Notes: Floating Conversational UI

## OpenAI ChatKit Integration

### Key Components
- `<ChatKitProvider>`: Main provider component for ChatKit context
- `<Chat>`: Main chat interface component
- `<MessageList>`: Component for displaying conversation history
- `<Composer>`: Input area component for user messages
- `<SendButton>`: Component for sending messages

### Theming Capabilities
- CSS variables for color customization
- Class name overrides for advanced styling
- Compatibility with Tailwind CSS via className props

### Best Practices
- Lazy loading components for performance
- Proper error boundary implementation
- Accessibility compliance (ARIA labels, keyboard navigation)

## Better Auth Client Integration

### Session Management
- `useAuth()` hook for real-time session updates
- Automatic token refresh mechanisms
- Secure token storage using HttpOnly cookies (server-side) or secure localStorage (client-side)

### Token Retrieval for API Calls
- `authClient.getSession()` to get current session
- Proper error handling for expired/invalid sessions
- Redirect mechanisms for unauthorized access

## Z-Index Strategy

### Recommended Values
- Base: 1 (default)
- Dropdowns/Menus: 1000
- Overlays: 1020
- Modals: 1040
- Floating Actions: 1050
- Toasts/Notifications: 1060
- Our Chat Widget: 9999 (highest priority)

### Positioning Approach
- `position: fixed` for absolute positioning relative to viewport
- Responsive units (vw, vh) for mobile compatibility
- Safe area insets for mobile devices with notches

## State Management Patterns

### React Hooks Approach
- Custom hooks for encapsulated logic
- useState/useReducer for local component state
- Context API for cross-component state sharing
- Memoization with useMemo/useCallback for performance

### Conversation State
- Unique conversation IDs for session continuity
- Message history pagination for large conversations
- Offline support with local storage fallback

## Security Considerations

### JWT Token Handling
- Short-lived access tokens with refresh tokens
- Secure transmission via HTTPS only
- Proper token storage (avoiding XSS vulnerabilities)
- Token validation on both client and server

### API Rate Limiting
- Client-side throttling to prevent excessive requests
- Server-side rate limiting for API protection
- Graceful degradation during high load

## Performance Optimization

### Bundle Size
- Tree-shaking for unused imports
- Dynamic imports for heavy components
- Code splitting for faster initial load

### Rendering Efficiency
- Virtual scrolling for long message lists
- Memoization of expensive computations
- Debounced API calls to prevent spam