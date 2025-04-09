import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
/**
 * Sends a verification email to the specified user.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} token - The unique verification token.
 */

const sendVerificationEmail = async (email, token, fullName) => {
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"Expense Tracker App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Expense Tracker App',
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px 30px; background-color: #f9f9f9; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <h2 style="text-align: center; color: #4f46e5;">Expense Tracker App</h2>
            <p style="font-size: 16px; color: #333;">Hi <strong>${fullName}</strong>,</p>
            <p style="font-size: 15px; color: #444;">
              Thank you for registering with us! To get started, please verify your email address by clicking the button below:
            </p>
      
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" target="_blank" style="background-color: #4f46e5; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">
                Verify Email
              </a>
            </div>
      
            <p style="font-size: 14px; color: #666;">
              If you didn’t request this, you can safely ignore this email.
            </p>
      
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} Expense Tracker App. All rights reserved.
            </p>
          </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ Error sending verification email:", error);
        throw new Error('Could not send verification email.');
    }
};

export default sendVerificationEmail;
