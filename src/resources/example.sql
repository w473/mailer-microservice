INSERT INTO `Templates` (name,`createdAt`, `updatedAt`) VALUES
('New user', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('User new email', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `TemplatesLocales` (locale, subject, contents, templateId,`createdAt`, `updatedAt`) VALUES 
('en_US', 'Hello {{recepientName}}',
'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>', 
(SELECT id FROM `Templates` WHERE name='New user'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('pl_PL', 'Witaj {{recepientName}}',
'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>', 
(SELECT id FROM `Templates` WHERE name='New user'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('en_US', 'Email Activation',
'Hi<br> please confirm you email by clicking <a href="{{activationURL}}">here</a>', 
(SELECT id FROM `Templates` WHERE name='User new email'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('pl_PL', 'Aktywacja email',
'Hej<br> potwierdź swój email klikając <a href="{{activationURL}}">tutaj</a>', 
(SELECT id FROM `Templates` WHERE name='User new email'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);