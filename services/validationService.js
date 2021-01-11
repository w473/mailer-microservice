const Ajv = require("ajv").default
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
        required: ['name', 'locales'],
        additionalProperties: false,
        properties: {
            name: {
                type: 'string',
                minLength: 5,
                maxLength: 256
            },
            locales: {
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
        required: ['recepient', 'variables', 'locale', 'templateId'],
        additionalProperties: false,
        properties: {
            locale: {
                type: 'string',
                pattern: "^[a-z][a-z]_[A-Z][A-Z]$"
            },
            templateId: {
                type: 'integer'
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

const ajv = new Ajv({ allErrors: true, schemas: schemas });
addFormats(ajv)

class ValidationError extends Error {
    constructor(validationErrors) {
        super();
        this.name = "JsonSchemaValidationError";
        this.validationErrors = validationErrors;
    }
}
/**
 * 
 * @param {String} schemaName 
 */
module.exports = (schemaName) => {
    return function (req, res, next) {
        if (ajv.validate(schemaName, req.body)) {
            return next();
        }
        return next(new ValidationError(ajv.errors));
    }
}

