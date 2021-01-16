const config = require('../config');
const Mail = require('../models/mailModel');
const { TemplateLocale, Template } = require('../models/templateModel');
const Handlebars = require("handlebars");
const { formatOne, formatAll } = require('../formatters/mailLocaleFormatter');
const emailService = require('../services/emailService');

exports.add = async (req, res, next) => {
    const locale = req.body.locale;
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

            return Mail.create({
                recepientUserId: req.body.recepient.userId,
                recepientEmail: req.body.recepient.email,
                recepientName: req.body.recepient.name,
                subject: templateSubject(req.body.variables),
                contents: templateContents(req.body.variables)
            });
        })
        .then(email => {
            if (email) {
                res.status(204).send();
                return emailService.send(email);
            }
        })
        .then(result => { if (result) { console.log(result) } })
        .catch(err => next(err));
}

exports.getAll = (req, res, next) => {
    const where = {}
    return Mail
        .findAndCountAll({
            where: where,
            limit: req.params.limit,
            offset: req.params.offset
        })
        .then(result => {
            return res.status(200).json(
                { message: 'Emails found', data: formatAll(result.rows), count: result.count }
            );
        })
        .catch(err => next(err));
}

exports.get = (req, res, next) => {
    return Mail
        .findByPk(req.params.emailId)
        .then(mail => {
            if (mail) {
                return res.status(200).json(
                    { message: 'Requested email has been found', data: formatOne(mail) }
                );
            }
            return res.status(404).json({ message: 'Requested email has not been found' });
        })
        .catch(err => next(err));
}
