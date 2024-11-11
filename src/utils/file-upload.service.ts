import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

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
