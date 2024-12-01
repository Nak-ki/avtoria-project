import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { emailConstants } from './constants/email.constants';
import { EmailTypeEnum } from './enums/email-type.enum';
import { EmailTypeToPayload } from './types/email-type-to-payload.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public async sendMail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayload[T],
  ): Promise<void> {
    const { subject, templateName } = emailConstants[type];
    const path = `${__dirname.split('dist')[0]}/src/modules/emails/templates`;
    console.log(templateName, path);

    await this.mailerService.sendMail({
      to,
      from: 'test.gmail.com',
      subject,
      template: `${path}/${templateName}`,
      context,
    });
  }
}
