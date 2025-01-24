import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

@Injectable()
export class FileService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get('AWS_REGION');

    this.s3Client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadFiles(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<{ key: string; url: string }[]> {
    const uploadPromises = files.map(async (file) => {
      const key = `${Date.now()}-${file.originalname}`;
      const uploadParams = {
        Bucket: this.configService.get('AWS_BUCKET'),
        Key: `${folder}/${key}`,
        Body: file.buffer,
      };

      const upload = new Upload({
        client: this.s3Client,
        params: uploadParams,
      });

      await upload.done();

      const url = `https://${this.configService.get('AWS_BUCKET')}.s3.${this.configService.get(
        'AWS_REGION',
      )}.amazonaws.com/${folder}/${key}`;

      return { key, url };
    });

    return Promise.all(uploadPromises);
  }

  async uploadFile(
    file: Express.Multer.File,
    key: string,
    folder: string,
  ): Promise<void> {
    const uploadParams = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: `${folder}/${key}`,
      Body: file.buffer,
    };

    const upload = new Upload({
      client: this.s3Client,
      params: uploadParams,
    });

    await upload.done();
  }

  async deleteFiles(keys: string[], folder: string): Promise<void> {
    const deletePromises = keys.map(async (key) => {
      const deleteParams = {
        Bucket: this.configService.get('AWS_BUCKET'),
        Key: `${folder}/${key}`,
      };
      const command = new DeleteObjectCommand(deleteParams);
      await this.s3Client.send(command);
    });

    await Promise.all(deletePromises);
  }

  async deleteFile(key: string, folder: string): Promise<void> {
    const deleteParams = {
      Bucket: this.configService.get('AWS_BUCKET'),
      Key: `${folder}/${key}`,
    };
    const command = new DeleteObjectCommand(deleteParams);
    await this.s3Client.send(command);
  }
}
