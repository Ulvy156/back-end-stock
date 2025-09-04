import { HttpException, Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';
import { FilePath } from './fileupload.type';
import { apiError } from 'src/common/helpers/apiError';

@Injectable()
export class FileuploadService {
  private readonly folder = 'uploads';

  // Upload a single file
  async uploadFile(
    file: Express.Multer.File,
    subfolder: FilePath,
  ): Promise<string> {
    if (!file) throw new HttpException('File is required', 400);

    // Make sure uploads folder exists
    const uploadDir = join(process.cwd(), this.folder, subfolder);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
    const filePath = join(uploadDir, uniqueName);

    // Save file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    await fs.writeFile(filePath, file.buffer as Buffer);

    // Return public path
    return process.env.BASE_URL + `/uploads/${subfolder}/${uniqueName}`;
  }

  // Optional: delete a file
  async deleteFile(filename: string, subfolder: FilePath) {
    const filePath = join(process.cwd(), this.folder, subfolder, filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      return apiError(err);
    }
  }
}
