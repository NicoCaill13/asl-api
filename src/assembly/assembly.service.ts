import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as nodemailer from 'nodemailer';

@Injectable()
export class AssemblyService {
  private transporter: nodemailer.Transporter;

  constructor() {
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

  async generateAndSend(html: string, email: string): Promise<{ success: boolean; messageId: string }> {
    try {
      const info = await this.transporter.sendMail({
        from: `"SyndicApp 👩‍💼" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Convocation à l’Assemblée Générale',
        html,
      });
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('Erreur d’envoi :', err);
      throw new InternalServerErrorException('Impossible d’envoyer la convocation');
    }
  }

  // // Méthode pour récupérer une assembly et ses participants
  // async findOneWithParticipants(id: number) {
  //   const assembly = await this.prisma.assembly.findUnique({
  //     where: { id },
  //     include: {
  //       participants: {
  //         include: { coOwnership: true },
  //       },
  //     },
  //   });

  //   if (!assembly) {
  //     throw new NotFoundException(`Assembly avec id ${id} introuvable`);
  //   }
  //   return assembly;
  // }
}
