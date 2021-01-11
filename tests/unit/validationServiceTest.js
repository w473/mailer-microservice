const validate = require('../../services/validationService');
const httpMocks = require('node-mocks-http');

const { assert } = require('chai');

it('validate templateAdd Error', function () {
    const tests = [
        {
            body: {},
            errors: [
                "should have required property 'name'",
                "should have required property 'locales'"
            ],
            count: 2
        },
        {
            body: {
                'name': 'po',
                'locales': 'potato',
                'oiwsedfsa': 'potato',
            },
            errors: [
                "should NOT have additional properties",
                "should NOT have fewer than 5 characters",
                "should be array"
            ],
            count: 3
        },
        {
            body: {
                'name': 'potato',
                'locales': [
                    {
                        'locale': 'asdas',
                        'subject': 'asdas'
                    }
                ],
            },
            errors: [
                "should have required property 'contents'",
                'should match pattern "^[a-z][a-z]_[A-Z][A-Z]$"'
            ],
            count: 2
        },
        {
            body: {
                'name': 'potato',
                'locales': [],
            },
            errors: [
                "should NOT have fewer than 1 items"
            ],
            count: 1
        }

    ]

    testValidateError('templateAdd', tests);
});

it('validate templateAdd Ok', function () {

    body = {
        'name': 'potato',
        'locales': [
            {
                'locale': 'pl_PL',
                'subject': 'asdas',
                'contents': 'asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas'
            }
        ],
    };

    testValidateOk('templateAdd', body);
});

it('validate templateLocale Error', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const tests = [
        {
            body: {},
            errors: [
                "should have required property 'locale'",
                "should have required property 'contents'",
                "should have required property 'subject'"
            ],
            count: 3
        },
        {
            body: {
                'locale': 'asdas',
                'subject': 'asda',
                'contents': 'asdas'
            },
            errors: [
                'should match pattern "^[a-z][a-z]_[A-Z][A-Z]$"',
                "should NOT have fewer than 5 characters",
                "should NOT have fewer than 50 characters",
            ],
            count: 3
        }
    ]

    testValidateError('templateLocale', tests);

});

it('validate templateLocale Ok', function () {
    body = {
        'locale': 'pl_PL',
        'subject': 'asdas',
        'contents': 'asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas'
    };
    testValidateOk('templateLocale', body);

});

it('validate templateLocale Error', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    const tests = [
        {
            body: {},
            errors: [
                "should have required property 'name'"
            ],
            count: 1
        },
        {
            body: {
                'name': 'asda',
                'ssads': 'asda'
            },
            errors: [
                'should NOT have additional properties',
                "should NOT have fewer than 5 characters"
            ],
            count: 2
        }
    ]

    testValidateError('templateEdit', tests);

});

it('validate templateLocale Ok', function () {
    body = {
        'name': 'asdasdasdpl_PL'
    };

    testValidateOk('templateEdit', body);
});


it('validate mail Error', function () {
    const tests = [
        {
            body: {},
            errors: [
                "should have required property 'recepient'",
                "should have required property 'variables'",
                "should have required property 'locale'",
                "should have required property 'templateId'"
            ],
            count: 4
        },
        {
            body: {
                'locale': 'asdads',
                'templateId': 'asda',
                'recepient': 'asda',
                'variables': {}
            },
            errors: [
                'should match pattern "^[a-z][a-z]_[A-Z][A-Z]$"',
                "should be integer",
                "should be object"
            ],
            count: 3
        },
        {
            body: {
                'locale': 'pl_PL',
                'templateId': '22',
                'recepient': {
                    'userId': 666,
                    'email': 'asdasdasd',
                    'name': "s"
                },
                'variables': {}
            },
            errors: [
                'should be integer',
                "should be string",
                'should match format "email"',
                "should NOT have fewer than 2 characters"
            ],
            count: 4
        },
        {
            body: {
                'locale': 'pl_PL',
                'templateId': 22,
                'recepient': {
                    'userId': "666",
                    'email': 'aaa@eee.de',
                    'name': "sasd"
                },
                'variables': {}
            },
            errors: [
                'should match format "uuid"'
            ],
            count: 1
        }
    ]

    testValidateError('email', tests);

});

it('validate mail Ok', function () {
    body = {
        'locale': 'pl_PL',
        'templateId': 22,
        'recepient': {
            'userId': '34dc5046-1d97-444a-87cf-439afb75eede',
            'email': 'email@email.de',
            'name': "some name"
        },
        'variables': {}
    };
    testValidateOk('email', body);
});

/**
 * 
 * @param {String} schemaName 
 * @param {Array} tests 
 */
const testValidateError = (schemaName, tests) => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    tests.forEach(data => {
        req.body = data.body;
        const next = (err) => {
            assert.typeOf(err, 'error');
            assert.equal(err.name, 'JsonSchemaValidationError');
            data.errors.forEach((error, index) => {
                assert.equal(err.validationErrors.body[index].message, error);
            })
            assert.equal(data.count, err.validationErrors.body.length)
        }
        validate(schemaName)(req, res, next)
    });
}
/**
 * 
 * @param {String} schemaName 
 * @param {Object} body 
 */
const testValidateOk = (schemaName, body) => {
    const req = httpMocks.createRequest();
    req.body = body;
    const res = httpMocks.createResponse();
    const next = (err) => {
        assert.equal(err, undefined);
    }
    validate(schemaName)(req, res, next)
}