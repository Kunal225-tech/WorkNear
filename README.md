# 📍 WorkNear — Local Jobs & Nearby Talent Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![NextAuth](https://img.shields.io/badge/NextAuth-v5_Beta-purple?style=for-the-badge&logo=auth0)](https://authjs.dev/)

**WorkNear** is a modern, hyperlocal service and gig marketplace connecting homeowners and individuals with verified local professionals (plumbers, electricians, cleaners, painters, handymen, and more) within their immediate neighborhood.

---

## 🌟 Key Features

### 📍 Hyperlocal Job Discovery
- **Radius-Based Filtering**: Search tasks within a 5 km, 10 km, 25 km, or 50 km radius using MongoDB `2dsphere` spatial indexing.
- **One-Click GPS Geolocation**: Auto-detects device coordinates and resolves neighborhood names via OpenStreetMap reverse-geocoding.
- **19 Local Service Categories**: Dedicated filtering across home maintenance, repairs, moving, tutoring, and personal assistance.

### 💼 Complete Gig Lifecycle
- **Draft-First Job Creation**: Homeowners can fill in job details without an account; drafts persist in `localStorage` and restore automatically upon sign-in.
- **Multi-Image Uploads**: Direct image uploads powered by Cloudinary for task documentation.
- **Proposals & Assignment**: Workers apply with custom notes; posters review applicant profiles and assign with a single click.
- **Job Completion & Closure**: State-machine status tracking (`open` ➔ `assigned` ➔ `completed` / `cancelled`).

### 💬 In-App Direct Messaging & Notifications
- **Private Task Chat**: Threaded messaging between posters and assigned workers on active jobs.
- **Interactive Notifications**: Live notification bell with unread counters for proposals, acceptances, and new messages.

### ⭐ Community Trust & Reputation
- **Two-Way Reviews & Ratings**: 5-star ratings and verified written reviews calculated on completed tasks.
- **Phone Number Privacy Protection**: Masks contact details on public profiles (`+91••••••34`) for unauthenticated visitors, preventing scraper harvesting while preserving platform trust.

### 🚀 Next.js App Router SEO
- **Google for Jobs Integration**: Structured `schema.org/JobPosting` JSON-LD with XSS-safe escaping, day-based salary units, and ISO-8601 timestamps.
- **Dynamic OpenGraph & Twitter Cards**: High-converting link previews on WhatsApp, Twitter, and LinkedIn.
- **Automated Sitemap & Robots**: Hourly revalidated `sitemap.xml` dynamically querying open jobs, paired with optimized `robots.txt`.

### 🎨 Modern UX & Accessibility
- **Dark & Light Mode**: Seamless theme switching with persistent user preference.
- **Bilingual Interface**: Native support for **English** and **Hindi (हिंदी)** with instant dictionary switching.
- **Safe Callback Redirection**: Preserves `?callbackUrl=...` across all sign-in and sign-up flows.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Actions, Server Components) |
| **UI Library** | [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| **Icons & Motion** | [Lucide React](https://lucide.react.dev/), [Framer Motion](https://www.framer.com/motion/) |
| **State & Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) |
| **Form Management** | [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/) validation |
| **Database & ODM** | [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) |
| **Authentication** | [NextAuth.js v5](https://authjs.dev/) (Credentials JWT + Google OAuth 2.0) |
| **Media Storage** | [Cloudinary](https://cloudinary.com/) Media API |
| **Email Service** | [Nodemailer](https://nodemailer.com/) (Gmail / SMTP integration) |

---

## 📁 Project Structure

```
worknear/
├── actions/             # Next.js Server Actions (Auth, Jobs, Apps, Messages, Reviews)
├── app/                 # Next.js App Router
│   ├── (auth)/          # Authentication routes (/login, /register)
│   ├── (dashboard)/     # Protected user dashboards (/dashboard, /messages, etc.)
│   ├── api/             # REST API Route Handlers
│   ├── categories/      # Service categories catalog
│   ├── jobs/            # Job browse, search, and detail pages
│   ├── post-job/        # Public draft-first job creation
│   ├── robots.ts        # Dynamic robots.txt
│   └── sitemap.ts       # Hourly dynamic sitemap.xml
├── components/          # Reusable React components
│   ├── jobs/            # Job cards, applicant cards, job forms
│   ├── messages/        # In-app chat interface
│   ├── reviews/         # Star ratings, review forms & cards
│   ├── shared/          # Navbar, footer, badges, language switcher
│   └── ui/              # shadcn/ui primitives (Button, Card, Input, etc.)
├── constants/           # Categories, job status, and application status enums
├── db/                  # MongoDB cached connection singleton
├── hooks/               # Custom React Query & browser hooks
├── i18n/                # English & Hindi translation dictionaries
├── models/              # Mongoose data models (User, Job, Application, Message, etc.)
├── services/            # Client-side API service layer
├── types/               # TypeScript interfaces and shared types
└── validators/          # Zod request & form validation schemas
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** 20.x or higher
- **MongoDB** (Local instance or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- **npm** or your preferred package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Kunal225-tech/WorkNear.git
cd WorkNear/worknear
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the `worknear` directory (refer to `.env.example`):

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/worknear?retryWrites=true&w=majority

# NextAuth v5
AUTH_SECRET=your_32_byte_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional for local dev)
AUTH_GOOGLE_ID=your_google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_client_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional)
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment

WorkNear is pre-configured for zero-friction deployment on **Vercel** with **MongoDB Atlas**:

1. **Database**: Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), whitelist `0.0.0.0/0`, and obtain your connection string.
2. **Deploy on Vercel**: Import the GitHub repository into [Vercel](https://vercel.com).
3. **Environment Variables**: Add your `MONGODB_URI`, `AUTH_SECRET`, `AUTH_GOOGLE_*`, and `CLOUDINARY_*` values.
4. **Google OAuth**: Add `https://<your-domain>.vercel.app/api/auth/callback/google` to your Authorized Redirect URIs in Google Cloud Console.

For a full step-by-step walkthrough, see our [Production Deployment Guide](./deployment_walkthrough.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
