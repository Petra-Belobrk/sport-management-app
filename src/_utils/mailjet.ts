import { Client } from 'node-mailjet';

export class MailjetService {
  static apiSend() {
    return new Client({
      apiKey: process.env.MJ_API_PUBLIC_KEY,
      apiSecret: process.env.MJ_API_PRIVATE_KEY,
    }).post('send', { version: 'v3.1' });
  }
}
