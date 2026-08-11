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
            from: `MyApp <onboarding@resend.dev>`, // Direct-aa testing-kku name podalam
            to: options.email,
            subject: options.subject,
            html: `<p>${options.message}</p>`
        };

        const response = await resend.emails.send(message);
        console.log("Resend Response:", response);

        if (response.error) {
            console.error('Resend Error Details:', response.error);
            throw new Error(response.error.message);
        }

        return response.data;
    } catch (err) {
        console.error('Catch Error Details:', err);
        throw err;
    }
};

module.exports = sendEmail;
