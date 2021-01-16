const sequelize = require('../../utils/database');
const { Template, TemplateLocale } = require('../../models/templateModel');
const fs = require('fs').promises;
const httpMocks = require('node-mocks-http');
const { assert } = require('chai');

const mailsController = require('../../controllers/mailsController');
const emailService = require('../../services/emailService');

describe("Mails", () => {
    beforeEach(async () => {
        return sequelize
            .sync({ force: true })
            .then(() => {
                return fs.readFile('tests/integration/dbTemplates.sql', "utf8");
            })
            .then((sql) => {
                return sequelize.query(sql);
            })
            .then(() => {
                return fs.readFile('tests/integration/dbMail.sql', "utf8");
            })
            .then((sql) => {
                return sequelize.query(sql);
            })
    });

    it("get 404", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            emailId: 404
        };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await mailsController.get(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, 'Requested email has not been found');
    });

    it("get", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            emailId: 2
        };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await mailsController.get(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Requested email has been found');
        assert.equal(json.data.id, 2);
        assert.equal(json.data.recepient.userId, '91d4fd43-998a-4614-ae91-5d4971522fec');
        assert.equal(json.data.recepient.email, 'some@gogle.de');
        assert.equal(json.data.recepient.name, 'frau blum');
        assert.equal(json.data.contents, 'some1 contents');
    });

    it("getAll", async () => {
        const req = httpMocks.createRequest();
        req.params = {
            limit: 10,
            offset: 2
        };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await mailsController.getAll(req, res, next);
        assert.equal(res.statusCode, 200);
        const json = res._getJSONData();
        assert.equal(json.message, 'Emails found');
        assert.equal(json.data.length, 2);
        assert.equal(json.count, 4);
        assert.equal(json.data[1].recepient.userId, 'b73140f0-d3c2-4b9d-9e21-f45130dd221a');
        assert.equal(json.data[1].recepient.email, 'some@huhuh.de');
        assert.equal(json.data[1].recepient.name, 'what ever');
    });

    it("add 404", async () => {
        const req = httpMocks.createRequest();
        req.body = {
            locale: 'es_ES',
            templateName: 'asdasd'
        };
        const res = httpMocks.createResponse();

        const next = (err) => console.log(err);
        await mailsController.add(req, res, next);
        assert.equal(res.statusCode, 404);
        const json = res._getJSONData();
        assert.equal(json.message, "Requested locale and fallback does not exists");
    });

    it("add without vars", async () => {
        const req = httpMocks.createRequest();
        req.body = {
            locale: 'de_DE',
            templateName: 'template 1',
            recepient: {
                userId: "ff620dcf-5368-49de-9cea-74ff54508ca0",
                email: 'ssss@asqfdasd.de',
                name: 'sss sdfsdf asdfasdf'
            }

        };
        const res = httpMocks.createResponse();
        emailService.send = () => { };

        const next = (err) => console.log(err);
        await mailsController.add(req, res, next);
        assert.equal(res.statusCode, 204);
    });
});