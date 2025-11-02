# CLAUDE.md

This file provides guidance to Claude Code when working with this Next.js 16 frontend project.

## Project Overview

Korean Travel Guide Frontend - Next.js 16 App Router application with TypeScript, Tailwind CSS v4, and shadcn/ui for connecting tourists with AI chatbot and local guides in Korea.

**Architecture**: App Router with Server Components (RSC)
**Tech Stack**: Next.js 16.0.1, React 19.2.0, TypeScript 5, Tailwind CSS v4, shadcn/ui

## Essential Commands

### Development
```bash
# Start dev server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

### shadcn/ui Components
```bash
# Add new component
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog

# List available components
npx shadcn@latest add
```

## CRITICAL: API Implementation Rules

### ⚠️ MANDATORY: Follow FRONTEND_API.md Exactly

**RULE #1**: ALL API implementations MUST match `FRONTEND_API.md` specification exactly.

**Before implementing ANY API feature**:
1. ✅ Read the corresponding section in `FRONTEND_API.md`
2. ✅ Copy the exact endpoint, headers, request/response format
3. ✅ Do NOT guess or assume API behavior
4. ✅ Do NOT deviate from documented response structure

**Example - User Profile API**:
```typescript
// ❌ WRONG: Guessing the response structure
const { data } = await api.get('/api/user/profile')

// ✅ CORRECT: Following FRONTEND_API.md Section 2.1
const { data } = await api.get('/api/users/me')
// Response matches documentation:
// {
//   "msg": "내 정보를 성공적으로 조회했습니다.",
//   "data": {
//     "id": 1,
//     "email": "user@gmail.com",
//     "nickname": "홍길동",
//     "profileImageUrl": "https://...",
//     "role": "GUEST" | "GUIDE" | "ADMIN" | "PENDING"
//   }
// }
```

**All responses follow `ApiResponse<T>` wrapper**:
```typescript
interface ApiResponse<T> {
  msg: string
  data: T
}
```

**API Documentation Sections**:
- Section 1: Auth (OAuth, role selection, token refresh)
- Section 2: User (profile CRUD)
- Section 3: AI Chat (sessions, messages)
- Section 4: User Chat REST API (rooms, messages)
- Section 5: User Chat WebSocket (STOMP)
- Section 6: Rate (ratings for guides and AI sessions)

**If API behavior is unclear**: Stop and ask the user. Do NOT implement based on assumptions.

---

## Tech Stack & Best Practices (2025)

### State Management
- **Zustand**: Global client state (user info, UI state)
- **TanStack Query v5**: Server state (API data, caching, auto-refetch)
- **nuqs**: URL query params (search, filters, pagination)
- **React Hook Form + Zod**: Form state + validation

**Rule**: Use TanStack Query for ALL server data. Don't use useState for API responses.

### Form Handling
```typescript
// ALWAYS use React Hook Form + Zod for forms
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

### API Client (Axios)
- All API calls via `lib/api.ts`
- JWT auto-refresh via interceptors
- Base URL: `http://localhost:8080` (dev) / `https://api.team11.giwon11292.com` (prod)

### WebSocket (STOMP)
- Use `@stomp/stompjs` + `sockjs-client`
- Connect to `/ws/userchat` endpoint
- JWT in STOMP headers

## Next.js 16 Specific Rules

### App Router Patterns
```typescript
// ✅ GOOD: Server Component (default)
export default async function Page() {
  const data = await fetch(...)
  return <div>{data}</div>
}

// ✅ GOOD: Client Component (when needed)
'use client'
export default function ClientComponent() {
  const [state, setState] = useState(...)
  return <button onClick={...}>Click</button>
}

// ❌ BAD: Don't use 'use client' unless necessary
```

### File Structure Conventions
```
app/
├── (auth)/              # Route groups (no URL segment)
│   ├── login/
│   └── signup/
├── (main)/
│   ├── layout.tsx       # Shared layout
│   ├── page.tsx         # Home
│   ├── chat/
│   └── guides/
├── api/                 # API routes (if needed)
├── layout.tsx           # Root layout
└── globals.css

components/
├── ui/                  # shadcn/ui components
├── chat/                # Chat feature components
├── auth/                # Auth feature components
└── shared/              # Shared components

lib/
├── api.ts               # Axios instance
├── query-client.ts      # TanStack Query setup
├── websocket.ts         # WebSocket client
└── utils.ts             # shadcn/ui utils (cn)

hooks/
├── use-auth.ts          # Auth hooks
├── use-chat.ts          # Chat hooks
└── use-websocket.ts     # WebSocket hooks

stores/
└── use-user-store.ts    # Zustand stores
```

### Server vs Client Components

**Use Server Components (default) for**:
- Static content
- Data fetching
- SEO-critical pages
- Layout structure

**Use Client Components (`'use client'`) for**:
- Interactive elements (onClick, onChange)
- useState, useEffect, useContext
- Browser APIs (localStorage, window)
- Third-party libraries requiring browser APIs

### Loading & Error States
```typescript
// loading.tsx - automatic loading UI
export default function Loading() {
  return <Skeleton />
}

// error.tsx - automatic error boundary
'use client'
export default function Error({ error, reset }) {
  return <ErrorComponent error={error} retry={reset} />
}
```

## Tailwind CSS v4 Rules

### Configuration
- Use `@theme` in `globals.css` for theme customization
- No more `tailwind.config.js` needed (unless custom plugins)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3b82f6;
  --font-display: "Inter", sans-serif;
}
```

### Best Practices
- Use `cn()` from `lib/utils.ts` for conditional classes
- Prefer Tailwind utilities over custom CSS
- Use shadcn/ui CSS variables for theming

## shadcn/ui Integration

### Style: New York
- Configured in `components.json`
- Uses `cn()` utility for class merging
- CSS variables for theming in `globals.css`

### Adding Components
```bash
npx shadcn@latest add button card dialog form input
```

### Component Usage
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <Card>
      <Button variant="default">Click me</Button>
    </Card>
  )
}
```

## API Integration

### Backend API Base URL
- Dev: `http://localhost:8080`
- Prod: `https://api.team11.giwon11292.com`

### API Documentation
See `FRONTEND_API.md` for complete endpoint reference.

### Authentication Flow
1. OAuth redirect: `window.location.href = 'http://localhost:8080/oauth2/authorization/google'`
2. Backend redirects to `/signup/role?token={registerToken}` (new user) or `/oauth/callback` (existing)
3. Role selection: `POST /api/auth/role` with registerToken
4. Store accessToken in memory/state, refreshToken auto-set in HttpOnly cookie
5. Auto-refresh via Axios interceptor on 401

### TanStack Query Pattern
```typescript
// hooks/use-user.ts
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useUser() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/me')
      return data.data
    },
  })
}

// Usage in component
function Profile() {
  const { data: user, isLoading, error } = useUser()
  if (isLoading) return <Loading />
  if (error) return <Error />
  return <div>{user.nickname}</div>
}
```

### Mutation Pattern
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: UpdateProfileDto) => {
      const res = await api.patch('/api/users/me', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] })
    },
  })
}
```

## WebSocket Integration

### Connection Setup
```typescript
import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws/userchat'),
  connectHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
  onConnect: () => {
    client.subscribe('/topic/chat/1', (message) => {
      const data = JSON.parse(message.body)
      console.log(data)
    })
  },
})

client.activate()
```

### Message Publishing
```typescript
client.publish({
  destination: '/pub/userchat/1/messages',
  body: JSON.stringify({ content: 'Hello' }),
})
```

## Environment Variables

### Required `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws/userchat
```

**IMPORTANT**: Prefix with `NEXT_PUBLIC_` for client-side access

## TypeScript Best Practices

### Type Safety
```typescript
// ✅ GOOD: Define response types
interface UserResponse {
  id: number
  email: string
  nickname: string
  role: 'GUEST' | 'GUIDE' | 'ADMIN' | 'PENDING'
}

// ✅ GOOD: Use Zod for runtime validation + type inference
const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  nickname: z.string(),
  role: z.enum(['GUEST', 'GUIDE', 'ADMIN', 'PENDING']),
})

type User = z.infer<typeof userSchema>
```

### Avoid `any`
```typescript
// ❌ BAD
const data: any = await fetch(...)

// ✅ GOOD
const data: UserResponse = await fetch(...)
```

## Common Patterns

### Protected Routes
```typescript
// middleware.ts (or layout with redirect)
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('accessToken')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/chat/:path*', '/profile/:path*'],
}
```

### Toast Notifications
```typescript
import { toast } from "sonner"

toast.success("Profile updated!")
toast.error("Failed to update profile")
```

### Date Formatting
```typescript
import { format } from "date-fns"

const formatted = format(new Date(apiDate), 'PPpp') // Asia/Seoul aware
```

## Performance Optimization

### Image Optimization
```typescript
import Image from "next/image"

<Image
  src="/profile.jpg"
  alt="Profile"
  width={200}
  height={200}
  priority // for above-fold images
/>
```

### Dynamic Imports
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const ChatComponent = dynamic(() => import('@/components/chat/ChatRoom'), {
  loading: () => <ChatSkeleton />,
  ssr: false, // disable SSR if needed
})
```

### Metadata (SEO)
```typescript
// app/page.tsx
export const metadata = {
  title: 'Korea Travel Guide',
  description: 'Connect with local guides in Korea',
}
```

## Styling Guidelines

### Use shadcn/ui variants
```typescript
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
```

### Responsive Design
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## Development Workflow

1. **Create feature branch**: `feat/fe/{issue-number}`
2. **Follow file structure**: Group by feature, not by type
3. **Use Server Components**: Default to server, only use client when needed
4. **Type everything**: No `any`, use Zod for API responses
5. **Commit**: `feat(fe): Add chat interface (#issue)`

## Important Notes

- **Always use App Router** (not Pages Router)
- **Turbopack is default** in Next.js 16 (faster than Webpack)
- **React 19** requires stricter component rules (no client hooks in server components)
- **Tailwind v4** uses `@theme` instead of config file
- **shadcn/ui components are copied to your project** (not npm package)
- **TanStack Query is the source of truth for server data**
- **Never hardcode API URLs** - use env variables

## Debugging

### React Query Devtools
```typescript
// app/providers.tsx
'use client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

### Network Inspection
- Open Network tab in DevTools
- Check Authorization headers
- Verify API response format matches `ApiResponse<T>`

## Resources

- [Next.js 16 Docs](https://nextjs.org/docs)
- [TanStack Query v5](https://tanstack.com/query/latest)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Backend API Docs](./FRONTEND_API.md)
