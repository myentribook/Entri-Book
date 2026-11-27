const { Resend } = require('resend');

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const sanitizeUrl = (url = '') => {
    const trimmed = String(url).trim();
    return /^https?:\/\//i.test(trimmed) ? trimmed : '#';
};

const sendEmail = async (options) => {
    try {
        const safeOptions = options && typeof options === 'object' ? options : {};

        console.log("-----------------------------------------");
        console.log("Attempting to send email to:", safeOptions.email);
        console.log("Reset Link/URL being used:", safeOptions.message);
        console.log("API Key loaded:", process.env.RESEND_API_KEY ? "Yes (Hidden)" : "No!");

        if (!process.env.RESEND_API_KEY) {
            throw new Error("RESEND_API_KEY is missing in environment variables.");
        }

        if (!safeOptions.email || !safeOptions.subject || !safeOptions.message) {
            throw new Error("Missing required email options (email, subject, or message).");
        }

        const resend = new Resend(process.env.RESEND_API_KEY);
        const safeUrl = sanitizeUrl(safeOptions.message);
        const safeHref = escapeHtml(safeUrl);
        const safeSubject = String(safeOptions.subject).trim();

        const message = {
            from: 'myentribook <support@myentribook.in>',
            to: safeOptions.email,
            subject: safeSubject,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; border-radius: 8px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        <h2 style="color: #333333; margin-bottom: 20px;">Your Password Reset Request: </h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hello,</p>
                         <p style="color: #555555; font-size: 16px; line-height: 1.5;">We received a request to reset the password for your myentribook account.</p> <br/>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Your password reset token URL is as follow:</p>
                        
                        <div style="margin: 20px 0; word-break: break-all;">
                            <a href="${safeHref}" target="_blank" rel="noopener noreferrer" style="color: #007bff; font-size: 15px; text-decoration: underline;">
                                Reset Your Passsword
                            </a>
                        </div>
                        
                        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-top: 15px;">If you did not request this password reset , you can safely ignore this email. No action is required from your side.</p> <br/>
                        <p style="color: #555555; font-size: 15px; line-height: 1.6; margin-top: 15px;">For security reasons, please do not share this password reset link with anyone.</p>
                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                        <p style="color: #999999; font-size: 12px; text-align: center;">&copy; 2026 myentribook. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const response = await resend.emails.send(message);
        console.log("Resend Full API Response:", JSON.stringify(response, null, 2));

        if (response && response.error) {
            console.error('❌ Resend API Error Returned:', response.error);
            throw new Error(response.error.message);
        }

        console.log("✅ Email sent successfully!");
        console.log("-----------------------------------------");
        return response ? response.data : null;

    } catch (err) {
        console.error('❌ Catch Block Error Details:', err);
        console.log("-----------------------------------------");
        throw err;
    }
};

module.exports = sendEmail;