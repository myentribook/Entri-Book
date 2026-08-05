const nodemailer = require('nodemailer')


const sendEmail = async (options) => {

    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "8ab24841b578a6",
            pass: "831d53fbe11534"
        }
    });


    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(message)

}


module.exports = sendEmail