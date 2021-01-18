const app = require('express')();
const sequelize = require('./utils/database');
const bodyParser = require('body-parser');
const authorization = require('./services/authorizationService');
const routes = require('./routes/routes');
const config = require('./config');
const { ValidationError } = require('express-json-validator-middleware');
const morgan = require('morgan');
const logger = require('./services/loggerService');
const stringify = require('json-stringify-safe');

app.use(morgan('combined', { stream: logger.stream }));

app.use(bodyParser.json());

app.use(authorization.jwtVerifyMiddleware);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(routes);

app.use((req, res) => {
    res.status(404).json({ message: 'Page you are looking for does not exist' });
});

app.use((error, req, res, next) => {
    if (error instanceof ValidationError) {
        logger.info(stringify(error));
        return res.status(400).json({ message: 'Validation error', data: error.validationErrors });
    }
    logger.error(stringify(error));
    if (!res.headersSent) {
        res.status(500).json({ message: 'Unexpected error occured' });
    }
});


sequelize
    .sync(
        { alter: true }
    )
    .then(() => {
        logger.info('Connection has been established successfully.');
        app.listen(config.port);
    })
    .catch(error => {
        logger.error(JSON.stringify(error));
    })
