import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileImageValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    const fileType = file.mimetype;
    if (!fileType.startsWith('image/'))
      throw new BadRequestException(
        'Invalid file type. Only images (like jpg, jpeg, png, etc.) are allowed.',
      );

    return file;
  }
}
