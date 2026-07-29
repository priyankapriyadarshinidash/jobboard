# Job Board / Applicant Tracking System - Setup Guide

## Overview

This is a full-stack Job Board and Applicant Tracking System built with React, Node.js, TypeScript, and MySQL. It features role-based access control for Candidates and Recruiters, resume uploads to S3-compatible storage, job postings, application tracking, and automated email notifications.

## Features

### For Candidates
- Browse and search job listings with filters (location, skills)
- Upload and manage resumes (PDF/DOC format)
- Apply to jobs with resume attachment and cover note
- Track application status in real-time
- Receive email notifications on application status updates

### For Recruiters
- Create and manage job postings
- View all applications for each job
- Download candidate resumes
- Update application status (New, Reviewed, Shortlisted, Rejected)
- Automated email notifications sent to candidates on status changes

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Node.js, Express 4, tRPC 11
- **Database**: MySQL/TiDB
- **Storage**: S3-compatible storage (Manus built-in)
- **Authentication**: Manus OAuth
- **Notifications**: Manus built-in email service

## Project Structure

```
job-board-ats/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilities and tRPC client
│   │   └── App.tsx           # Main routing
│   └── index.html
├── server/                    # Node.js backend
│   ├── db.ts                 # Database query helpers
│   ├── routers.ts            # tRPC procedure definitions
│   ├── notifications.ts      # Email notification service
│   ├── storage.ts            # S3 storage helpers
│   ├── resumeUpload.ts       # Resume upload logic
│   └── _core/                # Framework infrastructure
├── drizzle/                  # Database schema and migrations
│   └── schema.ts
├── shared/                   # Shared types and constants
└── package.json
```

## Getting Started Locally

### Prerequisites

- Node.js 22.13.0 or higher
- npm or pnpm package manager
- MySQL 8.0+ or compatible database
- Git

### Installation

1. **Clone the repository** (if using version control)
   ```bash
   git clone <repository-url>
   cd job-board-ats
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the project root:
   ```env
   # Database
   DATABASE_URL=mysql://user:password@localhost:3306/job_board_ats

   # Authentication
   JWT_SECRET=your-secret-key-here
   VITE_APP_ID=your-manus-app-id
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im

   # Storage & APIs
   BUILT_IN_FORGE_API_URL=https://api.manus.im
   BUILT_IN_FORGE_API_KEY=your-forge-api-key
   VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-key
   VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

   # Owner Info
   OWNER_OPEN_ID=your-owner-id
   OWNER_NAME=Your Name
   ```

4. **Set up the database**
   
   ```bash
   # Generate database migrations
   pnpm drizzle-kit generate
   
   # Apply migrations to your database
   pnpm drizzle-kit migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Running in VS Code

### Recommended VS Code Extensions

1. **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
2. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
3. **TypeScript Vue Plugin** - Vue.volar
4. **REST Client** - humao.rest-client (for API testing)

### VS Code Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/tsx",
      "args": ["watch", "server/_core/index.ts"],
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/auth.logout.test.ts
```

## Database Schema

### Users Table
- `id` (int, primary key)
- `openId` (varchar, unique) - Manus OAuth identifier
- `name` (text)
- `email` (varchar)
- `role` (enum: candidate, recruiter)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `lastSignedIn` (timestamp)

### Jobs Table
- `id` (int, primary key)
- `recruiterId` (int, foreign key to users)
- `title` (varchar)
- `description` (text)
- `location` (varchar)
- `skills` (text) - comma-separated
- `employmentType` (varchar)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Resumes Table
- `id` (int, primary key)
- `candidateId` (int, foreign key to users)
- `fileKey` (varchar) - S3 storage key
- `fileName` (varchar)
- `fileType` (varchar)
- `uploadDate` (timestamp)

### Applications Table
- `id` (int, primary key)
- `jobId` (int, foreign key to jobs)
- `candidateId` (int, foreign key to users)
- `resumeId` (int, foreign key to resumes)
- `coverNote` (text)
- `status` (enum: New, Reviewed, Shortlisted, Rejected)
- `appliedDate` (timestamp)
- `updatedAt` (timestamp)

## API Endpoints (tRPC)

All endpoints are under `/api/trpc` and use tRPC's type-safe client.

### Authentication
- `auth.me` - Get current user
- `auth.logout` - Logout current user
- `auth.setRole` - Set user role (candidate/recruiter)

### Jobs
- `jobs.create` - Create new job (recruiter only)
- `jobs.getAll` - Get all active jobs
- `jobs.getById` - Get job by ID
- `jobs.getByRecruiter` - Get jobs posted by current recruiter
- `jobs.update` - Update job (recruiter only)
- `jobs.delete` - Delete job (recruiter only)

### Resumes
- `resumes.uploadResume` - Upload resume (candidate only)
- `resumes.getAll` - Get all resumes for current candidate
- `resumes.getLatest` - Get latest resume
- `resumes.getDownloadUrl` - Get S3 download URL for resume

### Applications
- `applications.create` - Submit job application (candidate only)
- `applications.getByJob` - Get applications for job (recruiter only)
- `applications.getByCandidate` - Get applications for current candidate
- `applications.updateStatus` - Update application status (recruiter only)

## Email Notifications

Email notifications are automatically sent when:
- A recruiter updates an application status
- Supported statuses: Reviewed, Shortlisted, Rejected

### Email Templates

The system uses the Manus built-in notification API. Emails include:
- Candidate name
- Job title
- Application status update message
- Professional formatting

## Deployment

### Build for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

### Deployment to Manus

1. Save a checkpoint in the Manus Management UI
2. Click the "Publish" button
3. Follow the deployment wizard
4. Configure custom domain (optional)

### Environment Variables for Production

Ensure all environment variables are set in the Manus dashboard:
- `DATABASE_URL` - Production database connection
- `JWT_SECRET` - Secure random string
- `BUILT_IN_FORGE_API_KEY` - Production API key
- All OAuth and API configuration variables

## Troubleshooting

### Database Connection Issues
```bash
# Test database connection
mysql -h localhost -u user -p -D job_board_ats
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### tRPC Type Errors
```bash
# Regenerate types
pnpm check
```

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes**
   - Update database schema in `drizzle/schema.ts`
   - Generate migrations: `pnpm drizzle-kit generate`
   - Add database helpers in `server/db.ts`
   - Create tRPC procedures in `server/routers.ts`
   - Build UI in `client/src/pages/` or `client/src/components/`

3. **Test changes**
   ```bash
   pnpm test
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature
   ```

5. **Create pull request**

## Performance Optimization

- **Database**: Use indexes on frequently queried columns
- **Frontend**: Lazy load pages with React.lazy()
- **API**: Use tRPC's caching with React Query
- **Storage**: Compress images before upload

## Security Best Practices

1. **Never commit `.env` files** - Use environment variables
2. **Validate all inputs** - Use Zod schemas in tRPC procedures
3. **Check user roles** - Use `protectedProcedure` and role checks
4. **Secure file uploads** - Validate file types and sizes
5. **Use HTTPS** - Always use HTTPS in production
6. **Rate limiting** - Implement rate limiting for API endpoints

## Support & Documentation

- **tRPC Documentation**: https://trpc.io
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Drizzle ORM**: https://orm.drizzle.team

## License

This project is provided as-is for educational and commercial use.

---

**Last Updated**: July 2026
**Version**: 1.0.0
