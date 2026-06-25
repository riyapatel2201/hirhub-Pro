const nodemailer = require('nodemailer')

const sendEmail = async (to, subject, text) => {
    //step 1 create transporter
    //think of this as setting uo your email client
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    //step2 define email content
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    }
    //step 3 : send email
    await transporter.sendMail(mailOptions)
    console.log('Email sent to:', to)
}

module.exports = sendEmail
