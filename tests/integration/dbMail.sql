INSERT INTO Mails 
(templateId, recepientUserId, recepientEmail, recepientName, subject, contents, createdAt, updatedAt)
VALUES
(1, '00140f96-2fe8-475b-b80b-1de588cc43b1', 'some@email.de', 'herr mann', 'some subject', 'some contents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '91d4fd43-998a-4614-ae91-5d4971522fec', 'some@gogle.de', 'frau blum', 'some subject1', 'some1 contents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '08ed73c3-efd5-4608-97f5-c9a6b39e24b2', 'some@jahu.de', 'sir sth', 'some subject2', 'some2 contents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'b73140f0-d3c2-4b9d-9e21-f45130dd221a', 'some@huhuh.de', 'what ever', 'some subject3', 'some3 contents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
;