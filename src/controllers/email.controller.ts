import {inject} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {EmailService} from '../services/email.service';

export class EmailController {
  constructor(
    @inject('services.EmailService') protected emailService: EmailService,
  ) {}

  @post('/send-email')
  async sendEmail(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              to: {type: 'string'},
              subject: {type: 'string'},
              text: {type: 'string'}
            },
          },
        },
      },
    })
    emailData: {to: string; subject: string; text: string},
  ): Promise<void> {
    const {to, subject, text} = emailData;
    const html =
  "<html>" +
    "<body>" +
      "<p>Hi Roshan,</p>" +
      "<p>Greetings from NIB</p><br>" +
      "<p>Click on the link below to activate your email:</p>" +
      "<p><a href=\"http://nib.bank.com/verify\">&lt;&lt;&lt;&lt;&lt;Click Here&gt;&gt;&gt;&gt;&gt;</a></p>" +
      "<p>or copy the link below:</p>" +
      "<p><a href=\"http://nib.bank.com/verify\">http://nib.bank.com/verify</a></p>" +
      "<hr>" +
      "<p>DIS:</p>" +
      "<p>Send us feedback at <a href=\"mailto:help@nib.com\">help@nib.com</a></p>" +
    "</body>" +
  "</html>";


    await this.emailService.sendMail(to, subject, text, html);
  }
}
