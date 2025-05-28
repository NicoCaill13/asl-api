import { Injectable, InternalServerErrorException, NotFoundException, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

import * as nodemailer from 'nodemailer';
import { SendAssemblyDto } from './dto/send-assembly.dto';

import { UpdateAssemblyDto } from './dto/update-assembly.dto';
import { FileUploadService } from 'src/utils/file-upload.service';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import { Assembly } from '@prisma/client';

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

  private buildFileUrl(filePath: string | null): string | null {
    if (!filePath) return null;
    const filename = filePath.split('/').pop();

    return filename ? `http://localhost:3000/contracts/download/${encodeURIComponent(filename)}` : null;
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
  async create(dto: SendAssemblyDto, file: Express.Multer.File): Promise<Assembly> {
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
        bcc: dto.participants,
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
      return await this.prisma.assembly.create({
        data: {
          date: new Date(dto.date),
          message: dto.message,
          filePath,
          participants: {
            create: dto.participants.map((email) => ({
              coOwnership: {
                connect: { emailMain: email },
              },
            })),
          },
        },
        include: {
          participants: {
            include: {
              coOwnership: {
                select: { emailMain: true },
              },
            },
          },
        },
      });

      // return {
      //   success: true,
      //   messageId: info.messageId,
      //   fileUrl: this.buildFileUrl(filePath),
      // };
    } catch (err) {
      console.error('Erreur d’envoi :', err);
      throw new InternalServerErrorException('Impossible d’envoyer la convocation');
    }
  }

  async findAll() {
    return this.prisma.assembly.findMany({
      include: {
        participants: {
          include: {
            coOwnership: {
              select: {
                emailMain: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: number | string) {
    return this.prisma.assembly.findUnique({
      where: { id: Number(id) },
      include: {
        participants: {
          include: {
            coOwnership: {
              select: { emailMain: true, name: true },
            },
          },
        },
      },
    });
  }

  remove(id: number) {
    return this.prisma.assembly.delete({ where: { id } });
  }

  async updateAssembly(id: number, dto: UpdateAssemblyDto) {
    console.log('DATA À METTRE À JOUR 👉', dto); // ← Ajoute ceci
    return this.prisma.assembly.update({
      where: { id },
      data: dto,
    });
  }

  async downloadAssembly(filename: string, res: Response): Promise<StreamableFile> {
    const filePath = join(process.cwd(), 'uploads', 'assemblee', filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException(`Fichier "${filename}" introuvable`);
    }

    // Configure ici les headers
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    const fileStream = createReadStream(filePath);
    return new StreamableFile(fileStream);
  }

  async storeFile(file: Express.Multer.File, folder: string): Promise<string> {
    return this.fileUploadService.uploadFile(file, folder);
  }
}
