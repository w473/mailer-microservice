INSERT INTO `Templates` (name,`createdAt`, `updatedAt`) VALUES
('template 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('template 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `TemplatesLocales` (locale, subject, contents, templateId,`createdAt`, `updatedAt`) VALUES 
('pl_PL', 'pomidor','ziemniak pomidor', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('en_US', 'tomato','potato tomato', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('de_DE', 'tomate','kartofeln tomate', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('en_US', 'car','auto highway', (SELECT id FROM `Templates` WHERE name='template 2'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);