const pool = require('../config/db');
const cloudinary = require('cloudinary').v2;
const ImageKit = require('imagekit');
const { SESClient, SendEmailCommand, SendRawEmailCommand } = require('@aws-sdk/client-ses');
const axios = require('axios');

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

// Helper function to send email via AWS SES with attachments
const sendEmailViaSES = async (to, subject, htmlBody, attachments = []) => {
  console.log('📧 Sending email to:', to);
  console.log('📎 Attachments:', attachments.length);
  
  // If no attachments, use simple email
  if (!attachments || attachments.length === 0) {
    console.log('✉️  Sending simple email without attachments');
    const params = {
      Source: `"${process.env.AWS_SES_FROM_NAME}" <${process.env.AWS_SES_FROM_EMAIL}>`,
      Destination: {
        ToAddresses: [to]
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
      }
    };

    const command = new SendEmailCommand(params);
    return await sesClient.send(command);
  }

  // With attachments, use raw email format
  console.log('📎 Sending email with attachments using raw format');
  const boundary = `----=_Part_${Date.now()}`;
  const fromEmail = `"${process.env.AWS_SES_FROM_NAME}" <${process.env.AWS_SES_FROM_EMAIL}>`;
  
  let rawMessage = [
    `From: ${fromEmail}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody,
    ``
  ].join('\r\n');

  // Add attachments
  for (const attachment of attachments) {
    try {
      console.log('⬇️  Downloading attachment from:', attachment.url);
      
      // Download file from URL
      const response = await axios.get(attachment.url, { 
        responseType: 'arraybuffer',
        timeout: 30000 // 30 second timeout
      });
      
      const fileBuffer = Buffer.from(response.data);
      const base64Content = fileBuffer.toString('base64');
      
      console.log('✅ Downloaded attachment, size:', fileBuffer.length, 'bytes');
      
      // Determine content type
      const contentType = attachment.contentType || 'application/pdf';
      const filename = attachment.filename || 'certificate.pdf';

      console.log('📎 Adding attachment:', filename, 'type:', contentType);

      rawMessage += [
        `--${boundary}`,
        `Content-Type: ${contentType}; name="${filename}"`,
        `Content-Transfer-Encoding: base64`,
        `Content-Disposition: attachment; filename="${filename}"`,
        ``,
        base64Content,
        ``
      ].join('\r\n');
      
      console.log('✅ Attachment added to email');
    } catch (error) {
      console.error('❌ Error downloading attachment:', error.message);
      console.error('❌ Attachment URL:', attachment.url);
      throw new Error(`Failed to download attachment: ${error.message}`);
    }
  }

  rawMessage += `--${boundary}--`;

  console.log('📧 Sending raw email with', attachments.length, 'attachment(s)');

  const params = {
    RawMessage: {
      Data: Buffer.from(rawMessage)
    }
  };

  const command = new SendRawEmailCommand(params);
  const result = await sesClient.send(command);
  
  console.log('✅ Email sent successfully with attachments');
  return result;
};

// Generate email template based on stage
const generateEmailTemplate = (stage, applicant, customData = {}) => {
  const { date, time, venue, customMessage } = customData;
  
  const emailHeader = `
    <div style="background: #0284C7; padding: 40px 20px; text-align: center;">
      <div style="background: white; display: inline-block; padding: 15px 30px; border-radius: 10px; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
             alt="GVS Logo" style="max-width: 180px; height: auto; display: block;">
      </div>
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">GVS Internship Program</h1>
    </div>
  `;

  const emailFooter = `
    <div style="background-color: #000000; color: white; padding: 30px 20px; text-align: center; margin-top: 40px;">
      <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Global Vision Solutions</p>
      <p style="margin: 0; font-size: 14px; color: #9CA3AF;">Building Future Leaders</p>
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333;">
        <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
          © ${new Date().getFullYear()} Global Vision Solutions. All rights reserved.
        </p>
      </div>
    </div>
  `;
  
  const templates = {
    'Interview': {
      subject: 'Interview Invitation - GVS Internship Program',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            ${emailHeader}
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                🎉 Congratulations, ${applicant.name}!
              </h2>
              
              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We are pleased to inform you that your application for the internship position in the 
                <strong style="color: #0284C7;">${applicant.department}</strong> department has been shortlisted.
              </p>
              
              <div style="background: #F0F9FF; border-left: 4px solid #0284C7; padding: 25px; border-radius: 8px; margin: 30px 0;">
                <h3 style="color: #0284C7; margin: 0 0 15px 0; font-size: 20px; font-weight: 700;">
                  📅 Interview Details
                </h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #000000; font-weight: 600; width: 100px;">Date:</td>
                    <td style="padding: 8px 0; color: #000000;">${date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '[Date]'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000000; font-weight: 600;">Time:</td>
                    <td style="padding: 8px 0; color: #000000;">${time || '[Time]'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #000000; font-weight: 600;">Venue:</td>
                    <td style="padding: 8px 0; color: #000000;">${venue || '[Venue]'}</td>
                  </tr>
                </table>
              </div>

              ${customMessage ? `
                <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">${customMessage}</p>
                </div>
              ` : ''}

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Please confirm your attendance by replying to this email.
              </p>

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                We look forward to meeting you!
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                <p style="color: #000000; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #0284C7;">GVS Internship Team</strong>
                </p>
              </div>
            </div>

            ${emailFooter}
          </div>
        </body>
        </html>
      `
    },
    'Accepted': {
      subject: 'Congratulations! Internship Offer - GVS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            ${emailHeader}
            
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: #0284C7; color: white; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 700;">
                  ✨ YOU'RE SELECTED! ✨
                </div>
              </div>

              <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                Dear ${applicant.name},
              </h2>
              
              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We are delighted to inform you that you have been <strong style="color: #0284C7;">selected</strong> for the internship position in the 
                <strong style="color: #0284C7;">${applicant.department}</strong> department at Global Vision Solutions.
              </p>

              ${customMessage ? `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">${customMessage}</p>
                </div>
              ` : `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">
                    Further details regarding your joining date and onboarding process will be shared with you shortly.
                  </p>
                </div>
              `}

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                We look forward to having you on our team!
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                <p style="color: #000000; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #0284C7;">GVS Internship Team</strong>
                </p>
              </div>
            </div>

            ${emailFooter}
          </div>
        </body>
        </html>
      `
    },
    'Rejected': {
      subject: 'Update on Your Internship Application - GVS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            ${emailHeader}
            
            <div style="padding: 40px 30px;">
              <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                Dear ${applicant.name},
              </h2>
              
              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for your interest in the internship position at Global Vision Solutions and for taking the time to apply.
              </p>

              ${customMessage ? `
                <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">${customMessage}</p>
                </div>
              ` : `
                <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                  After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.
                </p>
              `}

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                We appreciate your interest in GVS and wish you all the best in your future endeavors.
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                <p style="color: #000000; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #0284C7;">GVS Internship Team</strong>
                </p>
              </div>
            </div>

            ${emailFooter}
          </div>
        </body>
        </html>
      `
    },
    'Completion': {
      subject: 'Internship Completion - GVS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            ${emailHeader}
            
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #0284C7 0%, #0284C7 100%); color: white; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 700;">
                  🎓 CONGRATULATIONS! 🎓
                </div>
              </div>

              <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                Dear ${applicant.name},
              </h2>
              
              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Congratulations on successfully completing your internship with GVS in the 
                <strong style="color: #0284C7;">${applicant.department}</strong> department!
              </p>

              ${customMessage ? `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">${customMessage}</p>
                </div>
              ` : `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">
                    We appreciate your hard work and dedication during your time with us.
                  </p>
                </div>
              `}

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                We wish you all the best in your future career!
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                <p style="color: #000000; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #0284C7;">GVS Internship Team</strong>
                </p>
              </div>
            </div>

            ${emailFooter}
          </div>
        </body>
        </html>
      `
    },
    'Certification': {
      subject: 'Your Internship Certificate - GVS',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            ${emailHeader}
            
            <div style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; background: linear-gradient(135deg, #0284C7 0%, #0284C7 100%); color: white; padding: 15px 30px; border-radius: 50px; font-size: 18px; font-weight: 700;">
                  📜 CERTIFICATE ATTACHED 📜
                </div>
              </div>

              <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                Dear ${applicant.name},
              </h2>
              
              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Please find attached your internship completion certificate for your successful completion of the internship program at Global Vision Solutions.
              </p>

              ${customMessage ? `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">${customMessage}</p>
                </div>
              ` : `
                <div style="background-color: #F0F9FF; border-left: 4px solid #0284C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #000000; font-size: 15px; line-height: 1.6; margin: 0;">
                    We are proud of your achievements and wish you continued success in your career.
                  </p>
                </div>
              `}

              <p style="color: #000000; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
                Thank you for being a part of GVS!
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                <p style="color: #000000; font-size: 14px; margin: 0;">
                  Best regards,<br>
                  <strong style="color: #0284C7;">GVS Internship Team</strong>
                </p>
              </div>
            </div>

            ${emailFooter}
          </div>
        </body>
        </html>
      `
    }
  };

  return templates[stage] || templates['Accepted'];
};

// Send email with stage update
exports.sendStageUpdateEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      stage, 
      subject, 
      emailContent, 
      date, 
      time, 
      venue,
      certificateUrl,
      certificateFilename,
      certificateContentType
    } = req.body;

    console.log('Stage update email request:', { id, stage, subject, date, time, venue });

    // Validate required fields based on stage
    if (stage === 'Interview') {
      if (!date || !time || !venue) {
        return res.status(400).json({
          success: false,
          message: 'Date, time, and venue are required for interview stage'
        });
      }
    }

    if (stage === 'Certification' && !certificateUrl) {
      return res.status(400).json({
        success: false,
        message: 'Certificate document is required for certification stage'
      });
    }

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

    // Normalize stage to title case for template lookup
    const normalizedStageForTemplate = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();

    // Generate email template (always use HTML template)
    const template = generateEmailTemplate(normalizedStageForTemplate, applicant, {
      date,
      time,
      venue,
      customMessage: emailContent
    });

    // Prepare attachments for certification stage
    const attachments = [];
    if (stage.toUpperCase() === 'CERTIFICATION' && certificateUrl) {
      console.log('📎 Adding certificate attachment:', certificateUrl);
      console.log('📄 Original filename:', certificateFilename);
      console.log('📋 Content type:', certificateContentType);
      
      attachments.push({
        url: certificateUrl,
        filename: certificateFilename || 'certificate.pdf',
        contentType: certificateContentType || 'application/pdf'
      });
    } else if (stage.toUpperCase() === 'CERTIFICATION' && !certificateUrl) {
      console.warn('⚠️  Certification stage but no certificate URL provided');
    }

    // Send email via AWS SES (always use HTML template)
    await sendEmailViaSES(
      applicant.email,
      subject || template.subject,
      template.html,
      attachments
    );

    // Update stage in database
    const normalizedStage = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
    
    await pool.query(
      'UPDATE internship_applications SET stage = ?, interview_date = ?, interview_time = ?, interview_venue = ? WHERE id = ?',
      [normalizedStage, date || null, time || null, venue || null, id]
    );

    // Log email sent
    await pool.query(
      'INSERT INTO internship_email_logs (application_id, stage, subject, sent_at) VALUES (?, ?, ?, NOW())',
      [id, stage, subject || template.subject]
    );

    res.status(200).json({
      success: true,
      message: 'Email sent and stage updated successfully'
    });

  } catch (error) {
    console.error('Error sending stage update email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

// Bulk email send
exports.sendBulkStageUpdateEmail = async (req, res) => {
  try {
    const { 
      applicationIds, 
      stage, 
      subject, 
      emailContent, 
      date, 
      time, 
      venue,
      certificateUrl,
      certificateFilename,
      certificateContentType
    } = req.body;

    console.log('Bulk email request:', { applicationIds, stage });

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No applications selected'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const id of applicationIds) {
      try {
        // Get applicant details
        const [applications] = await pool.query(
          'SELECT * FROM internship_applications WHERE id = ?',
          [id]
        );

        if (applications.length === 0) {
          results.failed.push({ id, reason: 'Application not found' });
          continue;
        }

        const applicant = applications[0];

        // Normalize stage to title case for template lookup
        const normalizedStageForTemplate = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();

        // Generate email template (always use HTML)
        const template = generateEmailTemplate(normalizedStageForTemplate, applicant, {
          date,
          time,
          venue,
          customMessage: emailContent
        });

        // Prepare attachments for certification stage
        const attachments = [];
        if (stage.toUpperCase() === 'CERTIFICATION' && certificateUrl) {
          console.log('📎 Adding certificate attachment for bulk email:', certificateUrl);
          console.log('📄 Original filename:', certificateFilename);
          
          attachments.push({
            url: certificateUrl,
            filename: certificateFilename || 'certificate.pdf',
            contentType: certificateContentType || 'application/pdf'
          });
        } else if (stage.toUpperCase() === 'CERTIFICATION' && !certificateUrl) {
          console.warn('⚠️  Certification stage but no certificate URL provided for:', applicant.name);
        }

        // Send email via AWS SES (always use HTML template)
        await sendEmailViaSES(
          applicant.email,
          subject || template.subject,
          template.html,
          attachments
        );

        // Update stage
        const normalizedStage = stage.charAt(0).toUpperCase() + stage.slice(1).toLowerCase();
        
        await pool.query(
          'UPDATE internship_applications SET stage = ?, interview_date = ?, interview_time = ?, interview_venue = ? WHERE id = ?',
          [normalizedStage, date || null, time || null, venue || null, id]
        );

        // Log email
        await pool.query(
          'INSERT INTO internship_email_logs (application_id, stage, subject, sent_at) VALUES (?, ?, ?, NOW())',
          [id, stage, subject || template.subject]
        );

        results.success.push(id);

      } catch (error) {
        console.error(`Failed to send email to application ${id}:`, error);
        results.failed.push({ id, reason: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Emails sent: ${results.success.length} successful, ${results.failed.length} failed`,
      results
    });

  } catch (error) {
    console.error('Error in bulk email send:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails',
      error: error.message
    });
  }
};

// Upload certificate
exports.uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileBuffer = req.file.buffer;
    const originalName = req.file.originalname;
    const mimeType = req.file.mimetype;
    const fileName = `certificates/${Date.now()}_${originalName}`;

    console.log('📤 Uploading certificate:', originalName, 'Type:', mimeType);

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileBuffer.toString('base64'),
      fileName: fileName,
      folder: '/internship_certificates'
    });

    console.log('✅ Certificate uploaded successfully:', uploadResult.url);

    res.status(200).json({
      success: true,
      url: uploadResult.url,
      filename: originalName,
      contentType: mimeType
    });

  } catch (error) {
    console.error('Error uploading certificate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload certificate',
      error: error.message
    });
  }
};

module.exports = exports;




// Send custom email
exports.sendCustomEmail = async (req, res) => {
  try {
    const { applicationIds, subject, message, attachmentUrl } = req.body;

    if (!applicationIds || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No applications selected'
      });
    }

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    const results = {
      success: [],
      failed: []
    };

    for (const id of applicationIds) {
      try {
        const [applications] = await pool.query(
          'SELECT * FROM internship_applications WHERE id = ?',
          [id]
        );

        if (applications.length === 0) {
          results.failed.push({ id, reason: 'Application not found' });
          continue;
        }

        const applicant = applications[0];

        // Create simple HTML email
        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #F3F4F6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white;">
              <div style="background: #0284C7; padding: 40px 20px; text-align: center;">
                <div style="background: white; display: inline-block; padding: 15px 30px; border-radius: 10px; margin-bottom: 20px;">
                  <img src="https://res.cloudinary.com/ds1dt3qub/image/upload/v1771333289/gvs-Il-kmUlQ-removebg-preview_p33n0j.png" 
                       alt="GVS Logo" style="max-width: 180px; height: auto; display: block;">
                </div>
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">GVS Internship Program</h1>
              </div>
              
              <div style="padding: 40px 30px;">
                <h2 style="color: #0284C7; margin: 0 0 20px 0; font-size: 24px; font-weight: 700;">
                  Dear ${applicant.name},
                </h2>
                
                <div style="color: #000000; font-size: 16px; line-height: 1.8; white-space: pre-wrap;">
                  ${message}
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F3F4F6;">
                  <p style="color: #000000; font-size: 14px; margin: 0;">
                    Best regards,<br>
                    <strong style="color: #0284C7;">GVS Internship Team</strong>
                  </p>
                </div>
              </div>

              <div style="background-color: #000000; color: white; padding: 30px 20px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Global Vision Solutions</p>
                <p style="margin: 0; font-size: 14px; color: #9CA3AF;">Building Future Leaders</p>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333;">
                  <p style="margin: 0; font-size: 12px; color: #9CA3AF;">
                    © ${new Date().getFullYear()} Global Vision Solutions. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;

        // Prepare attachments if URL provided
        const attachments = [];
        if (attachmentUrl) {
          attachments.push({
            url: attachmentUrl,
            filename: 'attachment.pdf',
            contentType: 'application/pdf'
          });
        }

        // Send email
        await sendEmailViaSES(
          applicant.email,
          subject,
          htmlBody,
          attachments
        );

        results.success.push(id);

      } catch (error) {
        console.error(`Failed to send email to application ${id}:`, error);
        results.failed.push({ id, reason: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: `Emails sent: ${results.success.length} successful, ${results.failed.length} failed`,
      results
    });

  } catch (error) {
    console.error('Error sending custom emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emails',
      error: error.message
    });
  }
};
