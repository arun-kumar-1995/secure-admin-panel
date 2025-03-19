import nodemailer from 'nodemailer'

export const sendEmail = async (to, userOtp) => {
  try {
    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to, // Recipient email
      subject: 'Verify Otp', // Email subject
      text: `An OTP with a 6-digit code: ${userOtp}`, // Email body text
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
