const winston = require('winston');
const { WinstonGraylog } = require('@pskzcompany/winston-graylog');
const config = require('../config');
const os = require('os');

const logger = winston.createLogger({
  exitOnError: false,
  transports: [
    new WinstonGraylog({
      level: 'info',
      handleExceptions: true,
      silent: false,
      graylog: config.logging.graylog,
      defaultMeta: {
        environment: config.env,
        hostname: os.hostname(),
        facility: 'mailer'
      }
    }),
    new winston.transports.Console()
  ]
});

logger.stream({ start: -1 }).on('log', function (log) {
  logger.info(log);
});

const stream = {
  write: (message) => {
    logger.info(message);
  }
};

module.exports = { logger, stream };
