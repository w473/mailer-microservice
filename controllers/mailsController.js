const config = require('../config');
const Mail = require('../models/mailModel');
const { TemplateLocale, Template } = require('../models/templateModel');
const Handlebars = require("handlebars");
const { formatAll } = require('../formatters/mailLocaleFormatter');
const emailService = require('../services/emailService');
const e = require('express');

exports.add = async (req, res, next) => {
    const locale = req.body.locale;
    let mail = null;
    return Template.findOne(
        {
            where: {
                'name': req.body.templateName
            }
        })
        .then(template => {
            if (template) {
                return TemplateLocale
                    .findAll({
                        where: {
                            'templateId': template.id,
                            'locale': [locale, config.other.fallbackLocale]
                        }
                    })
            }
        })
        .then(templateLocales => {
            if (!templateLocales || templateLocales.length === 0) {
                res.status(404).json({ message: 'Requested locale and fallback does not exists' });
                return;
            }

            let templateLocale = templateLocales.find(element => element.locale === locale);
            if (!templateLocale) {
                templateLocale = templateLocales[0];
            }

            const templateSubject = Handlebars.compile(templateLocale.subject);
            const templateContents = Handlebars.compile(templateLocale.contents);

            const variables = Object.assign(
                req.body.variables ?? {},
                {
                    recepientUserId: req.body.recepient.userId,
                    recepientEmail: req.body.recepient.email,
                    recepientName: req.body.recepient.name
                }
            );
            return Mail.create({
                recepientUserId: req.body.recepient.userId,
                recepientEmail: req.body.recepient.email,
                recepientName: req.body.recepient.name,
                subject: templateSubject(variables),
                contents: templateContents(variables)
            });
        })
        .then(email => {
            if (email) {
                mail = email;
                res.status(204).send();
                return emailService.send(email);
            }
        })
        .then(result => {
            if (result) {
                if (mail) {
                    mail.sent = Date.now();
                    return mail.save();
                }
                console.log(result);
            }
        })
        .catch(err => next(err));
}

exports.getAll = (req, res, next) => {
    const where = {}
    if (req.query.emailId) {
        where.emailId = req.query.emailId;
    }
    return Mail
        .findAndCountAll({
            where: where,
            limit: req.query.limit ?? 10,
            offset: req.query.offset ?? 0
        })
        .then(result => {
            return res.status(200).json(
                { mails: formatAll(result.rows), total: result.count }
            );
        })
        .catch(err => next(err));
}