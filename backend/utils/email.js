// const nodemailer = require('nodemailer')


// const sendEmail = async (options) => {

//     var transport = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//             user: "8ab24841b578a6",
//             pass: "831d53fbe11534"
//         }
//     });


//     const message = {
//         from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }

//     await transport.sendMail(message)

// }


// module.exports = sendEmail

const { Resend } = require('resend');

const sendEmail = async (options) => {
    try {
        console.log("API Key loaded:", process.env.RESEND_API_KEY ? "Yes (Hidden)" : "No!");
        
        const resend = new Resend(process.env.RESEND_API_KEY);

        const message = {
            from: `myentribook <support@myentribook.in>`, // Unga verified domain ippo anga irukku
            to: options.email,
            subject: options.subject,
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px; border-radius: 8px;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                        <h2 style="color: #333333; margin-bottom: 20px;">Password Reset Request</h2>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">Hello,</p>
                        <p style="color: #555555; font-size: 16px; line-height: 1.5;">You requested to reset your password for your <strong>myentribook</strong> account. Click the button below to proceed:</p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${options.message}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
                        </div>
                        
                        <p style="color: #777777; font-size: 14px; line-height: 1.4;">If you didn't request this, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                        <p style="color: #999999; font-size: 12px; text-align: center;">&copy; 2026 myentribook. All rights reserved.</p>
                    </div>
                </div>
            `
        };

        const response = await resend.emails.send(message);
        console.log("Resend Response:", response);

        if (response.error) {
            console.error('Resend Error Details:', response.error);
            throw new Error(response.error.message);
        }

        return response.data;
    }codes catch (err) {
        console.error('Catch Error Details:', err);
        throw err;
    }
};

module.exports = sendEmail;
