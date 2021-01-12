const { Template, TemplateLocale } = require('../models/templateModel');
const TemplateFormatter = require('../formatters/templateFormatter');

exports.getAllTemplates = (req, res, next) => {
    const where = {};
    return Template
        .findAndCountAll({
            where: where,
            limit: req.params.limit,
            offset: req.params.offset,
            include: [
                { model: TemplateLocale }
            ],
        })
        .then(result => {
            if (result.count > 0) {
                return res.status(200).json(
                    { message: 'Templates', data: TemplateFormatter.formatAll(result.rows), count: result.count }
                );
            }
            return res.status(404).json({ message: 'Templates have not been found' });
        })
        .catch(err => next(err));
}

exports.getTemplate = (req, res, next) => {
    return Template
        .findByPk(req.params.templateId, {
            include: [
                { model: TemplateLocale }
            ]
        })
        .then((template) => {
            if (template) {
                return res.status(200).json(
                    { message: 'Template', data: TemplateFormatter.formatOne(template) }
                );
            }
            return res.status(404).json({ message: 'Template has not been found' });
        })
        .catch(err => next(err));
}

exports.addTemplate = (req, res, next) => {
    return Template
        .create(
            {
                name: req.body.name,
                TemplatesLocales: req.body.locales
            },
            {
                include: [TemplateLocale]
            }
        )
        .then(() => res.status(204).send())
        .catch(err => next(err));
}

exports.updateTemplate = (req, res, next) => {
    return Template
        .findByPk(req.params.templateId)
        .then((template) => {
            if (template) {
                template.name = req.body.name;
                return template
                    .save()
                    .then(() => res.status(204).send());
            }
            return res.status(404).json({ message: 'Template has not been found' });
        })
        .catch(err => next(err));
}

exports.deleteTemplate = (req, res, next) => {
    return Template
        .destroy({ where: { id: req.params.templateId } })
        .then((deletedCount) => {
            if (deletedCount > 0) {
                return res.status(204).send();
            }
            return res.status(404).json({ message: 'Template has not been found' });
        })
        .catch(err => next(err));
}

exports.updateTemplateLocale = (req, res, next) => {
    return TemplateLocale
        .findOne({
            where: {
                templateId: req.params.templateId,
                locale: req.params.locale
            }
        })
        .then((template) => {
            if (template) {
                template.contents = req.body.contents;
                template.subject = req.body.subject;
                return template
                    .save()
                    .then(() => res.status(204).send());
            }
            return res.status(404).json({ message: 'Template Locale has not been found' });
        })
        .catch(err => next(err));
}

exports.deleteTemplateLocale = (req, res, next) => {
    return TemplateLocale
        .destroy({
            where: {
                templateId: req.params.templateId,
                locale: req.params.locale
            }
        })
        .then((deletedCount) => {
            if (deletedCount > 0) {
                return res.status(204).send();
            }
            return res.status(404).json({ message: 'Template Locale has not been found' });
        })
        .catch(err => next(err));
}
