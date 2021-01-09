const express = require('express');
const authorization = require('../services/authorizationService');
const validator = require('../services/validationService');
const mailsController = require('../controllers/mailsController');
const templatesController = require('../controllers/templatesController');

const router = express.Router();

router.get('/templates/:templateId', authorization.isAdmin(), templatesController.getTemplate);

router.get('/templates/:limit/:offset', authorization.isAdmin(), templatesController.getAllTemplates);

router.post('/templates', authorization.isAdmin(), validator.validate('templateAdd'), templatesController.addTemplate);

router.patch('/templates/:templateId/locale/:locale', authorization.isAdmin(), validator.validate('templateEdit'), templatesController.updateTemplateLocale);
router.patch('/templates/:templateId', authorization.isAdmin(), validator.validate('templateEdit'), templatesController.updateTemplate);


router.post('', authorization.isAdmin(), validator.validate('mail'), mailsController.add);

router.get(':emailId', authorization.isAdmin(), mailsController.get);
router.get('/:limit/:offset', authorization.isAdmin(), mailsController.getAll);


module.exports = router;
