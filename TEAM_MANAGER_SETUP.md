# Team Manager Setup Instructions

## Database Setup

Run the following SQL script to create the team_members table:

```sql
-- Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default team members (update image paths as needed)
INSERT INTO team_members (name, role, image_url, display_order, is_active) VALUES
('RIYADH SHAHEEN', 'MANAGING DIRECTOR', '/team/riyadh.png', 1, TRUE),
('MARIA BERNADETH CASTRO', 'ADMINISTRATOR', '/team/maria.png', 2, TRUE),
('ASMAN RAHIM', 'TECHNOLOGY OFFICER', '/team/asman.png', 3, TRUE),
('SHAMEEMUDHEEN KANNAMPURATH VALAPPIL', 'HRM SALES EXECUTIVE', '/team/shameemudheen.png', 4, TRUE),
('MARICRIS ANGELES', 'ACCOUNTANT', '/team/maricris.png', 5, TRUE);
```

## Features Implemented

### Admin Panel - Team Manager
- **Location**: Admin Panel → Team Manager (sidebar)
- **Route**: `/admin/team`

### Functionality:
1. **View All Team Members**: Grid view with images, names, roles, and display order
2. **Add New Member**: Upload image, set name, role, display order, and active status
3. **Edit Member**: Update any member details including image
4. **Delete Member**: Remove team member with confirmation
5. **Toggle Active Status**: Show/hide members on public website
6. **Display Order**: Control the order members appear on the website

### Public Website - Team Section
- **Location**: About Us page
- **Automatically fetches active team members from database**
- **Displays in order specified by display_order field**
- **Removed hardcoded team member (Shanika Dilhani)**

## API Endpoints

### Public Routes:
- `GET /api/team/public` - Get all active team members

### Admin Routes (require authentication):
- `GET /api/team/admin` - Get all team members (including inactive)
- `POST /api/team/admin` - Add new team member (with image upload)
- `PUT /api/team/admin/:id` - Update team member
- `DELETE /api/team/admin/:id` - Delete team member

## File Structure

### Backend:
- `server/database/team_schema.sql` - Database schema
- `server/controllers/teamController.js` - Team management logic
- `server/routes/teamRoutes.js` - API routes
- `server/index.js` - Updated with team routes

### Frontend:
- `client/src/components/Admin/TeamManager.jsx` - Admin management interface
- `client/src/components/Admin/AdminLayout.jsx` - Updated sidebar with Team Manager
- `client/src/components/About/TheTeam.jsx` - Updated to fetch from API
- `client/src/App.jsx` - Added Team Manager route

## Image Upload

Team member images are stored in `server/uploads/team/` directory.
The directory is automatically created when the first image is uploaded.

## Notes

- Images are limited to 5MB
- Supported formats: JPEG, JPG, PNG, GIF
- Display order determines the sequence on the website
- Inactive members are hidden from public view but visible in admin panel
- Deleting a member also removes their uploaded image file
