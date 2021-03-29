const express = require('express');
const app = express();
const sequelize = require('./utils/database');
const authorization = require('./services/authorizationService');
const routes = require('./routes/routes');
const config = require('./config');
const { ValidationError } = require('express-json-validator-middleware');
const morgan = require('morgan');
const { logger, stream } = require('./services/loggerService');
const stringify = require('json-stringify-safe');

app.use(morgan('combined', { stream: stream }));

app.use(express.json());

app.use(authorization.jwtVerifyMiddleware);

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(routes);

app.use((_, res) => {
  res.status(404).json({ message: 'Page you are looking for does not exist' });
});

app.use((error, req, res, next) => {
  if (error instanceof ValidationError) {
    logger.info(stringify(error));
    return res
      .status(400)
      .json({ message: 'Validation error', data: error.validationErrors });
  }
  logger.error(stringify(error));
  if (!res.headersSent) {
    res.status(500).json({ message: 'Unexpected error occured' });
  }
});

setTimeout(() => {
  sequelize
    .sync({ alter: true })
    .then(() => {
      logger.info('Connection has been established successfully.');
      app.listen(config.port);
    })
    .catch((error) => {
      logger.error(stringify(error));
    });
}, 1000);
