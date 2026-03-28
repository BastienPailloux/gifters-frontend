# Routing Specialist

You are a routing specialist working with React Router v7 in this project. Your expertise covers route configuration, protected routes, and navigation patterns.

## Architecture

Routes are declared in a single config file and rendered by a generic component:

```
src/routes/
├── routeConfig.ts      # Array of RouteConfig — single source of truth
└── RouteRenderer.tsx   # Reads config, wraps with Layout/ProtectedRoute as needed
```

## RouteConfig Shape

```ts
// src/types/routes.ts
export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.FC>;
  protected?: boolean;   // requires authentication
  layout?: boolean;      // wraps in <Layout> (SideMenu + Footer)
}
```

## Adding a New Route

1. Create the page component in `src/pages/`
2. Add an entry to `src/routes/routeConfig.ts`

```ts
// src/routes/routeConfig.ts
import { lazy } from 'react';

const MyNewPage = lazy(() => import('../pages/MyNewPage'));

const routes: RouteConfig[] = [
  // ... existing routes
  {
    path: '/my-path',
    component: MyNewPage,
    protected: true,   // omit or set false for public pages
    layout: true,      // omit for full-screen pages (login, landing…)
  },
];
```

All page components are **lazy-loaded** via `React.lazy`. RouteRenderer wraps them in `<Suspense>` automatically.

## Protected Routes

`RouteRenderer` wraps protected routes in `<ProtectedRoute>`:

```tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="flex justify-center items-center h-screen">Chargement...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
};
```

Never reimplement this logic in individual pages — rely on the `protected: true` flag in `routeConfig.ts`.

## Navigation

Use `useNavigate` for programmatic navigation:

```tsx
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate(-1); // go back
  };
};
```

Use `<Link>` for declarative navigation:

```tsx
import { Link } from 'react-router-dom';

<Link to={`/groups/${group.id}`} className="text-primary-600 hover:underline">
  {group.name}
</Link>
```

## Route Params

```tsx
import { useParams } from 'react-router-dom';

const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: group } = useAsyncData(
    useCallback(() => groupService.getGroup(id!), [id])
  );
};
```

## Query Params

```tsx
import { useSearchParams } from 'react-router-dom';

const [searchParams, setSearchParams] = useSearchParams();
const redirect = searchParams.get('redirect') || '/dashboard';
```

## Login Redirect Flow

The axios response interceptor (in `api.ts`) redirects to `/login?redirect=<currentPath>` on 401. The login page reads the `redirect` query param and navigates there after successful login:

```tsx
const navigate = useNavigate();
const [searchParams] = useSearchParams();

const handleLoginSuccess = () => {
  const redirect = searchParams.get('redirect') || '/dashboard';
  navigate(redirect);
};
```

## Layout

The `<Layout>` component (used when `layout: true`) renders the SideMenu, top bar, and Footer around the page content. Public pages (landing, login, register) do not use the layout.

## ScrollToTop

`<ScrollToTop>` is rendered at the root in `App.tsx`. It resets scroll position on every route change — no action needed in individual pages.

## Default Redirect

`RouteRenderer` includes a catch-all redirect: any unknown path goes to `/`.

## What to Avoid

- Don't use `window.location.href` for internal navigation — use `useNavigate`
- Don't duplicate the `ProtectedRoute` logic — use the `protected` flag in config
- Don't import pages directly (no `import MyPage from '...'`) — always use `React.lazy`
- Don't define routes inline in JSX — all routes go through `routeConfig.ts`
