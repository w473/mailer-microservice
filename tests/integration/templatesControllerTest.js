const sequelize = require('../../utils/database');
const { Template, TemplateLocale } = require('../../models/templateModel');
const fs = require('fs').promises;
const httpMocks = require('node-mocks-http');
const { assert } = require('chai');

const templateController = require('../../controllers/templatesController');

describe("Templates", () => {
    beforeEach(async () => {
        return sequelize
            .sync({ force: true })
            .then(() => {
                return fs.readFile('tests/integration/dbTemplates.sql', "utf8");
            })
            .then((sql) => {
                return sequelize.query(sql);
            })

    });

    it("2 templates should be returned", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            limit: 10,
            offset: 0
        };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.getAllTemplates(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Templates');
        assert.equal(json.data.length, 2);
        assert.equal(json.data[0].templateLocales.length, 3);
        assert.equal(json.data[1].templateLocales.length, 1);
        assert.equal(json.count, 2);
    });

    it("get template 2", async () => {
        const req = httpMocks.createRequest();
        req.params = { templateId: 2 };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.getTemplate(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template');
        assert.equal(json.data.name, 'template 2');
        assert.equal(json.data.templateLocales.length, 1);
        assert.equal(json.data.templateLocales[0].locale, 'en_US');
    });

    it("get template4042", async () => {
        const req = httpMocks.createRequest();
        req.params = { templateId: 404 };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.getTemplate(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template has not been found');
    });

    it("add template", async () => {
        const req = httpMocks.createRequest();
        req.body = {
            name: "some name",
            locales: [
                {
                    locale: "es_ES",
                    subject: "sbjtasd",
                    contents: "sbjtasd"
                },

                {
                    locale: "en_US",
                    subject: "US SUBJECT",
                    contents: "US CONTENTS"
                }
            ]
        };
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.addTemplate(req, res, next);
        assert.equal(res.statusCode, 204);

        req.params = { templateId: 3 };
        res = httpMocks.createResponse();
        await templateController.getTemplate(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template');
        assert.equal(json.data.name, "some name");
        assert.equal(json.data.templateLocales.length, 2);
        assert.equal(json.data.templateLocales[0].locale, 'en_US');
        assert.equal(json.data.templateLocales[1].locale, 'es_ES');
    });

    it("update template", async () => {
        const req = httpMocks.createRequest();
        req.body = {
            name: "potato"
        };
        req.params = { templateId: 1 }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.updateTemplate(req, res, next);
        assert.equal(res.statusCode, 204);

        res = httpMocks.createResponse();
        await templateController.getTemplate(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template');
        assert.equal(json.data.name, "potato");
        assert.equal(json.data.templateLocales.length, 3);
        assert.equal(json.data.templateLocales[0].locale, 'de_DE');
        assert.equal(json.data.templateLocales[1].locale, 'en_US');
    });

    it("update template 404", async () => {
        const req = httpMocks.createRequest();
        req.body = {
            name: "potato"
        };
        req.params = { templateId: 404 }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.updateTemplate(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template has not been found');
    });

    it("delete template", async () => {
        const req = httpMocks.createRequest();
        req.params = { templateId: 1 }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.deleteTemplate(req, res, next);
        assert.equal(res.statusCode, 204);

        res = httpMocks.createResponse();
        await templateController.getTemplate(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template has not been found');
    });

    it("delete template 404", async () => {
        const req = httpMocks.createRequest();
        req.params = { templateId: 404 }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.deleteTemplate(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template has not been found');
    });

    it("delete deleteTemplateLocale", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            templateId: 1,
            locale: "pl_PL"
        }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.deleteTemplateLocale(req, res, next);
        assert.equal(res.statusCode, 204);
    });

    it("delete deleteTemplateLocale 404", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            templateId: 404,
            locale: "pl_PL"
        }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.deleteTemplateLocale(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template Locale has not been found');
    });

    it("updateTemplateLocale 404", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            templateId: 404,
            locale: "pl_PL"
        }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.updateTemplateLocale(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Template Locale has not been found');
    });

    it("updateTemplateLocale", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            templateId: 1,
            locale: "pl_PL"
        }
        req.body = {
            subject: 'test123',
            contents: 'test123'
        }
        let res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await templateController.updateTemplateLocale(req, res, next);
        assert.equal(res.statusCode, 204);
    });
});