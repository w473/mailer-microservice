const { Template, TemplateLocale } = require('../models/templateModel');
const TemplateLocaleFormatter = require('./templateLocaleFormatter');

exports.formatOne = function (template) {
    return {
        name: template.name,
        templateLocales: TemplateLocaleFormatter.formatAll(template.TemplatesLocales)
    }
}

exports.formatAll = function (templates) {
    return templates.map(template => this.formatOne(template));
}
