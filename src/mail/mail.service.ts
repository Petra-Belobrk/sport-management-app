import { BadRequestException, Injectable } from '@nestjs/common';
import { MailjetService } from '../_utils/mailjet';
import { VerifyEmailDto } from './dto/mail.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  async sendVerifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    try {
      MailjetService.apiSend().request({
        Messages: [
          {
            From: {
              Email: this.configService.get<string>('MJ_FROM_EMAIL'),
              Name: this.configService.get<string>('MJ_FROM_NAME'),
            },
            To: [
              {
                Email: verifyEmailDto.toEmail,
                Name: verifyEmailDto.firstName,
              },
            ],
            Subject: 'Verify your email',
            HTMLPart: `<h1>Hello ${verifyEmailDto.firstName} </h1> <br> 
                        Please click on the following <a href="${verifyEmailDto.link}">LINK</a> 
                        to verify your email`,
          },
        ],
      });
    } catch (e) {
      throw new BadRequestException('Something went wrong');
    }
  }
}
