const config = require('../config');
const Mail = require('../models/mailModel');
const { TemplateLocale, Template } = require('../models/templateModel');
const Handlebars = require("handlebars");
const { formatAll } = require('../formatters/mailLocaleFormatter');
const emailService = require('../services/emailService');
const e = require('express');

import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { EmailTemplateService } from '../../application/services/email-template.service';
import { EmailSendRequestDto } from '../dtos/email-send-request.dto';


@Controller()
export class MailsController{
    constructor(private readonly emailTemplateService: EmailTemplateService) {}

    @Post()
 async send (@Body() emailSendRequestDto: EmailSendRequestDto ): Promise<void> {
    let mail = null;
    return Template.findOne(
        {
            where: {
                'name': emailSendRequestDto.templateName
            }
        })
        .then(template => {
            if (template) {
                return TemplateLocale
                    .findAll({
                        where: {
                            'templateId': template.id,
                            'locale': [emailSendRequestDto.locale, config.other.fallbackLocale]
                        }
                    })
            }
        })
        .then(templateLocales => {
            if (!templateLocales || templateLocales.length === 0) {
                throw new NotFoundException('Requested locale and fallback does not exists');
            }

            let templateLocale = templateLocales.find(element => element.locale === emailSendRequestDto.locale);
            if (!templateLocale) {
                templateLocale = templateLocales[0];
            }

            const templateSubject = Handlebars.compile(templateLocale.subject);
            const templateContents = Handlebars.compile(templateLocale.contents);

            const variables = Object.assign(
                emailTemplate.variables ?? {},
                {
                    recepientUserId: emailTemplate.recepient.userId,
                    recepientEmail: emailTemplate.recepient.email,
                    recepientName: emailTemplate.recepient.name
                }
            );
            return Mail.create({
                recepientUserId: emailTemplate.recepient.userId,
                recepientEmail: emailTemplate.recepient.email,
                recepientName: emailTemplate.recepient.name,
                subject: templateSubject(variables),
                contents: templateContents(variables)
            });
        })
        .then(email => {
            if (email) {
                mail = email;
                res.status(204).send();
                return emailService.send(email);
            }
        })
        .then(result => {
            if (result) {
                if (mail) {
                    mail.sent = Date.now();
                    return mail.save();
                }
                console.log(result);
            }
        })
        .catch(err => next(err));
}
}


