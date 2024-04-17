import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { UpdateFileDto } from './dto/update-file.dto';
@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private filesRepository: Repository<FileEntity>,
  ) {}

  // ---------- Create Image ---------- //

  async createFile(file: Express.Multer.File) {
    const { fileName, savedFilePath } = this.saveFile(file);
    if (!savedFilePath) throw new BadRequestException('Error saving file');
    await this.filesRepository.save({ title: fileName });
    return fileName;
  }

  // ---------- Find All Images ---------- //

  findAll() {
    return this.filesRepository.find();
  }

  // ---------- Find One Image ---------- //

  async findOne(title: FileEntity['title']) {
    const image = await this.filesRepository.findOne({ where: { title } });
    if (!image) throw new NotFoundException('Image not Found');
    const fileBuffer = this.readFile(image.title);
    if (!fileBuffer) throw new BadRequestException('Error reading image');
    return fileBuffer;
  }

  // ---------- Update Images Size ---------- //

  async updateSize(title: FileEntity['title'], dto: UpdateFileDto) {
    const image = await this.filesRepository.findOne({ where: { title } });
    if (!image) return;
    const fileBuffer = this.readFile(image.title);
    if (!fileBuffer) throw new BadRequestException('Error reading image');

    const imageData = await sharp(fileBuffer).metadata();
    const { width, height } = imageData;
    if (width < dto.width)
      throw new BadRequestException(`Width should less than ${width}`);
    if (height < dto.height)
      throw new BadRequestException(`Width should less than ${height}`);

    const editedImageBuffer = await sharp(fileBuffer)
      .resize({
        width: dto.width,
        height: dto.height,
        fit: 'inside',
      })
      .toBuffer();

    fs.writeFileSync(path.join('static', title), editedImageBuffer);
    return fileBuffer;
  }

  // ---------- Delete Image ---------- //

  async remove(title: FileEntity['title']) {
    const image = await this.findOne(title);
    if (!image) return;
    return await this.filesRepository.delete({ title });
  }

  // ---------- Save File ---------- //

  private saveFile(file: Express.Multer.File) {
    const fileName = file.originalname;
    const filePath = path.resolve('static');
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    fs.writeFileSync(path.join(filePath, fileName), file.buffer);
    const savedFilePath = path.join(filePath, fileName);
    if (!fs.existsSync(savedFilePath)) null;

    return { fileName, savedFilePath };
  }

  // ---------- Read File ---------- //

  private readFile(fileName: string) {
    const filePath = path.join('static', fileName);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return fileBuffer;
    }
    return null;
  }
}
