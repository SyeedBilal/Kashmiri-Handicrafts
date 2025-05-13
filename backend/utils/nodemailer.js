const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.GMAIL_USER,
    pass:process.env.GMAIL_PASS
  }
});


const sendOtpEmail=async (email,otp)=>{

try {
  const mailOptions={
    from: process.env.GMAIL_USER,
    to:email,
    html:`<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8e8e8; border-radius: 5px;">
          <h2 style="color: #333;">Verify Your Email</h2>
          <p>Thank you for registering with our service. To complete your registration, please use the following OTP:</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h3 style="margin: 0; color: #4a4a4a; letter-spacing: 5px; font-size: 24px;">${otp}</h3>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you did not request this OTP, please ignore this email.</p>
          <p style="margin-top: 30px; font-size: 12px; color: #777;">This is an automated email. Please do not reply.</p>
        </div>`


  };

  const info= await transporter.sendMail(mailOptions);

  console.log('Email sent: ' + info.response);

  return {
    success:true,
    messageId:'Email sent successfully'
  }
  
} catch (error) {
  console.error('Error sending email:', error);
  return {
    success:false,
    error:'Error sending email'
  }
  
}
}

module.exports={
  sendOtpEmail
}