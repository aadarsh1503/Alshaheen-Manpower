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
      
      if (isPdf) {
        // Upload PDF to ImageKit
        const uploadResult = await imagekit.upload({
          file: fileBuffer.toString('base64'),
          fileName: fileName,
          folder: '/internship_resumes'
        });
        resumeUrl = uploadResult.url;
      } else {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="background-color: #0284C7; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <div style="background-color: #ffffff; display: inline-block; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
                 alt="GVS Logo" style="width: 150px; display: block;">
          </div>
          <h2 style="color: #ffffff; margin: 0;">Thank You for Your Application!</h2>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff; color: #000000;">
          <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6;">We have received your internship application for the <strong style="color: #0284C7;">${department}</strong> department.</p>
          <p style="font-size: 16px; line-height: 1.6;">Our team will review your application and get back to you soon.</p>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #0284C7; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #000000;">
              <strong>Need Help?</strong><br>
              If you have any questions, please reply to this email at 
              <a href="mailto:info@gvs-bh.com" style="color: #0284C7; text-decoration: none;">info@gvs-bh.com</a>
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #0284C7;">GVS Internship Team</strong>
          </p>
        </div>
        
        <div style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Global Vision Solutions. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail(email, 'Internship Application Received - GVS', applicantEmailHtml);

    // Send notification email to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="background-color: #0284C7; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <div style="background-color: #ffffff; display: inline-block; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
                 alt="GVS Logo" style="width: 150px; display: block;">
          </div>
          <h2 style="color: #ffffff; margin: 0;">New Internship Application Received</h2>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff; color: #000000;">
          <div style="background-color: #f0f9ff; border: 2px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0284C7; margin-top: 0;">Applicant Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${name}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${email}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Mobile:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${mobile}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Date of Birth:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date(dob).toLocaleDateString()}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Gender:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${gender}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Qualification:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${qualification}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>University:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${university}</td></tr>
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Department:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #0284C7;">${department}</strong></td></tr>
              ${internship_coordinator ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Coordinator:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${internship_coordinator}</td></tr>` : ''}
              ${hours ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Hours:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${hours}</td></tr>` : ''}
              ${joining_date ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Joining Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date(joining_date).toLocaleDateString()}</td></tr>` : ''}
              ${place ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Place:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${place}</td></tr>` : ''}
              <tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Disability:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${disability}</td></tr>
              ${disability_type ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Disability Type:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${disability_type}</td></tr>` : ''}
              ${resumeUrl ? `<tr><td style="padding: 8px 0;"><strong>Resume:</strong></td><td style="padding: 8px 0;"><a href="${resumeUrl}" target="_blank" style="color: #0284C7; text-decoration: none;">View Resume</a></td></tr>` : ''}
            </table>
          </div>

          <div style="background-color: #000000; color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Application ID:</strong> ${result.insertId}</p>
            <p style="margin: 5px 0;"><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Please review this application in the admin panel.
          </p>
        </div>
        
        <div style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Global Vision Solutions. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail('aadarshchauhan35@gmail.com', `New Internship Application - ${name}`, adminEmailHtml);

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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <div style="background-color: #0284C7; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <div style="background-color: #ffffff; display: inline-block; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
                 alt="GVS Logo" style="width: 150px; display: block;">
          </div>
          <h2 style="color: #ffffff; margin: 0;">🎉 Congratulations! You're Invited for an Interview</h2>
        </div>
        
        <div style="padding: 30px; background-color: #ffffff; color: #000000;">
          <p style="font-size: 16px; line-height: 1.6;">Dear <strong>${applicant.name}</strong>,</p>
          <p style="font-size: 16px; line-height: 1.6;">
            We are pleased to inform you that your application for the internship position in the 
            <strong style="color: #0284C7;">${applicant.department}</strong> department has been shortlisted.
          </p>
          
          <div style="background-color: #f0f9ff; border: 2px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0284C7; margin-top: 0;">📅 Interview Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${new Date(interview_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Time:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${interview_time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Venue:</strong></td>
                <td style="padding: 10px 0;">${interview_venue}</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #000000; color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              ⚠️ <strong>Important:</strong> Please confirm your attendance by replying to this email at 
              <a href="mailto:info@gvs-bh.com" style="color: #0284C7; text-decoration: none;">info@gvs-bh.com</a>
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6;">We look forward to meeting you!</p>
          
          <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #0284C7;">GVS Internship Team</strong>
          </p>
        </div>
        
        <div style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
          <p style="margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Global Vision Solutions. All rights reserved.</p>
        </div>
      </div>
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
