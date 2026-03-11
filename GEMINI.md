# Project Overview: my-profile

This is a modern web application built with **Next.js 16.1.6** and **React 19.2.3**, focused on creating a personal profile or portfolio. It utilizes the Next.js **App Router** architecture for efficient routing and layout management.

## Core Technologies

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with PostCSS
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint](https://eslint.org/)
- **Package Manager:** `pnpm` (indicated by `pnpm-lock.yaml` and `pnpm-workspace.yaml`), though standard `npm` commands are also supported via `package.json` scripts.

## Project Structure

The project follows the standard Next.js App Router structure:

- `my-profile/app/`: Contains the application routes, layouts, and global styles.
  - `layout.tsx`: Root layout defining the HTML structure and global fonts (Geist).
  - `page.tsx`: The main entry point (home page).
  - `globals.css`: Global CSS and Tailwind directives.
- `my-profile/public/`: Static assets like images and icons.
- `my-profile/next.config.ts`: Next.js specific configuration.
- `my-profile/tsconfig.json`: TypeScript configuration.

## Building and Running

Commands should be executed within the `my-profile` directory:

| Task | Command |
| :--- | :--- |
| **Development** | `npm run dev` |
| **Build** | `npm run build` |
| **Production Start** | `npm start` |
| **Linting** | `npm run lint` |

## Development Conventions

- **App Router:** Use the `app/` directory for all routing logic. Prefer Server Components by default.
- **Styling:** Use Tailwind CSS 4 utility classes for styling. Global styles should be managed in `app/globals.css`.
- **Fonts:** Geist Sans and Geist Mono are configured via `next/font/google` in the root layout.
- **Type Safety:** Maintain strict TypeScript typing for all components and functions.
- **Icons/Images:** Use the `next/image` component for optimized image delivery.

---
*This file serves as a guide for Gemini CLI to understand the project context and provide better assistance.*
