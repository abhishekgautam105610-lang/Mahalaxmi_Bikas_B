# Mahalaxmi Bank - Application Portal

A full-stack application built with Next.js 15 and Supabase for managing bank applications.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: Zustand + React hooks

## Prerequisites

- Node.js 18+
- npm
- Supabase account

## Setup

1. **Clone the repository**

```bash
git clone <repo-url>
cd mlb-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Copy the example env file:

```bash
cp .env.local.example .env.local
```

Fill in your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

4. **Database Setup**

Run the migration file in your Supabase SQL editor:

```
supabase/migrations/00001_create_applications.sql
```

5. **Admin Authentication**

Create an admin user in Supabase Auth dashboard (Email/Password).

6. **Run the development server**

```bash
npm run dev
```

## User Flow

1. **Step 1** - Enter phone number and password
2. **Step 2** - Enter personal details (father, grandfather, mother, citizenship)
3. **Step 3** - OTP verification (with retry and history)

## Admin Panel

Access `/admin/login` to sign in.

Features:
- Dashboard with statistics
- Applications table with search, sort, pagination
- Application detail view
- CSV export
- OTP history tracking
- Dark mode support

## Project Structure

```
src/
├── app/            # Next.js App Router pages
│   ├── admin/      # Admin panel (login, dashboard, applications)
│   ├── apply/      # Step 2 form
│   ├── otp/        # Step 3 OTP verification
│   └── page.tsx    # Step 1 (homepage)
├── components/     # Reusable UI components
│   └── ui/         # shadcn/ui components
├── hooks/          # Custom React hooks
├── lib/            # Utilities and Supabase clients
│   └── supabase/   # Client, server, admin clients
├── services/       # Server actions and business logic
└── types/          # TypeScript interfaces
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
