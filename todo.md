# Project TODO

## Core Features
- [x] Implement user roles (Candidate/Recruiter) and role-based access control
- [x] Implement Recruiter dashboard for job posting management (create, edit, view)
- [x] Implement Candidate job listing page with search and filter functionality
- [x] Implement Resume upload for candidates (PDF/DOC) to S3-compatible storage
- [x] Implement Candidate application flow with resume attachment and cover note
- [x] Implement Recruiter applicant tracking (view applications, resume download link, status)
- [x] Implement Application status management by Recruiters (New, Reviewed, Shortlisted, Rejected)
- [x] Implement Candidate portal to view submitted applications and their statuses
- [x] Implement Email notifications for application status changes

## Style & Polish
- [x] Refined typography
- [x] Clean layouts
- [x] Polished UI components
- [x] Premium look and feel

## Technical Details
- [x] Database schema design for all entities (users, jobs, applications, resumes)
- [x] Backend API endpoints for all features
- [x] Frontend UI components and pages for all features
- [x] S3 integration for secure resume storage and serving download links
- [x] Email service integration for notifications
- [x] End-to-end testing
- [x] VS Code setup instructions and project packaging


## Phase 2: Enhanced Features

### Real-time Filtering & Sorting
- [ ] Add salary range field to jobs table
- [ ] Implement advanced filter UI component with salary slider
- [ ] Add real-time sorting options (newest, salary high-to-low, relevance)
- [ ] Implement filter state persistence in URL params
- [ ] Add filter count badge to UI

### AI Resume Parsing
- [ ] Integrate LLM for resume text extraction
- [ ] Create resume parsing procedure in tRPC
- [ ] Extract skills, experience, education from resume
- [ ] Store parsed data in database
- [ ] Display parsed skills in candidate profile
- [ ] Auto-match candidate skills with job requirements

### Reusable Skill Creation
- [ ] Initialize job-board-ats skill with skill-creator
- [ ] Document workflow and best practices
- [ ] Create templates for quick setup
- [ ] Package skill for distribution
