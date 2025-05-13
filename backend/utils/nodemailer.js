const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASS
  }
});

const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Verify Your Kashmir Handicrafts Account',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #4a3000;">
        <!-- Header with brand colors -->
        <div style="background-color: #78350f; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: #fef3c7; margin: 0; font-size: 24px; font-weight: bold;">Kashmir Handicrafts</h1>
          <p style="color: #fef3c7; margin-top: 5px; font-style: italic;">Authentic Craftsmanship</p>
        </div>
        
        <!-- Main content -->
        <div style="background-color: #fffbeb; padding: 30px; border-left: 1px solid #d6aa68; border-right: 1px solid #d6aa68;">
          <h2 style="color: #78350f; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #78350f; font-size: 16px; line-height: 1.5;">Thank you for creating your Kashmir Handicrafts account. To complete your registration and explore our collection of authentic Kashmiri artisanal products, please enter the following verification code:</p>
          
          <!-- OTP Box -->
          <div style="background-color: #78350f; margin: 30px auto; padding: 15px; border-radius: 12px; text-align: center; width: 200px; box-shadow: 0 4px 8px rgba(120, 53, 15, 0.2);">
            <h2 style="margin: 0; color: #fef3c7; letter-spacing: 5px; font-size: 32px; font-family: 'Courier New', monospace;">${otp}</h2>
          </div>
          
          <p style="color: #78350f; font-size: 16px; line-height: 1.5;">This verification code will expire in <strong>10 minutes</strong>.</p>
          
          <p style="color: #78350f; font-size: 16px; line-height: 1.5;">If you did not create an account with Kashmir Handicrafts, please disregard this email.</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #92400e; color: #fef3c7; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kashmir Handicrafts. All rights reserved.</p>
          <p style="margin: 5px 0;">This is an automated message, please do not reply.</p>
        </div>
      </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    
    return {
      success: true,
      messageId: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: 'Error sending email'
    };
  }
};

module.exports={
  sendOtpEmail
}