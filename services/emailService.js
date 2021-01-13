const config = require('../config');
const nodemailer = require('nodemailer');
const Mail = require('../models/mailModel');

const transporter = nodemailer.createTransport({
    host: config.emailService.host,
    port: config.emailService.port,
    secure: config.emailService.secure, // true for 465, false for other ports
    auth: {
        user: config.emailService.user,
        pass: config.emailService.pass
    },
});

/**
 * 
 * @param {Mail} mail 
 */
exports.send = (mail) => {
    return transporter.sendMail({
        from: `${config.emailService.from.name} <${config.emailService.from.email}>`,
        to: `${mail.recepientName} <${mail.recepientEmail}> `,
        subject: mail.subject,
        html: mail.contents
    })
}