# CLAUDE.md

*A guide for using AI assistants (Claude, ChatGPT, Cursor, etc.) safely and productively in this Vite.js codebase.*

---

## Purpose

This document explains **how to collaborate with AI assistants** in this repository. It sets guardrails for generating, reviewing, and integrating code changes to maintain security, performance, and consistency.

---

## Quick Facts

* **Build tool:** Vite ^5 (confirm in `package.json`)
* **Framework:** React / Vue / Svelte (confirm in `package.json`)
* **UI Library:** RSuite (React components with built-in themes)
* **Runtime:** Node.js ≥ 18 (for tooling)
* **Package manager:** npm / pnpm / yarn (check `packageManager` in `package.json`)
* **Testing:** Vitest + Testing Library (default)
* **Lint/Format:** ESLint + Prettier
* **Type system:** TypeScript (if enabled)
* **CI:** GitHub Actions / other (confirm in repo)

Core scripts (check `package.json`):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write 'src/**/*.{js,ts,jsx,tsx,vue,svelte,css,md}'",
    "test": "vitest"
  }
}
```

---

## Repository Layout (expected)

```
/ (repo root)
├─ src/
│  ├─ main.ts[x]        # app entry
│  ├─ App.tsx/.vue/.svelte
│  ├─ components/       # UI components
│  ├─ pages/            # route-level components (if using router)
│  ├─ hooks/ or composables/ # reusable logic
│  ├─ store/            # state management (Redux/Zustand/Pinia)
│  ├─ utils/            # helpers
│  ├─ styles/           # global styles
│  └─ assets/           # static assets
├─ public/              # static files served as-is
├─ tests/               # unit/integration tests
├─ vite.config.ts       # vite config
├─ tsconfig.json        # TypeScript config
├─ .eslintrc.*          # lint rules
├─ .prettierrc.*        # formatter config
└─ package.json
```

---

## Ground Rules for AI Changes

1. **Never commit secrets.** Use `.env` and `.env.example` for environment variables.
2. **Type safety.** Prefer TypeScript with strict mode enabled.
3. **Accessibility.** All UI components must meet basic a11y standards (labels, roles, ARIA).
4. **Performance.** Favor code-splitting, lazy loading, and memoization where useful.
5. **Styling.** Respect chosen stack (Rsuite, CSS Modules, etc.).
6. **Testing.** Every new feature requires Vitest + Testing Library coverage.
7. **Lint/format.** ESLint + Prettier must pass before merge.
8. **Docs.** Update README/CLAUDE.md when contracts, env vars, or conventions change.

---

## Architecture Conventions

### Components

* Keep components small, reusable, and typed.
* Separate presentational (UI) from container (logic) components when complexity grows.

### State Management

* Prefer local component state first.
* Use chosen global store (Redux/Pinia/Zustand) for cross-cutting state.

### Routing

* Use official router (React Router / Vue Router / SvelteKit routing).
* Lazy load pages; define layouts if supported.

### API Calls

* Centralize in `src/services/` or `src/api/`.
* Use fetch/axios wrappers with typed responses.
* Handle errors consistently; show user-friendly messages.

### Styling

* **Primary:** Use RSuite components for consistent UI/UX out of the box.
* **Secondary:** Custom CSS only when RSuite doesn't provide needed functionality.
* **Theming:** Leverage RSuite's built-in theme system and CSS variables.
* **Responsive:** RSuite components are mobile-first and responsive by default.
* No inline styles unless absolutely necessary.

### Config & Env

* All environment variables defined in `.env.example`.
* Access via `import.meta.env.VITE_*`.

---

## RSuite Component Guidelines

### Setup & Import

* Import RSuite CSS in `src/main.tsx`:
  ```tsx
  import 'rsuite/dist/rsuite.min.css';
  ```
* Import individual components as needed:
  ```tsx
  import { Button, Panel, Form, Input } from 'rsuite';
  ```

### Component Usage

* **Prefer RSuite components** over custom HTML elements:
  - Use `<Button>` instead of `<button>`
  - Use `<Panel>` instead of `<div>` for content sections
  - Use `<Form>` and `<Input>` for form handling
  - Use `<Container>`, `<Header>`, `<Content>`, `<Footer>` for layout

* **Leverage RSuite props** for styling and behavior:
  ```tsx
  <Button appearance="primary" size="lg" color="blue">
    Submit
  </Button>
  ```

* **Use RSuite's built-in themes** and avoid custom CSS when possible:
  - `appearance`: primary, secondary, subtle, ghost
  - `color`: red, orange, yellow, green, cyan, blue, violet
  - `size`: xs, sm, md, lg, xl

### Form Handling

* Use RSuite's `<Form>` component with built-in validation:
  ```tsx
  <Form onSubmit={handleSubmit}>
    <Form.Group>
      <Form.ControlLabel>Email</Form.ControlLabel>
      <Form.Control name="email" type="email" required />
    </Form.Group>
  </Form>
  ```

### Layout Components

* Use RSuite's layout system:
  - `<Container>` for main wrapper
  - `<Header>`, `<Content>`, `<Sidebar>`, `<Footer>` for page structure
  - `<Grid>`, `<Row>`, `<Col>` for responsive grid system

### Icons

* Use RSuite's icon system:
  ```tsx
  import { Icon } from '@rsuite/icons';
  <Icon icon="user" />
  ```

---

## What Context to Provide AI

When requesting AI changes:

1. **Goal:** user story / feature request.
2. **Framework context:** React/Vue/Svelte.
3. **Files:** paste relevant snippets or full files.
4. **Constraints:** performance, UX, style system.
5. **Tests:** coverage expectations.

**Minimal example request:**

```
Goal: Add a login form component with email + password.
Framework: React with TypeScript.
Constraints: form validated with zod; use Rsuite for components.
Files: src/components/LoginForm.tsx (new), tests/LoginForm.test.tsx (new).
Tests: must cover valid + invalid inputs.
```

---

## Prompt Templates (Recipes)

### 1) Add a new component

```
Task: Create src/components/[Name].tsx to [purpose].
Requirements:
- Typed props interface
- Use RSuite components for UI elements
- Accessibility checked (RSuite components are a11y-compliant)
- Unit test with Vitest + Testing Library
- Leverage RSuite's built-in styling props
Return full component + test file.
```

### 2) Add a page/route

```
Task: Add new page at /[route].
Requirements:
- Create src/pages/[Route].tsx
- Lazy load via router
- Include test for rendering and navigation
Return code and router update.
```

### 3) Create a service/api call

```
Task: Add service in src/services/[name].ts to call [endpoint].
Requirements:
- Use fetch wrapper
- Strong typing of request/response
- Error handling
- Unit test mocking fetch
```

### 4) Add state management slice/store

```
Task: Add new slice/store for [domain].
Requirements:
- Located in src/store/[domain].ts
- Strict typing of state + actions
- Tested with Vitest
```

### 5) Add global style/util

```
Task: Add src/styles/[file].css with [purpose].
Update main entry to include style. Ensure no conflicts.
```

---

## Review Checklist

**Correctness**

* [ ] Matches acceptance criteria
* [ ] Type-safe, no `any` unless justified
* [ ] Tests included and green

**Security**

* [ ] No secrets committed
* [ ] Input validated/sanitized if user-facing

**Quality**

* [ ] ESLint + Prettier pass
* [ ] Components small and accessible
* [ ] No unused code/deps

**Performance**

* [ ] Code-splitting applied where needed
* [ ] Avoid unnecessary re-renders

**Docs**

* [ ] README updated
* [ ] CLAUDE.md updated if conventions changed

---

## Environment Variables

* All prefixed with `VITE_`.
* Documented in `.env.example`.
* Example:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_FEATURE_FLAG_X=true
```

---

## Coding Style Notes

* Use modern ESNext syntax.
* Use hooks/composables over classes.
* Prefer composition over inheritance.
* Consistent naming: `PascalCase` for components, `camelCase` for variables/functions.

---

## Performance Tips

* Use `React.lazy`/`Suspense` or Vue async components.
* Memoize heavy computations.
* Optimize images/assets in `public/`.
* Use Vite plugins wisely (analyze bundle size).

---

## Git & PR Conventions

* Branch naming: `feat/...`, `fix/...`, `chore/...`.
* Commits: Conventional Commits (`feat(login): add login form`).
* PR must include: feature goal, screenshots, test evidence, checklist.

---

## FAQ

**Q: Can AI add new dependencies?**
A: Only if justified; must be modern, maintained, and documented.

**Q: Can AI modify Vite config?**
A: Yes, if necessary for features (e.g., aliases, plugins). Document changes.

---

## One-Line Prompt for Any Task

```
Follow repository rules in CLAUDE.md. Propose safe, typed, test-backed changes as patch-style diffs. Ask for missing context once, then output code.
```
