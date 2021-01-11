INSERT INTO `Templates` (name,`createdAt`, `updatedAt`) VALUES
('template 1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('template 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `TemplatesLocales` (locale, subject, contents, templateId,`createdAt`, `updatedAt`) VALUES 
('pl_PL', 'pomidor','ziemniak pomidor', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('en_US', 'tomato','potato tomato', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('de_DE', 'tomate','kartofeln tomate', (SELECT id FROM `Templates` WHERE name='template 1'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), 
('en_US', 'car','auto highway', (SELECT id FROM `Templates` WHERE name='template 2'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- CREATE TABLE `Mails` (
--   `id` int NOT NULL AUTO_INCREMENT,
--   `recepientUserId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
--   `recepientEmail` varchar(1024) NOT NULL,
--   `recepientName` varchar(1024) NOT NULL,
--   `contents` text NOT NULL,
--   `sent` datetime DEFAULT NULL,
--   `error` text,
--   `createdAt` datetime NOT NULL,
--   `updatedAt` datetime NOT NULL,
--   `templateId` int DEFAULT NULL,
--   `subject` text NOT NULL,
--   PRIMARY KEY (`id`),
--   KEY `templateId` (`templateId`),
--   CONSTRAINT `Mails_ibfk_1` FOREIGN KEY (`templateId`) REFERENCES `TemplatesLocales` (`id`) ON DELETE
--   SET
--     NULL ON UPDATE CASCADE
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;