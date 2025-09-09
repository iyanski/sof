# CLAUDE.md (Root)

This repository contains **two separate projects** with their own AI assistant guidelines:

* **Backend API (Node.js + Express + TypeScript)**  → see [`api/CLAUDE.md`](./api/CLAUDE.md)
* **Frontend App (Vite.js)** → see [`app/CLAUDE.md`](./app/CLAUDE.md)

## Purpose

This root file serves as a **pointer** so that AI-assisted editors (Claude, ChatGPT, Cursor, etc.) and developers know where to look for the appropriate rules depending on the project section.

## General Guidance

* Always consult the **specific CLAUDE.md** inside the relevant subdirectory (`api/` or `app/`).
* If you're working on **infrastructure or repo-wide tasks** (e.g., CI, linting across projects, dependency management, Git/PR conventions), apply the stricter of the two guidelines where they overlap.
* When in doubt, **default to backend rules for security and validation** and **frontend rules for UX and accessibility**.

## Safe AI Development Prompt (Repo-Wide)

Use this prompt when unsure which project you're working on:

> "Please make the requested changes to this monorepo. If the change concerns the API, follow `api/CLAUDE.md` (Express.js + TypeScript conventions, DTO validation, error handling, tests, Swagger). If the change concerns the App, follow `app/CLAUDE.md` (Vite app conventions, component patterns, TypeScript/React/Vue rules, testing with Vitest). For repo-wide changes (CI, lint, tooling), respect both guidelines and maintain consistency."

---

*Keep this file updated if new subprojects are added or conventions change.*
