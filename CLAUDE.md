# Quiz Funnel System - Project Guidelines

## Project Context
Next.js application with Supabase backend for creating and managing quiz funnels that:
- Presents multi-step quizzes to collect lead information
- Tracks detailed user journey through the funnel
- Analyzes conversion metrics at each step
- Integrates with email marketing systems via webhooks
- Provides admin dashboard for lead and performance analysis

## Code Style and Structure
- Write concise, type-safe TypeScript code with proper error handling
- Use functional components and Server/Client component separation
- Implement modular architecture with well-defined responsibilities
- Prefer composition over inheritance; avoid class-based components
- Use declarative patterns and descriptive variable names (e.g., isLoading, hasSubmitted)

### Repository Structure
```
src/
├── app/                  # Next.js App Router routes
│   ├── api/              # API Routes
│   ├── quiz/[slug]/      # Quiz pages
│   ├── admin/            # Admin dashboard
│   └── auth/             # Auth pages
├── components/           # Shared React components
│   ├── ui/               # Base UI components
│   ├── quiz/             # Quiz-specific components
│   ├── admin/            # Admin dashboard components
│   └── forms/            # Form components
├── hooks/                # Custom React hooks
├── lib/                  # Shared utilities
│   ├── supabase/         # Supabase client and helpers
│   ├── validation/       # Form validation schemas
│   └── webhooks/         # Webhook handlers
├── types/                # TypeScript shared types
└── utils/                # Helper functions
```

## Tech Stack
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- React Hook Form
- Zod (validation)
- TanStack Query/Table
- ReCharts (visualization)

## Naming Conventions
- Use kebab-case for directories (e.g., `components/quiz-step`)
- Use PascalCase for component files (e.g., `QuizStep.tsx`)
- Use camelCase for utility files (e.g., `formValidator.ts`)
- Favor named exports over default exports
- Prefix server components with `page.tsx` or add `.server.tsx` suffix
- Suffix client components with `.client.tsx` when mixed with server components

## TypeScript Usage
- Use TypeScript for all code with strict type checking
- Define interfaces for all data structures and API responses
- Create type definitions for Supabase tables using generated types
- Use Zod for validation and type inference
- Avoid `any` and `unknown` types; prefer explicit typing
- Implement proper error handling with typed error objects
- Use discriminated unions for state management

## State Management
- Use React Server Components for static content
- Implement React Context for client-side state when needed
- Use hooks for component-level state management
- Utilize TanStack Query for server state and caching
- Implement proper form state with React Hook Form

## API and Data Handling
- Create typed API routes with proper validation
- Handle API errors gracefully with status codes
- Implement optimistic UI updates where appropriate
- Use proper data fetching patterns (Server Components or TanStack Query)
- Structure Supabase queries for optimal performance
- Implement proper error boundaries and fallbacks

## Performance Guidelines
- Properly segment client and server components
- Use proper image optimization with Next.js Image
- Implement incremental static regeneration where applicable
- Optimize bundle size with dynamic imports
- Use proper React memo and callback patterns for expensive operations

## Testing and Quality
- Write unit tests for critical utility functions
- Implement integration tests for API routes
- Use React Testing Library for component tests
- Document complex functions and components
- Follow ESLint and Prettier configurations

## Webhook and Integration Guidelines
- Implement idempotent webhook handlers
- Use proper retry mechanisms with exponential backoff
- Log all integration attempts and responses
- Create adapters for different webhook providers
- Validate all incoming and outgoing data

When implementing code for this project, follow these guidelines to ensure consistency, maintainability, and performance. Each implementation should focus on solving one specific problem well rather than creating complex, multi-purpose solutions.