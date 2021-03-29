const express = require('express');
const authorization = require('../services/authorizationService');
const validate = require('../services/validationService');
const mailsController = require('../controllers/mailsController');
const templatesController = require('../controllers/templatesController');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const openApiDocs = require('./openApiDocs.json');

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(openApiDocs));

router.get(
  '/templates',
  authorization.isAdmin(),
  templatesController.getAllTemplates
);

router.post(
  '/templates',
  authorization.isAdmin(),
  validate('templateAdd'),
  templatesController.addTemplate
);

router.patch(
  '/templates/:templateId/:locale',
  authorization.isAdmin(),
  validate('templateEdit'),
  templatesController.updateTemplateLocale
);
router.delete(
  '/templates/:templateId/:locale',
  authorization.isAdmin(),
  validate('templateEdit'),
  templatesController.deleteTemplateLocale
);

router.get(
  '/templates/:templateId',
  authorization.isAdmin(),
  templatesController.getTemplate
);
router.patch(
  '/templates/:templateId',
  authorization.isAdmin(),
  validate('templateEdit'),
  templatesController.updateTemplate
);
router.delete(
  '/templates/:templateId',
  authorization.isAdmin(),
  validate('templateEdit'),
  templatesController.deleteTemplate
);

router.post(
  '',
  authorization.hasRole('ADMIN', 'SYS'),
  validate('email'),
  mailsController.add
);

router.get('', authorization.isAdmin(), mailsController.getAll);

module.exports = router;
