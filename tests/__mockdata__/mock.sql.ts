export const mockSql = `
      INSERT INTO email_templates (id, name) VALUES (1, 'New user'),(2, 'User email changed activate');

      INSERT INTO email_templates_locales (id, locale, subject, contents, template_id) 
      VALUES
      (1, 'en_US', 'Hello {{recipientName}}', 'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
        (SELECT id FROM email_templates WHERE name='New user')),
      (2, 'pl_PL', 'Witaj {{recipientName}}','Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
        (SELECT id FROM email_templates WHERE name='New user')),
      (3, 'en_US', 'Email Activation','Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>',
        (SELECT id FROM email_templates WHERE name='User email changed activate')),
      (4, 'pl_PL', 'Aktywacja email','Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>',
        (SELECT id FROM email_templates WHERE name='User email changed activate'));
 `;
