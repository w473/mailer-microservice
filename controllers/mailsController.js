const Mail = require('../models/mailModel');
const { Template, TemplateLocale } = require('../models/templateModel');
const Handlebars = require("handlebars");
const { NotFoundApiResponseError } = require('../utils/errors');
const { formatOne, formatAll } = require('../formatters/mailLocaleFormatter');
const fallbackLocale = 'en_US';

exports.add = async (req, res, next) => {
    const locale = req.body.locale;
    TemplateLocale
        .findAll({
            where: {
                'templateId': req.templateId,
                'locale': [locale, fallbackLocale]
            }
        })
        .then(templateLocales => {
            if (templateLocales.length > 0) {
                let templateLocale = templateLocales.find(element => element.locale === locale);
                if (!templateLocale) {
                    templateLocale = templateLocales[0];
                }
                return templateLocale;
            } else {
                throw new NotFoundApiResponseError('Requested locale and fallback does not exists');
            }
        })
        .then(templateLocale => {
            const template = Handlebars.compile(templateLocale.contents);
            return template(req.body.variables);
        })
        .then(contents => {
            return Mail.create({
                recepientUserId: req.body.recepient.userId,
                recepientEmail: req.body.recepient.email,
                recepientName: req.body.recepient.name,
                contents: contents
            });
        })
        .then(() => res.status(204).send())
        .catch(err => next(err));
}

exports.getAll = (req, res, next) => {
    const where = {}
    Mail
        .findAndCountAll({
            where: where,
            limit: req.params.limit,
            offset: req.params.offset
        })
        .then(mails, count => {
            return res.status(200).json(
                { message: 'Emails found', data: formatAll(mails), count: count }
            );
        })
        .catch(err => next(err));
}

exports.get = (req, res, next) => {
    Mail
        .findByPk(req.params.emailId)
        .then(mail => {
            if (mail) {
                return res.status(200).json(
                    { message: 'Requested email has been found', data: formatOne(mail) }
                );
            } else {
                return res.status(404).json({ message: 'Requested email has not been found' });
            }

        })
        .catch(err => next(err));
}
