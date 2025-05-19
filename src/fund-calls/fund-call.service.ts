import { Injectable, InternalServerErrorException } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FundCallService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly prisma: PrismaService) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    console.log('user : ', user, ' pass : ', pass);

    if (!user || !pass) {
      throw new Error('Les variables SMTP_USER et SMTP_PASS sont requises.');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    this.transporter.verify((err, success) => {
      if (err) {
        console.error('Échec de la connexion SMTP :', err);
      } else {
        console.log('SMTP ready to send messages');
      }
    });
  }

  async create(dto: any, file: Express.Multer.File): Promise<{ success: boolean; messageId: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: `"ASL" <${process.env.SMTP_USER}>`,
        to: dto.email,
        subject: 'Appel de fonds',
        html: dto.message || 'Vous trouverez en pièce jointe l’appel de fonds.',
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ],
      });
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err) {
      console.error('Erreur d’envoi :', err);
      throw new InternalServerErrorException('Impossible d’envoyer l’appel de fonds');
    }
  }

  async findAll() {
    return this.prisma.fundCall.findMany({
      include: {
        payments: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.fundCall.findUnique({
      where: { id },
      include: {
        payments: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.fundCall.delete({ where: { id } });
  }

  async updateFundCall(id: number, dto: any) {
    return this.prisma.fundCall.update({
      where: { id },
      data: dto,
    });
  }
}
