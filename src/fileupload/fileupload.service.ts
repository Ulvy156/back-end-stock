import { BadRequestException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';
import { FilePath } from '../enum/fileupload.enum';
import { apiError } from 'src/common/helpers/apiError';

@Injectable()
export class FileuploadService {
  private readonly folder = 'uploads';

  // Upload a single file
  async uploadFile(
    file: Express.Multer.File,
    subfolder: FilePath,
  ): Promise<string> {
    if (!file) throw new BadRequestException('File is required');

    // Make sure uploads folder exists
    const uploadDir = join(process.cwd(), this.folder, subfolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
    const filePath = join(uploadDir, uniqueName);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    // Return public path
    return process.env.BASE_URL + `/uploads/${subfolder}/${uniqueName}`;
  }

  validateFile(
    file: Express.Multer.File | undefined,
    allowedTypes: string[],
    maxSizeMB: number,
  ): void {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const { mimetype, size } = file;
    const sizeInMB = size / (1024 * 1024);

    const isTypeValid = allowedTypes.some((type) => mimetype.includes(type));
    if (!isTypeValid) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedTypes.join(', ')}`,
      );
    }

    if (sizeInMB > maxSizeMB) {
      throw new BadRequestException(`File too large. Max size: ${maxSizeMB}MB`);
    }
  }

  async deleteFile(filename: string, subfolder: FilePath) {
    const filePath = join(process.cwd(), this.folder, subfolder, filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      return apiError(err);
    }
  }
}
