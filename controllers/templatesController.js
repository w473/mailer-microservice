const { Template, TemplateLocale } = require('../models/templateModel');
const TemplateFormatter = require('../formatters/templateFormatter');

exports.getAllTemplates = (req, res, next) => {
    const where = {};
    Template
        .findAndCountAll({
            where: where,
            limit: req.params.limit,
            offset: req.params.offset
        })
        .then((templates, count) => {
            if (templates) {
                return res.status(404).json(
                    { message: 'Template', data: TemplateFormatter.formatAll(templates), count() }
                );
            } else {
                return res.status(404).json({ message: 'Template has not been found' });
            }
        })
        .catch(err => next(err));
}

exports.getTemplate = (req, res, next) => {
    Template
        .findByPk(req.params.templateId)
        .then((template) => {
            if (template) {
                return res.status(404).json(
                    { message: 'Template', data: TemplateFormatter.formatOne(template) }
                );
            } else {
                return res.status(404).json({ message: 'Template has not been found' });
            }
        })
        .catch(err => next(err));
}

exports.addTemplate = (req, res, next) => {
    const templateLocales = req.body.locales.map((el) => {
        return TemplateLocale.build({
            'locale': el.locale,
            'contents': el.contents,
            'subject': el.subject
        })
    });

    Template
        .create({
            name: req.body.name,
            templateLocales: templateLocales
        })
        .then(() => res.status(204).send())
        .catch(err => next(err));
}

exports.updateTemplate = (req, res, next) => {
    Template
        .findByPk(req.params.templateId)
        .then((template) => {
            if (template) {
                template.name = req.body.name;
            } else {
                return res.status(404).json({ message: 'Template has not been found' });
            }
        })
        .catch(err => next(err));
}

exports.deleteTemplate = (req, res, next) => {
    Template
        .destroy({ where: { id: req.params.templateId } })
        .then((deletedCount) => {
            if (deletedCount > 0) {
                return res.status(204).send();
            } else {
                return res.status(404).json({ message: 'Template has not been found' });
            }
        })
        .catch(err => next(err));
}

exports.updateTemplateLocale = (req, res, next) => {
    TemplateLocale
        .findOne(
            {
                where: {
                    templateId: req.params.templateId, locale: req.params.locale
                }
            }
        ).then((template) => {
            if (template) {
                template.contents = req.body.contents;
                template.subject = req.body.subject;
                return template.save();
            } else {
                return res.status(404).json({ message: 'Template has not been found' });
            }
        }).then(() => res.status(204).send())
        .catch(err => next(err));
}

exports.deleteTemplateLocale = (req, res, next) => {
    TemplateLocale
        .destroy({ where: { id: req.params.templateLocaleId } })
        .then((deletedCount) => {
            if (deletedCount > 0) {
                return res.status(204).send();
            } else {
                return res.status(404).json({ message: 'Template Locale has not been found' });
            }
        })
        .catch(err => next(err));
}
