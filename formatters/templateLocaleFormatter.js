const { TemplateLocale } = require('../models/templateModel');

exports.formatOne = function (templateLocale) {
    return {
        'locale': templateLocale.locale,
        'contents': templateLocale.contents,
    };
}

exports.formatAll = function (templateLocales) {
    return templateLocales.map((templateLocale) => this.formatOne(templateLocale));
}
