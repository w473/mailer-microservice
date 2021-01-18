const winston = require('winston');
const WinstonGraylog2 = require('winston-graylog2');
const config = require('../config');
const os = require('os');

const options = {
    name: 'Graylog',
    level: 'info',
    silent: false,
    handleExceptions: true,
    graylog: {
        servers: [{ host: config.logging.graylog.host, port: config.logging.graylog.port }],
        hostname: os.hostname(),
        facility: 'mailer',
        bufferSize: 1400
    },
    staticMeta: { env: config.env }
};

const logger = winston.createLogger({
    exitOnError: false,

    transports: [
        new WinstonGraylog2(options),
        new winston.transports.Console(),
    ],
});
logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;