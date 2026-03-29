# ClaudeOnReact Context

This is the frontend of Gifters — a React SPA for managing gift ideas within groups of friends and family.

## Project Information
- **React Version**: 19
- **TypeScript**: Yes (strict)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 + twMerge
- **Routing**: react-router-dom v7
- **HTTP Client**: axios (centralized instance in `src/services/api.ts`)
- **Auth**: JWT stored in localStorage, managed via `AuthContext` + `useAuth` hook
- **i18n**: i18next, translation files in `public/locales/` (FR + EN)
- **Animations**: framer-motion
- **Tests**: Jest + @testing-library/react

## Source Structure

```
src/
├── components/     # Reusable components, organized by domain
│   ├── common/     # Shared UI: forms, display, navigation, modals, layout, typography
│   ├── auth/
│   ├── chat/       # ChatPanel, ChatMessage, ChatWidget, ConversationList, ThinkingSteps
│   ├── dashboard/  # DashboardSummaryCard, DashboardChatInput, …
│   ├── gift-ideas/
│   ├── groups/
│   ├── children/
│   ├── profile/
│   └── layout/     # App shell: Layout, SideMenu, Footer
├── pages/          # One file per route
├── contexts/       # AuthContext, ChatContext
├── hooks/          # useAuth, useAsyncData, useKeyPress, useOutsideClick…
├── services/       # api.ts — axios instance; conversationService.ts — chat IA
├── types/          # Shared TypeScript types, one file per domain
├── utils/          # Pure utility functions
└── routes/         # routeConfig.ts + RouteRenderer.tsx
```

## Key Conventions

- Components are organized by domain under `src/components/[domain]/`
- Tests live in `__tests__/` subdirectory next to the component
- All API calls go through the centralized axios instance in `src/services/api.ts`
- Custom hooks handle data fetching (`useAsyncData`) and side effects
- Routes are declared in `src/routes/routeConfig.ts`, rendered by `RouteRenderer`
- Protected routes use the `ProtectedRoute` wrapper (checks `useAuth().isAuthenticated`)
- TypeScript types are grouped by domain in `src/types/`
- **TDD is mandatory**: write the test before the implementation

## Chat IA — Architecture critique

**Le frontend ne doit JAMAIS appeler agent-gifters directement.**
Toutes les requêtes passent par `conversationService` → Rails backend.

- `ChatContext` (`src/contexts/ChatContext.tsx`) : état global des conversations, règle 10 min d'inactivité (`INACTIVITY_DURATION`), pas de localStorage
- `conversationService` (`src/services/conversationService.ts`) : `list`, `create`, `get`, `stream` (fetch + ReadableStream avec JWT)
- Page `/chat` : layout 2 colonnes (`ConversationList` + `ChatPanel variant="page"`)
- Dashboard : `DashboardChatInput` navigue vers `/chat` avec `location.state.initialMessage`

## Development Guidelines

- Follow the existing domain-based folder structure — don't create flat or ad-hoc files
- Use `useAsyncData` for data fetching in components, not raw `useEffect` + `useState`
- Use the existing service layer (`groupService`, `giftIdeaService`, `conversationService`, etc.) — don't call axios directly from components
- Use `twMerge` (already used in Button, etc.) for conditional Tailwind classes
- All new text strings must use i18next (`useTranslation`) — no hardcoded UI strings
- Accessibility: use semantic HTML, proper ARIA attributes, keyboard navigation
- Write tests for all new components, hooks, and utilities
