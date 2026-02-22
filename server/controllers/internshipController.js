const pool = require('../config/db');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const cloudinary = require('cloudinary').v2;
const ImageKit = require('imagekit');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Configure AWS SES Client
const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Helper function to send email via AWS SES
async function sendEmail(to, subject, htmlBody) {
  const params = {
    Source: `${process.env.AWS_SES_FROM_NAME} <${process.env.AWS_SES_FROM_EMAIL}>`,
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to]
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8'
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8'
        }
      }
    },
    ReplyToAddresses: ['info@gvs-bh.com']
  };

  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
}

// Submit Internship Application (Public)
exports.submitInternshipApplication = async (req, res) => {
  try {
    const {
      name, email, mobile, dob, gender, qualification, university,
      department, internship_coordinator, hours, joining_date,
      disability, disability_type, place
    } = req.body;

    console.log('Received internship application:', {
      name, email, mobile, dob, gender, qualification, university,
      department, internship_coordinator, hours, joining_date,
      disability, disability_type, place
    });

    // Validate required fields
    if (!name || !email || !mobile || !dob || !gender || !qualification || 
        !university || !department) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill all required fields' 
      });
    }

    let resumeUrl = null;

    // Handle file upload
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const fileName = `internship_resumes/${Date.now()}_${req.file.originalname}`;
      
      // Check file type
      const isPdf = req.file.mimetype === 'application/pdf';
      const isDocx = req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                     req.file.mimetype === 'application/msword';
      const isImage = req.file.mimetype.startsWith('image/');
      
      if (isPdf || isDocx) {
        // Upload PDF/DOCX to ImageKit
        const uploadResult = await imagekit.upload({
          file: fileBuffer.toString('base64'),
          fileName: fileName,
          folder: '/internship_resumes'
        });
        resumeUrl = uploadResult.url;
      } else if (isImage) {
        // Upload image to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'internship_resumes' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });
        resumeUrl = uploadResult.secure_url;
      }
    }

    // Insert into database
    const [result] = await pool.query(
      `INSERT INTO internship_applications 
      (name, email, mobile, dob, gender, qualification, university, department, 
       internship_coordinator, hours, joining_date, disability, disability_type, 
       place, resume_url, stage) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Applied')`,
      [name, email, mobile, dob, gender, qualification, university, department,
       internship_coordinator || null, hours || null, joining_date || null,
       disability || 'No', disability_type || null, place || null, resumeUrl]
    );

    // Send confirmation email to applicant
    const applicantEmailHtml = `
      <p>Dear ${name},</p>
      
      <p>Thank you for applying for the internship position in the ${department} department at Global Vision Solutions.</p>
      
      <p>We have received your application and our team will review it shortly. We will contact you regarding the next steps.</p>
      
      <p>If you have any questions, please contact us at info@gvs-bh.com</p>
      
      <p>Best regards,<br>
      GVS Internship Team<br>
      Global Vision Solutions</p>
    `;

    await sendEmail(email, 'Internship Application Received - GVS', applicantEmailHtml);

    // Send notification email to admin
    const adminEmailHtml = `
      <p><strong>New Internship Application Received</strong></p>
      
      <p><strong>Applicant Details:</strong></p>
      <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
        <li>Mobile: ${mobile}</li>
        <li>Date of Birth: ${new Date(dob).toLocaleDateString()}</li>
        <li>Gender: ${gender}</li>
        <li>Qualification: ${qualification}</li>
        <li>University: ${university}</li>
        <li>Department: ${department}</li>
        ${internship_coordinator ? `<li>Coordinator: ${internship_coordinator}</li>` : ''}
        ${hours ? `<li>Hours: ${hours}</li>` : ''}
        ${joining_date ? `<li>Joining Date: ${new Date(joining_date).toLocaleDateString()}</li>` : ''}
        ${place ? `<li>Place: ${place}</li>` : ''}
        <li>Disability: ${disability}</li>
        ${disability_type ? `<li>Disability Type: ${disability_type}</li>` : ''}
        ${resumeUrl ? `<li>Resume: <a href="${resumeUrl}">View Resume</a></li>` : ''}
      </ul>
      
      <p><strong>Application ID:</strong> ${result.insertId}</p>
      <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      
      <p>Please review this application in the admin panel.</p>
    `;

    await sendEmail('info@alshaheen.pro', `New Internship Application - ${name}`, adminEmailHtml);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      applicationId: result.insertId
    });

  } catch (error) {
    console.error('Error submitting internship application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Get all internship applications (Admin)
exports.getInternshipApplications = async (req, res) => {
  try {
    const { stage, department, month, year, university } = req.query;
    
    let query = 'SELECT * FROM internship_applications WHERE 1=1';
    const params = [];

    if (stage) {
      query += ' AND stage = ?';
      params.push(stage);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    if (university) {
      query += ' AND university LIKE ?';
      params.push(`%${university}%`);
    }

    if (month && year) {
      query += ' AND MONTH(created_at) = ? AND YEAR(created_at) = ?';
      params.push(month, year);
    } else if (year) {
      query += ' AND YEAR(created_at) = ?';
      params.push(year);
    }

    query += ' ORDER BY created_at DESC';

    const [applications] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Error fetching internship applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Update application stage (Admin)
exports.updateApplicationStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage } = req.body;

    console.log('Received stage update request:', { id, stage });

    // Accept both uppercase and title case
    const validStages = ['Applied', 'Interview', 'Accepted', 'Rejected', 'Completion', 'Certification'];
    const validStagesUpper = ['APPLIED', 'INTERVIEW', 'ACCEPTED', 'REJECTED', 'COMPLETION', 'CERTIFICATION'];
    
    // Convert to title case if uppercase is sent
    let normalizedStage = stage;
    if (validStagesUpper.includes(stage)) {
      const index = validStagesUpper.indexOf(stage);
      normalizedStage = validStages[index];
    }
    
    console.log('Normalized stage:', normalizedStage);
    
    if (!validStages.includes(normalizedStage)) {
      console.log('Invalid stage detected');
      return res.status(400).json({
        success: false,
        message: 'Invalid stage'
      });
    }

    const [result] = await pool.query(
      'UPDATE internship_applications SET stage = ? WHERE id = ?',
      [normalizedStage, id]
    );

    console.log('Update result:', result);

    res.status(200).json({
      success: true,
      message: 'Stage updated successfully'
    });

  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update stage',
      error: error.message
    });
  }
};

// Send interview invitation (Admin)
exports.sendInterviewInvitation = async (req, res) => {
  try {
    const { id } = req.params;
    const { interview_date, interview_time, interview_venue } = req.body;

    // Get applicant details
    const [applications] = await pool.query(
      'SELECT * FROM internship_applications WHERE id = ?',
      [id]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const applicant = applications[0];

    // Update application with interview details and change stage
    await pool.query(
      `UPDATE internship_applications 
       SET interview_date = ?, interview_time = ?, interview_venue = ?, stage = 'Interview' 
       WHERE id = ?`,
      [interview_date, interview_time, interview_venue, id]
    );

    // Send interview invitation email
    const interviewEmailHtml = `
      <p>Dear ${applicant.name},</p>
      
      <p>Congratulations! Your application for the internship position in the ${applicant.department} department has been shortlisted.</p>
      
      <p><strong>Interview Details:</strong></p>
      <ul>
        <li>Date: ${new Date(interview_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
        <li>Time: ${interview_time}</li>
        <li>Venue: ${interview_venue}</li>
      </ul>
      
      <p>Please confirm your attendance by replying to this email at info@gvs-bh.com</p>
      
      <p>We look forward to meeting you!</p>
      
      <p>Best regards,<br>
      GVS Internship Team<br>
      Global Vision Solutions</p>
    `;

    await sendEmail(applicant.email, 'Interview Invitation - GVS Internship Program', interviewEmailHtml);

    res.status(200).json({
      success: true,
      message: 'Interview invitation sent successfully'
    });

  } catch (error) {
    console.error('Error sending interview invitation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation',
      error: error.message
    });
  }
};

// Delete application (Admin)
exports.deleteInternshipApplication = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM internship_applications WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    });
  }
};

// Bulk delete applications (Admin)
exports.bulkDeleteApplications = async (req, res) => {
  try {
    const { applicationIds } = req.body;

    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No application IDs provided'
      });
    }

    const placeholders = applicationIds.map(() => '?').join(',');
    const query = `DELETE FROM internship_applications WHERE id IN (${placeholders})`;
    
    const [result] = await pool.query(query, applicationIds);

    res.status(200).json({
      success: true,
      message: `${result.affectedRows} application(s) deleted successfully`,
      deletedCount: result.affectedRows
    });

  } catch (error) {
    console.error('Error bulk deleting applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete applications',
      error: error.message
    });
  }
};

// Export to Excel (Admin)
exports.exportToExcel = async (req, res) => {
  try {
    const { stage, department, month, year, university } = req.query;
    
    let query = 'SELECT * FROM internship_applications WHERE 1=1';
    const params = [];

    if (stage) {
      query += ' AND stage = ?';
      params.push(stage);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    if (university) {
      query += ' AND university LIKE ?';
      params.push(`%${university}%`);
    }

    if (month && year) {
      query += ' AND MONTH(created_at) = ? AND YEAR(created_at) = ?';
      params.push(month, year);
    } else if (year) {
      query += ' AND YEAR(created_at) = ?';
      params.push(year);
    }

    query += ' ORDER BY created_at DESC';

    const [applications] = await pool.query(query, params);

    // Convert to CSV
    const headers = [
      'ID', 'Name', 'Email', 'Mobile', 'DOB', 'Gender', 'Qualification',
      'University', 'Department', 'Coordinator', 'Hours', 'Joining Date',
      'Disability', 'Disability Type', 'Place', 'Resume URL', 'Stage',
      'Interview Date', 'Interview Time', 'Interview Venue', 'Created At'
    ];

    const csvRows = [headers.join(',')];

    applications.forEach(app => {
      const row = [
        app.id,
        `"${app.name}"`,
        app.email,
        app.mobile,
        app.dob ? new Date(app.dob).toLocaleDateString() : '',
        app.gender,
        `"${app.qualification}"`,
        `"${app.university}"`,
        app.department,
        app.internship_coordinator || '',
        app.hours || '',
        app.joining_date ? new Date(app.joining_date).toLocaleDateString() : '',
        app.disability,
        app.disability_type || '',
        app.place || '',
        app.resume_url || '',
        app.stage,
        app.interview_date ? new Date(app.interview_date).toLocaleString() : '',
        app.interview_time || '',
        app.interview_venue || '',
        new Date(app.created_at).toLocaleString()
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=internship_applications_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);

  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};
