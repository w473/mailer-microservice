const getVar = (varName) => {
  return String(process.env[varName]);
};

export const config = {
  env: getVar('ENV'),
  port: getVar('PORT'),
  logging: {
    graylog: getVar('GRAYLOG'),
  },
  sso: getVar('SSO'),
  other: {
    fallbackLocale: getVar('FALLBACK_LOCALE'),
  },
  emailService: {
    connection: {
      host: getVar('EMAIL_SERVICE_HOST'),
      port: getVar('EMAIL_SERVICE_PORT'),
      secure: getVar('EMAIL_SERVICE_PORT') == '465',
      auth: {
        user: getVar('EMAIL_SERVICE_USER'),
        pass: getVar('EMAIL_SERVICE_PASS'),
      },
    },
    from: {
      name: getVar('EMAIL_FROM_NAME'),
      email: getVar('EMAIL_FROM_EMAIL'),
    },
  },
  db: {
    host: getVar('DB_HOST'),
    port: getVar('DB_PORT'),
    username: getVar('DB_USERNAME'),
    password: getVar('DB_PASSWORD'),
    name: getVar('DB_NAME') + (getVar('ENV') == 'test' ? '_test' : ''),
  },
  activationURL: getVar('ACTIVATION_URL'),
};
