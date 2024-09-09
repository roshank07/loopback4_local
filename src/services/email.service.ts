import {BindingScope, injectable} from '@loopback/core';
const nodemailer =require('nodemailer');

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // replace with your SMTP host
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'travel.roshan07@gmail.com', // replace with youtr email
        pass: 'iiwx uxhc osim magi', // replace with your email password
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: '"Riii" <travel.roshan07@gmail.com>', // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    };

    try {
    await this.transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
  }
}
