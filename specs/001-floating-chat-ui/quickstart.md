# Quickstart Guide: Floating Conversational UI Implementation

## Prerequisites

- Node.js 18+ installed
- Next.js 16+ project set up
- Better Auth configured in your application
- Access to the backend chat API endpoint
- NEXT_PUBLIC_OPENAI_DOMAIN_KEY for ChatKit security

## Installation

1. Install required dependencies:

```bash
npm install openai-chatkit better-auth
# Or if using yarn
yarn add openai-chatkit better-auth
```

2. Add environment variables to your `.env.local`:

```env
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your_domain_key_here
```

## Component Setup

### 1. Create the Floating Chat Widget

Create `components/chat/FloatingChatWidget.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { ChatTrigger } from './ChatTrigger';
import { ChatWindow } from './ChatWindow';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      <ChatTrigger onClick={() => setIsOpen(!isOpen)} />
    </>
  );
}
```

### 2. Add to Your Dashboard Page

In your `pages/dashboard/page.tsx` or appropriate layout:

```tsx
import { FloatingChatWidget } from '@/components/chat/FloatingChatWidget';

export default function DashboardPage() {
  return (
    <div className="relative">
      {/* Your existing dashboard content */}
      <FloatingChatWidget />
    </div>
  );
}
```

## API Integration

### Update your API client in `lib/api.ts`:

```typescript
import { getAuthToken } from '@/lib/auth';

export const chatAPI = {
  sendMessage: async (userId: string, message: string) => {
    const token = await getAuthToken();

    const response = await fetch(`/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Chat API error: ${response.status}`);
    }

    return response.json();
  },
};
```

## Authentication Setup

### Create `lib/auth.ts`:

```typescript
import { useAuth } from 'better-auth/react';

export async function getAuthToken() {
  // Implementation to get valid JWT token
  // This will depend on your Better Auth setup
  const session = await getSession(); // Using Better Auth's session management
  return session?.token;
}

export async function getSession() {
  // Implementation to retrieve current session
  // Replace with your Better Auth session retrieval logic
}
```

## Styling

The chat widget uses Tailwind CSS classes that should integrate with your existing theme. Override the default styles by customizing the components in `components/chat/`.

## Running the Application

1. Start your development server:

```bash
npm run dev
# or
yarn dev
```

2. Navigate to your dashboard page
3. You should see the floating chat widget in the bottom-right corner

## Testing the Integration

1. Click the floating chat button to expand the widget
2. Type a message and send it
3. Verify that the message is sent to the backend with proper authentication
4. Check that responses are displayed in the chat window
5. Close the chat window and verify the dashboard remains functional

## Troubleshooting

### Chat widget not appearing
- Verify the component is added to the correct page/layout
- Check that the page has sufficient height/width to display the fixed-position element

### Authentication errors
- Confirm that Better Auth is properly configured
- Verify JWT token is being retrieved and passed correctly
- Check that the backend API endpoint accepts the authentication format

### Styling conflicts
- Ensure z-index values are properly set (should be 9999 or higher)
- Verify Tailwind CSS is properly configured in your project