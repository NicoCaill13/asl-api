import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as nodemailer from 'nodemailer';
import { SendAssemblyDto } from './dto/send-assembly.dto';

import { UpdateAssemblyDto } from './dto/update-assembly.dto';
import { FileUploadService } from 'src/utils/file-upload.service';

@Injectable()
export class assemblyService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly prisma: PrismaService,
    private fileUploadService: FileUploadService
  ) {
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

  private cleanFileName(fileName: string): string {
    return fileName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  async create(dto: SendAssemblyDto, file: Express.Multer.File): Promise<{ success: boolean; messageId: string }> {
    try {
      // Nettoyage du nom du fichier (si besoin)
      if (file) {
        file.originalname = this.cleanFileName(file.originalname);
      }

      // Enregistrement local du fichier dans "uploads/assemblee"
      const filePath = this.fileUploadService.uploadFile(file, 'assemblee');
      const info = await this.transporter.sendMail({
        from: `"ASL" <${process.env.SMTP_USER}>`,
        to: dto.email,
        subject: 'Convocation à l’Assemblée Générale',
        html: dto.message || 'Vous trouverez en pièce jointe la convocation.',
        attachments: [
          {
            filename: file.originalname,
            content: file.buffer,
          },
        ],
      });

      // Sauvegarde dans la base de données
      const assembly = await this.prisma.assembly.create({
        data: {
          date: new Date(dto.date),
          message: dto.message,
          filePath,
        },
      });
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err) {
      console.error('Erreur d’envoi :', err);
      throw new InternalServerErrorException('Impossible d’envoyer la convocation');
    }
  }

  async findAll() {
    console.log('📦 Récupération des assemblies...');
    return this.prisma.assembly.findMany();
  }

  async findOne(id: number) {
    return this.prisma.assembly.findUnique({
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.assembly.delete({ where: { id } });
  }

  async updateAssembly(id: number, dto: UpdateAssemblyDto) {
    return this.prisma.assembly.update({
      where: { id },
      data: dto,
    });
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
