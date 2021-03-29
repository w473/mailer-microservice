const { Validator, ValidationError } = require('express-json-validator-middleware');
const addFormats = require("ajv-formats");

const schemas = {
    templateLocale: {
        type: 'object',
        required: ['locale', 'contents', 'subject'],
        properties: {
            locale: {
                type: 'string',
                pattern: "^[a-z][a-z]_[A-Z][A-Z]$"
            },
            subject: {
                type: 'string',
                minLength: 5
            },
            contents: {
                type: 'string',
                minLength: 50
            }
        }
    },
    templateAdd: {
        type: 'object',
        required: ['name', 'templateLocales'],
        additionalProperties: false,
        properties: {
            name: {
                type: 'string',
                minLength: 5,
                maxLength: 256
            },
            templateLocales: {
                minItems: 1,
                type: 'array',
                items: { "$ref": "templateLocale" }
            }
        }
    },
    templateEdit: {
        type: 'object',
        required: ['name'],
        additionalProperties: false,
        properties: {
            name: {
                type: 'string',
                minLength: 5,
                maxLength: 256
            }
        }
    },
    email: {
        type: 'object',
        required: ['recepient', 'locale', 'templateName'],
        additionalProperties: false,
        properties: {
            locale: {
                type: 'string',
                pattern: "^[a-z][a-z]_[A-Z][A-Z]$"
            },
            templateName: {
                type: 'string',
                minLength: 5,
                maxLength: 256
            },
            recepient: {
                type: 'object',
                required: ['userId', 'email', 'name'],
                additionalProperties: false,
                properties: {
                    'userId': {
                        type: 'string',
                        format: 'uuid'
                    },
                    'email': {
                        type: 'string',
                        format: 'email'
                    },
                    'name': {
                        type: 'string',
                        minLength: 2,
                        maxLength: 256
                    },
                }
            },
            variables: {
                type: 'object',
                additionalProperties: true
            }
        }
    }
};

const validator = new Validator({ allErrors: true, schemas: schemas });
addFormats(validator.ajv);

/**
 * 
 * @param {String} schemaName 
 */
module.exports = (schemaName) => {
    return validator.validate({ body: schemaName });
}

