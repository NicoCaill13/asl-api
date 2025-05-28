import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendFundCallDto } from './dto/create-fund-call.dto';

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
  async create(dto: SendFundCallDto): Promise<{ success: boolean }> {
    const { amount, date, installment, coOwners, message, reference, status } = dto;

    // Récupère les co-pros dans la BDD
    const coOwnersEntities = await this.prisma.coOwnership.findMany({
      where: { emailMain: { in: coOwners } },
      select: { id: true, emailMain: true, name: true },
    });
    if (coOwnersEntities.length !== coOwners.length) {
      throw new BadRequestException("Un ou plusieurs copropriétaires n'existent pas");
    }

    // Génère les échéances (mensuelles à partir de la date de départ)
    const dueDates = Array.from({ length: installment }, (_, i) => {
      const d = new Date(date);
      d.setMonth(d.getMonth() + i);
      return d;
    });

    // Création de l'appel de fonds principal + tous les paiements attendus
    await this.prisma.fundCall.create({
      data: {
        date: new Date(date),
        amount,
        statut: status ?? 'PENDING',
        reference,
        payments: {
          create: coOwnersEntities.flatMap((co) =>
            dueDates.map((due, i) => ({
              installment: i + 1,
              amountPaid: 0,
              paidAt: due, // Obligatoire ! Pas de null ici !
              dueDate: due, // Nullable
              coOwnership: {
                connect: { id: co.id },
              },
            }))
          ),
        },
      },
      include: { payments: true },
    });

    // Envoi individuel des mails
    for (const co of coOwnersEntities) {
      await this.transporter.sendMail({
        from: `"ASL" <${process.env.SMTP_USER}>`,
        to: co.emailMain,
        subject: `Nouvel appel de fonds - Réf. ${reference}`,
        html: `<p>Bonjour ${co.name ?? ''},<br>${message}</p>`,
      });
    }

    return { success: true };
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
