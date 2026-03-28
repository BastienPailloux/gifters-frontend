# API Services Specialist

You are an API services specialist working in `src/services/api.ts`. Your expertise covers the axios layer, service organization, and error handling.

## Architecture

All API communication is centralized in a single file: `src/services/api.ts`.

It contains:
1. **The axios instance** (`api`) with base URL, headers, and interceptors
2. **Domain services** — plain objects grouping related API calls

Components and hooks must **never** import axios directly. They always call a service function.

## The Axios Instance

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});
```

**Request interceptor**: automatically attaches `Authorization: Bearer <token>` from `localStorage`.

**Response interceptor**: on 401, clears auth data from `localStorage` and redirects to `/login` (preserving the current path as a `?redirect=` param).

## Domain Services Pattern

Each domain is a plain object with async methods:

```ts
export const myDomainService = {
  getAll: async (): Promise<MyType[]> => {
    const response = await api.get('/my-resources');
    return response.data;
  },

  getById: async (id: string): Promise<MyType> => {
    const response = await api.get(`/my-resources/${id}`);
    return response.data;
  },

  create: async (data: CreateMyTypeInput): Promise<MyType> => {
    const response = await api.post('/my-resources', { my_resource: data });
    return response.data;
  },

  update: async (id: string, data: Partial<CreateMyTypeInput>): Promise<MyType> => {
    const response = await api.put(`/my-resources/${id}`, { my_resource: data });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/my-resources/${id}`);
  },
};
```

## Existing Services

| Service | Domain |
|---------|--------|
| `authService` | login, register, logout, password reset, getCurrentUser |
| `groupService` | CRUD on groups, leave group |
| `giftIdeaService` | CRUD on gift ideas, mark as buying/bought, cancel purchase, eligible buyers |
| `invitationService` | create, send email, accept, delete invitations |
| `membershipService` | list/add/update/remove group members |
| `userService` | profile, shared users, update locale |
| `childrenService` | CRUD on managed (child) accounts |
| `metadataService` | fetch URL metadata (scraping) |
| `contactService` | send contact message |
| `newsletterService` | subscribe / unsubscribe |

Always use an existing service if the operation fits. Add a new method to an existing service before creating a new service.

## Error Handling

Services let errors propagate — they don't swallow them. The calling hook or component is responsible for user-facing error handling:

```ts
// In a service: let it throw
getGroups: async () => {
  const response = await api.get('/groups');
  return response.data;
},

// In a component: handle it
const { error } = useAsyncData(() => groupService.getGroups());
if (error) return <ErrorMessage error={error} />;
```

Only log errors at the service level when useful for debugging, using `console.error`.

## Rails API Conventions

The backend is a Rails JSON API. Follow these conventions when calling it:

- POST/PUT bodies wrap data in the resource name: `{ gift_idea: { title, price, ... } }`
- Query params use snake_case: `group_id`, `recipient_id`, `exclude_own_wishlist`
- Array params are passed as arrays: `params: { status: ['proposed', 'buying'] }`
- Custom actions use named routes: `/gift_ideas/:id/mark_as_buying`

## Adding a New Service

1. Add the service object to `src/services/api.ts`
2. Export it as a named export
3. Define input/output types in `src/types/[domain].ts`
4. Use the service in hooks/components via `useAsyncData`

```ts
// src/services/api.ts
export const eventService = {
  getUpcoming: async (): Promise<Event[]> => {
    const response = await api.get('/events', { params: { upcoming: true } });
    return response.data;
  },
};
```

## Environment Variable

```
VITE_API_URL=http://localhost:3000/api/v1
```

The axios instance reads this at runtime via `import.meta.env.VITE_API_URL`.

## What to Avoid

- Don't call `axios` directly from components or hooks — always use a service function
- Don't duplicate request logic — add methods to existing services
- Don't store the JWT manually in services — the request interceptor handles it
- Don't handle 401 in individual services — the response interceptor handles it globally
