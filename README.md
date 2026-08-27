# Portfolio Frontend

A modern portfolio website built with React, Vite, and Tailwind CSS. The app includes a public-facing portfolio experience for projects, blog posts, and contact information, plus a protected admin dashboard for managing content.

## Features

- Responsive landing page and portfolio sections
- Project listing and detail pages
- Blog listing and article detail pages
- Contact page
- Protected dashboard for:
  - posts
  - projects
  - skills
  - experience
  - messages
  - comments
  - profile settings
- Dark mode support
- JWT-based auth flow with refresh token handling
- API integration through Axios

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- TanStack React Query
- Sonner notifications

## Prerequisites

Before running the app, make sure you have the following installed:

- Node.js 18+
- npm or yarn

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

   If there is no `.env.example`, create a `.env` file manually with:

   ```env
   VITE_API_URL=http://localhost:8000
   ```

   Adjust the URL to match your backend API.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser:

   ```text
   http://localhost:5173
   ```

## Available Scripts

```bash
npm run dev
```
Starts the Vite development server.

```bash
npm run build
```
Builds the app for production.

```bash
npm run preview
```
Serves the production build locally.

```bash
npm run lint
```
Runs ESLint checks across the project.

## Project Structure

```text
src/
  api/              API configuration and Axios instance
  components/       Reusable UI and page components
  context/          Auth and theme providers
  hooks/            Custom React hooks
  pages/            Route-level pages
  routes/           App routing and protected route logic
  styles/           Global CSS and Tailwind setup
  utils/            Helper utilities
```

## Notes

- The frontend expects a backend API to provide portfolio content and authentication endpoints.
- The dashboard routes are protected and require valid auth tokens.
- The app stores auth tokens and visitor metadata in local storage for session handling.

## License

This project does not currently declare a license.
