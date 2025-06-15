# Ask Dr. Scott Interactive Avatar

This component provides an interactive avatar interface for the "Ask Dr. Scott" feature using the HeyGen API for streaming avatar video.

## Overview

The Ask Dr. Scott feature allows users to interact with an AI avatar of Dr. Scott I-Patrick, the platform's educational psychology expert. Users can ask questions and receive immediate responses based on Dr. Scott's expertise.

## Components

### AskDrScottAvatar

The main component that renders the interactive avatar interface. It includes:

- Video player for the avatar
- Chat interface for sending and receiving messages
- Message history display

## API Integration

The component integrates with the HeyGen API through several API routes:

- `/api/heygen/streaming/new` - Creates a new streaming session
- `/api/heygen/streaming/[sessionId]` - Gets session information and streams video
- `/api/heygen/streaming/[sessionId]/message` - Sends a message to the avatar
- `/api/heygen/streaming/[sessionId]/close` - Closes the streaming session

## Usage

```tsx
import { AskDrScottAvatar } from '@/components/ask-dr-scott';

// Basic usage with default avatar ID
<AskDrScottAvatar />

// With custom props
<AskDrScottAvatar 
  avatarId="e12f05f24ead42619b4aa8124d98880d"
  initialMessage="Hello, I'm Dr. Scott. How can I help you today?"
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `avatarId` | string | "e12f05f24ead42619b4aa8124d98880d" | The HeyGen avatar ID to use |
| `initialMessage` | string | "Hello, I'm Dr. Scott I-Patrick. How can I help you today?" | The initial message from the avatar |
| `className` | string | "" | Additional CSS classes to apply to the component |

## Environment Variables

The component requires the following environment variables:

- `NEXT_PUBLIC_HEYGEN_API_KEY` - Your HeyGen API key

## Implementation Details

1. When the component mounts, it initializes a new streaming session with the HeyGen API
2. The avatar video is displayed using the AIAvatarVideoPlayer component
3. Users can type messages and send them to the avatar
4. The avatar responds with text and synchronized video/audio
5. The session is automatically closed when the component unmounts

## Error Handling

The component includes comprehensive error handling for:
- Failed session initialization
- Message sending failures
- Network issues
- API errors

## Future Enhancements

Planned enhancements for this feature include:
- Voice input support using the Web Speech API
- Session persistence between page navigations
- Enhanced avatar animations and expressions
- Integration with the platform's knowledge base for more accurate responses