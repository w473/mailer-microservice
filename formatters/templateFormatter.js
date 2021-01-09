const { Template, TemplateLocale } = require('../models/templateModel');
const TemplateLocaleFormatter = require('./templateLocaleFormatter');

exports.formatOne = function (template) {
    return {
        name: template.name,
        templateLocale: TemplateLocaleFormatter.formatAll(template.templateLocales)
    }
}

exports.formatAll = function (templates) {
    return templates.map(template => this.formatOne(template));
}
