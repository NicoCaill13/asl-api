import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { promises as fs } from 'fs';

@Injectable()
export class FileUploadService {
  uploadFile(file: Express.Multer.File, folder: string): string {
    const uploadDir = join(process.cwd(), 'uploads', folder);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, `${Date.now()}-${file.originalname}`);

    try {
      writeFileSync(filePath, file.buffer);
      return filePath;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }
}

@Injectable()
export class fileUploadService {
  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadsDir = join(process.cwd(), 'uploads', folder);
    await fs.mkdir(uploadsDir, { recursive: true });
    // Nettoyage du nom + timestamp pour éviter les collisions
    const filename = `${Date.now()}-${file.originalname}`;
    const fullPath = join(uploadsDir, filename);
    await fs.writeFile(fullPath, file.buffer);
    // Retourne le chemin relatif tel qu’on le stocke en DB
    return `/${folder}/${filename}`;
  }
}
