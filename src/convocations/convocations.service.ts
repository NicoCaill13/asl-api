import { Injectable } from '@nestjs/common';

import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ConvocationsService {
  async generateAndSend(html: string, email: string): Promise<any> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    const transporter = nodemailer.createTransport({
      // Configuration de votre service de messagerie a changer
      //   service: 'gmail',
      //   auth: {
      //     user: 'ton.email@gmail.com',
      //     pass: 'mot-de-passe-app',
      //   },
    });

    const info = await transporter.sendMail({
      from: '"SyndicApp 👩‍💼" <ton.email@gmail.com>',
      to: email,
      subject: 'Votre convocation à l’Assemblée Générale',
      text: 'Veuillez trouver en pièce jointe la convocation.',
      attachments: [
        {
          filename: 'convocation.pdf',
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    return {
      success: true,
      message: 'Convocation envoyée avec succès',
      messageId: info.messageId,
    };
  }
}
