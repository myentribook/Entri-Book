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
    // Initialize Resend with the API key from your config.env
    const resend = new Resend(process.env.RESEND_API_KEY);

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <onboarding@resend.dev>`, // Testing-ku ithu irukkatum
        to: options.email,
        subject: options.subject,
        html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
                <p>${options.message}</p>
               </div>`
    };

    const { data, error } = await resend.emails.send(message);

    if (error) {
        console.error('Resend Error:', error);
        throw new Error('Email could not be sent');
    }

    return data;
};

module.exports = sendEmail;
