import nodemailer from "nodemailer";
import env from "../config/env";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || "smtp.ethereal.email",
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER || "mock_user",
        pass: env.SMTP_PASS || "mock_pass",
    },
});

export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const verificationUrl = `${env.FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
        from: env.SMTP_FROM,
        to: email,
        subject: "Verify Your Email - MediAssist AI",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
                <div style="background-color: #ffffff; border-radius: 24px; padding: 48px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="display: inline-block; background-color: #0f172a; padding: 12px; border-radius: 16px;">
                            <span style="color: #10b981; font-weight: bold; font-size: 24px;">M</span>
                        </div>
                        <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 16px; margin-bottom: 0;">MediAssist AI</h1>
                        <p style="color: #059669; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 4px;">Health Suite</p>
                    </div>
                    
                    <h2 style="color: #0f172a; font-size: 20px; font-weight: 700; margin-bottom: 16px;">Verify your identity</h2>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Hello ${name},<br><br>
                        Welcome to the vanguard of personalized healthcare. To activate your account and secure your medical profile, please verify your email address.
                    </p>
                    
                    <div style="text-align: center; margin: 40px 0;">
                        <a href="${verificationUrl}" style="background-color: #0f172a; color: #ffffff; padding: 18px 36px; text-decoration: none; border-radius: 16px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.3);">
                            Verify Email Address
                        </a>
                    </div>
                    
                    <div style="background-color: #f1f5f9; border-radius: 16px; padding: 20px; margin-bottom: 32px;">
                        <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.5;">
                            <strong>Security Note:</strong> This link will expire in 24 hours. If you did not create an account with MediAssist AI, please disregard this message.
                        </p>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-bottom: 0;">
                        If the button above does not work, copy and paste this URL into your browser:<br>
                        <a href="${verificationUrl}" style="color: #10b981; text-decoration: none;">${verificationUrl}</a>
                    </p>
                </div>
                
                <div style="text-align: center; margin-top: 24px;">
                    <p style="color: #94a3b8; font-size: 12px;">
                        &copy; 2024 MediAssist AI. All rights reserved.<br>
                        The pinnacle of digital wellness.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        console.log(`📧 Attempting to send verification email to: ${email}`);
        console.log(`📡 SMTP Config - Host: ${env.SMTP_HOST}, Port: ${env.SMTP_PORT}, User: ${env.SMTP_USER}`);
        
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully! MessageId: ${info.messageId}`);
        
        if (env.SMTP_HOST === "smtp.ethereal.email" || !env.SMTP_HOST) {
            console.log("🔗 Verification email link (Mock): %s", nodemailer.getTestMessageUrl(info));
        }
        return info;
    } catch (error: any) {
        console.error("❌ Error sending verification email:");
        console.error("- Message:", error.message);
        console.error("- Code:", error.code);
        console.error("- Command:", error.command);
        throw new Error(`Could not send verification email: ${error.message}`);
    }
};
