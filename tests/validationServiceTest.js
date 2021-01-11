const validate = require('../services/validationService');
const httpMocks = require('node-mocks-http');

const { expect, assert } = require('chai');

it('validate templateAdd Error', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

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

    tests.forEach(data => {
        req.body = data.body;
        const next = (err) => {
            assert.typeOf(err, 'error');
            assert.equal(err.name, 'JsonSchemaValidationError');
            data.errors.forEach((error, index) => {
                assert.equal(err.validationErrors[index].message, error);
            })
            assert.equal(data.count, err.validationErrors.length)
        }
        validate('templateAdd')(req, res, next)
    });

});

it('validate templateAdd Ok', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    req.body = {
        'name': 'potato',
        'locales': [
            {
                'locale': 'pl_PL',
                'subject': 'asdas',
                'contents': 'asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas'
            }
        ],
    };
    const next = (err) => {
        assert.equal(err, undefined);
    }
    validate('templateAdd')(req, res, next)

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

    tests.forEach(data => {
        req.body = data.body;
        const next = (err) => {
            assert.typeOf(err, 'error');
            assert.equal(err.name, 'JsonSchemaValidationError');
            data.errors.forEach((error, index) => {
                assert.equal(err.validationErrors[index].message, error);
            })
            assert.equal(data.count, err.validationErrors.length)
        }
        validate('templateLocale')(req, res, next)
    });

});

it('validate templateLocale Ok', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    req.body = {
        'locale': 'pl_PL',
        'subject': 'asdas',
        'contents': 'asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas asdasasdas'
    };
    const next = (err) => {
        assert.equal(err, undefined);
    }
    validate('templateLocale')(req, res, next)

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

    tests.forEach(data => {
        req.body = data.body;
        const next = (err) => {
            assert.typeOf(err, 'error');
            assert.equal(err.name, 'JsonSchemaValidationError');
            data.errors.forEach((error, index) => {
                assert.equal(err.validationErrors[index].message, error);
            })
            assert.equal(data.count, err.validationErrors.length)
        }
        validate('templateEdit')(req, res, next)
    });

});

it('validate templateLocale Ok', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    req.body = {
        'name': 'asdasdasdpl_PL'
    };
    const next = (err) => {
        assert.equal(err, undefined);
    }
    validate('templateEdit')(req, res, next)
});


it('validate mail Error', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

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

    tests.forEach(data => {
        req.body = data.body;
        const next = (err) => {
            assert.typeOf(err, 'error');
            assert.equal(err.name, 'JsonSchemaValidationError');
            data.errors.forEach((error, index) => {
                assert.equal(err.validationErrors[index].message, error);
            })
            assert.equal(data.count, err.validationErrors.length)
        }
        validate('email')(req, res, next)
    });

});

it('validate mail Ok', function () {

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    req.body = {
        'locale': 'pl_PL',
        'templateId': 22,
        'recepient': {
            'userId': '34dc5046-1d97-444a-87cf-439afb75eede',
            'email': 'email@email.de',
            'name': "some name"
        },
        'variables': {}
    };
    const next = (err) => {
        assert.equal(err, undefined);
    }
    validate('email')(req, res, next)
});