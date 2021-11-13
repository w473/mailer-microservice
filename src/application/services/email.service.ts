const config = require('../config');
const nodemailer = require('nodemailer');
const Mail = require('../models/mailModel');

const transporter = nodemailer.createTransport(config.emailService.connection);

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