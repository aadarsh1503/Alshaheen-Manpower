# Internship Management System

## Overview
Complete internship registration and management system for GVS with public application form and admin panel.

## Features Implemented

### Public Internship Form (`/internship`)
- Professional design matching GVS branding
- Same color theme as MultiStepForm (Red: #FF0000)
- GVS logo integration
- No authentication required
- File upload (Resume - PDF/Images, max 1MB)
  - PDFs uploaded to ImageKit
  - Images uploaded to Cloudinary
- Form fields:
  - Personal Info: Name, Email, Mobile, DOB, Gender, Place
  - Education: Qualification, University, Department
  - Internship Details: Coordinator, Hours, Joining Date
  - Disability Information (optional)
  - Resume Upload (required)
- Email confirmation sent to applicant from no-reply@gvs-bh.com
- Reply-to set as info@gvs-bh.com

### Admin Panel (`/admin/internships`)
- Protected route (requires authentication)
- View all internship applications
- Advanced filtering:
  - Stage (Applied, Interview, Accepted, Rejected, Completion, Certification)
  - Department (IT, Finance, Admin, HR, Marketing, Operations)
  - Month & Year
  - University (search)
- Stage management:
  - Update application stage via dropdown
  - Automatic stage progression
- Interview invitation system:
  - Send email with interview details
  - Specify venue, date, and time
  - Email sent from no-reply@gvs-bh.com
  - Reply-to: info@gvs-bh.com
  - Automatically moves stage to "Interview"
- WhatsApp integration:
  - Direct WhatsApp button for each applicant
- Export functionality:
  - Export filtered data to CSV/Excel
  - Includes all application details and resume links
- Detailed view modal:
  - View complete application details
  - Access resume link

## Database Schema
Table: `internship_applications`
- Personal information fields
- Education and internship details
- Stage tracking
- Interview scheduling fields
- Timestamps and indexes

## API Endpoints

### Public Routes
- `POST /api/internships/submit` - Submit internship application (with file upload)

### Admin Routes (Protected)
- `GET /api/internships/applications` - Get all applications (with filters)
- `PATCH /api/internships/applications/:id/stage` - Update application stage
- `POST /api/internships/applications/:id/interview` - Send interview invitation
- `DELETE /api/internships/applications/:id` - Delete application
- `GET /api/internships/export` - Export applications to CSV

## Email Configuration
Uses SMTP credentials from .env:
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_USER
- EMAIL_PASS

Emails sent from: no-reply@gvs-bh.com
Reply-to: info@gvs-bh.com

## File Upload Configuration
- Cloudinary (for images): CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- ImageKit (for PDFs): IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT
- Max file size: 1MB

## Workflow
1. Intern applies through public form (`/internship`)
2. Application stored with stage "Applied"
3. Confirmation email sent to applicant
4. Admin reviews applications in admin panel
5. Admin can:
   - Filter and search applications
   - Send interview invitations (moves to "Interview" stage)
   - Update stages: Accepted/Rejected
   - Mark as Completion or Certification
   - Contact via WhatsApp
   - Export data
6. All email communications allow intern to reply to info@gvs-bh.com

## Stage Flow
Applied → Interview → Accepted/Rejected → Completion → Certification

## Files Created/Modified

### Backend
- `server/database/internship_schema.sql` - Database schema
- `server/controllers/internshipController.js` - Controller logic
- `server/routes/internshipRoutes.js` - API routes
- `server/index.js` - Added internship routes

### Frontend
- `client/src/components/InternshipForm/InternshipForm.jsx` - Public form
- `client/src/components/Admin/InternshipManager.jsx` - Admin panel
- `client/src/App.jsx` - Added routes

## Setup Instructions

1. Run the SQL schema:
   ```sql
   source server/database/internship_schema.sql
   ```

2. Ensure environment variables are set in server/.env

3. Access points:
   - Public form: http://localhost:5173/internship
   - Admin panel: http://localhost:5173/admin/internships (requires login)

## Notes
- All stages are tracked with timestamps
- Resume URLs are stored for easy access
- Filters persist during session
- Export includes all visible filtered data
- WhatsApp integration uses international format
