import * as path from 'node:path';

import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { Config, SmtpEmail } from '../../configs/config.type';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<Config>) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<SmtpEmail>('smtpEmail').email,
            pass: configService.get<SmtpEmail>('smtpEmail').password,
          },
        },
        defaults: {
          from: 'No reply',
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
