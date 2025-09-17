const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Email templates
const emailTemplates = {
  confirmation: (data) => ({
    subject: 'Please confirm your email subscription',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to EduTech!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          <p>Thank you for subscribing to our ${data.subscriptionType} updates!</p>
          <p>Please click the button below to confirm your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/api/emails/confirm/${data.token}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Confirm Email
            </a>
          </div>
          <p>If you didn't subscribe to our emails, you can safely ignore this message.</p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      Thank you for subscribing to our ${data.subscriptionType} updates!
      
      Please confirm your email by visiting: ${process.env.CLIENT_URL}/api/emails/confirm/${data.token}
      
      If you didn't subscribe to our emails, you can safely ignore this message.
      
      Best regards,
      EduTech Team
    `
  }),

  welcome: (data) => ({
    subject: 'Welcome to EduTech Community!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to EduTech!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          <p>Your email has been confirmed successfully! Welcome to our community of learners.</p>
          <p>Here's what you can expect from us:</p>
          <ul style="line-height: 1.8;">
            <li>📚 Course updates and new releases</li>
            <li>💡 Learning tips and resources</li>
            <li>🎓 Industry insights from experts</li>
            <li>🔥 Exclusive offers and discounts</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/courses" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Browse Courses
            </a>
          </div>
          <p>Happy learning!</p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
          <p><a href="${process.env.CLIENT_URL}/unsubscribe?email=${data.email}" style="color: #a0aec0;">Unsubscribe</a></p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      Your email has been confirmed successfully! Welcome to our community of learners.
      
      Here's what you can expect from us:
      - Course updates and new releases
      - Learning tips and resources
      - Industry insights from experts
      - Exclusive offers and discounts
      
      Browse our courses: ${process.env.CLIENT_URL}/courses
      
      Happy learning!
      EduTech Team
    `
  }),

  enrollmentConfirmation: (data) => ({
    subject: `Welcome to ${data.courseName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Enrollment Confirmed!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          <p>Congratulations! You've successfully enrolled in <strong>${data.courseName}</strong>.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0;">Enrollment Details:</h3>
            <p><strong>Course:</strong> ${data.courseName}</p>
            <p><strong>Enrollment ID:</strong> ${data.enrollmentId}</p>
            <p><strong>Amount Paid:</strong> ${data.amount}</p>
          </div>
          <p>You can start learning right away by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.accessUrl}" 
               style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Learning
            </a>
          </div>
          <p>Need help? Contact our support team anytime.</p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      Congratulations! You've successfully enrolled in ${data.courseName}.
      
      Enrollment Details:
      - Course: ${data.courseName}
      - Enrollment ID: ${data.enrollmentId}
      - Amount Paid: ${data.amount}
      
      Start learning: ${data.accessUrl}
      
      Need help? Contact our support team anytime.
      
      Best regards,
      EduTech Team
    `
  }),

  courseNotification: (data) => ({
    subject: `🚀 ${data.courseName} is now available!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Course Launch Alert!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          <p>Great news! The course you were waiting for is now available:</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <h3 style="margin-top: 0; color: #1a202c;">${data.courseName}</h3>
            <p style="color: #64748b;">${data.courseDescription}</p>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span><strong>Duration:</strong> ${data.duration}</span>
              <span><strong>Level:</strong> ${data.level}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span><strong>Instructor:</strong> ${data.instructorName}</span>
              <span style="color: #10b981; font-weight: bold;"><strong>Price:</strong> ${data.price}</span>
            </div>
          </div>
          ${data.earlyBirdOffer ? `
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400e;"><strong>🎉 Early Bird Special:</strong> Enroll in the next 48 hours and save 30%!</p>
            </div>
          ` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.enrollUrl}" 
               style="background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Enroll Now
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">Don't want these notifications? <a href="${data.unsubscribeUrl}">Unsubscribe here</a></p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      Great news! The course you were waiting for is now available:
      
      ${data.courseName}
      ${data.courseDescription}
      
      Duration: ${data.duration}
      Level: ${data.level}
      Instructor: ${data.instructorName}
      Price: ${data.price}
      
      ${data.earlyBirdOffer ? 'Early Bird Special: Enroll in the next 48 hours and save 30%!' : ''}
      
      Enroll now: ${data.enrollUrl}
      
      Don't want these notifications? Unsubscribe: ${data.unsubscribeUrl}
      
      Best regards,
      EduTech Team
    `
  }),

  certificate: (data) => ({
    subject: `🎓 Your ${data.courseName} Certificate is Ready!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎓 Congratulations!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          <p>Congratulations on completing <strong>${data.courseName}</strong>!</p>
          <p>Your dedication and hard work have paid off. You can now download your certificate of completion.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8b5cf6; text-align: center;">
            <h3 style="margin-top: 0;">Certificate Details</h3>
            <p><strong>Course:</strong> ${data.courseName}</p>
            <p><strong>Certificate ID:</strong> ${data.certificateId}</p>
            <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.downloadUrl}" 
               style="background: #8b5cf6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download Certificate
            </a>
          </div>
          <p>Share your achievement on social media and inspire others to start their learning journey!</p>
          <p>Keep learning and growing with us. Check out our other courses to continue your education.</p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      Congratulations on completing ${data.courseName}!
      
      Your dedication and hard work have paid off. You can now download your certificate of completion.
      
      Certificate Details:
      - Course: ${data.courseName}
      - Certificate ID: ${data.certificateId}
      - Completion Date: ${new Date().toLocaleDateString()}
      
      Download your certificate: ${data.downloadUrl}
      
      Share your achievement and keep learning with us!
      
      Best regards,
      EduTech Team
    `
  }),

  newsletter: (data) => ({
    subject: data.subject || 'EduTech Newsletter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">EduTech Newsletter</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8fafc;">
          <h2>Hi ${data.firstName},</h2>
          ${data.content || '<p>Thank you for being part of our learning community!</p>'}
          
          ${data.featuredCourse ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <h3 style="margin-top: 0;">Featured Course</h3>
              <h4>${data.featuredCourse.title}</h4>
              <p>${data.featuredCourse.description}</p>
              <a href="${data.featuredCourse.url}" style="color: #667eea;">Learn More →</a>
            </div>
          ` : ''}
          
          ${data.tips ? `
            <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0369a1;">💡 Learning Tip</h3>
              <p style="margin-bottom: 0;">${data.tips}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/courses" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Explore Courses
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b;">
            Don't want to receive our newsletter? 
            <a href="${process.env.CLIENT_URL}/unsubscribe?email=${data.email}">Unsubscribe here</a>
          </p>
        </div>
        <div style="background: #1a202c; color: #a0aec0; padding: 20px; text-align: center; font-size: 14px;">
          <p>&copy; 2025 EduTech. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hi ${data.firstName},
      
      ${data.content || 'Thank you for being part of our learning community!'}
      
      ${data.featuredCourse ? `
        Featured Course: ${data.featuredCourse.title}
        ${data.featuredCourse.description}
        Learn More: ${data.featuredCourse.url}
      ` : ''}
      
      ${data.tips ? `Learning Tip: ${data.tips}` : ''}
      
      Explore Courses: ${process.env.CLIENT_URL}/courses
      
      Don't want to receive our newsletter? Unsubscribe: ${process.env.CLIENT_URL}/unsubscribe?email=${data.email}
      
      Best regards,
      EduTech Team
    `
  })
};

// Email service functions
const sendConfirmationEmail = async (email, token, data) => {
  const transporter = createTransporter();
  const template = emailTemplates.confirmation({ ...data, token });
  
  const trackingId = Buffer.from(`${email}|confirmation`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

const sendWelcomeEmail = async (email, data) => {
  const transporter = createTransporter();
  const template = emailTemplates.welcome({ ...data, email });
  
  const trackingId = Buffer.from(`${email}|welcome`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

const sendEnrollmentConfirmation = async (email, data) => {
  const transporter = createTransporter();
  const template = emailTemplates.enrollmentConfirmation(data);
  
  const trackingId = Buffer.from(`${email}|enrollment`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

const sendCourseNotification = async (email, data) => {
  const transporter = createTransporter();
  const unsubscribeUrl = `${process.env.API_URL}/api/emails/unsubscribe?email=${email}`;
  const template = emailTemplates.courseNotification({ ...data, unsubscribeUrl });
  
  const trackingId = Buffer.from(`${email}|course_notification`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

const sendCertificate = async (email, data) => {
  const transporter = createTransporter();
  const template = emailTemplates.certificate(data);
  
  const trackingId = Buffer.from(`${email}|certificate`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

const sendNewsletter = async (email, data) => {
  const transporter = createTransporter();
  const template = emailTemplates.newsletter({ ...data, email });
  
  const trackingId = Buffer.from(`${email}|newsletter`).toString('base64');
  const trackingPixel = `<img src="${process.env.API_URL}/api/emails/track/open/${trackingId}" width="1" height="1" style="display:none;">`;
  
  await transporter.sendMail({
    from: `"EduTech" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: template.subject,
    html: template.html + trackingPixel,
    text: template.text
  });
};

// Bulk email function
const sendBulkEmails = async (emails, templateType, data) => {
  const transporter = createTransporter();
  const results = [];
  
  for (const email of emails) {
    try {
      switch (templateType) {
        case 'newsletter':
          await sendNewsletter(email, data);
          break;
        case 'course_notification':
          await sendCourseNotification(email, data);
          break;
        default:
          throw new Error('Invalid template type');
      }
      results.push({ email, status: 'sent' });
    } catch (error) {
      console.error(`Failed to send email to ${email}:`, error);
      results.push({ email, status: 'failed', error: error.message });
    }
  }
  
  return results;
};

module.exports = {
  sendConfirmationEmail,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendCourseNotification,
  sendCertificate,
  sendNewsletter,
  sendBulkEmails,
  emailTemplates
};