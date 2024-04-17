import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileImageValidationPipe } from 'src/pipes/file-image.validation.pipe';
import { FilesService } from './files.service';
import { FileEntity } from './entities/file.entity';
import { Response } from 'express';
import { UpdateFileDto } from './dto/update-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // ---------- Create Image ---------- //

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  createFile(
    @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.filesService.createFile(file);
  }

  // ---------- Find One Image ---------- //

  @Get(':fileName')
  @HttpCode(HttpStatus.OK)
  async findOne(
    @Param('fileName') fileName: FileEntity['title'],
    @Res() res: Response,
  ) {
    await this.filesService.findOne(fileName);
    res.sendFile(fileName, { root: 'static' });
  }

  // ---------- Find All Images ---------- //

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  // ---------- Update Images Size ---------- //

  @Patch(':fileName')
  @HttpCode(HttpStatus.OK)
  async updateSize(
    @Param('fileName') fileName: FileEntity['title'],
    @Body() dto: UpdateFileDto,
    @Res() res: Response,
  ) {
    await this.filesService.updateSize(fileName, dto);
    res.sendFile(fileName, { root: 'static' });
  }

  // ---------- Delete Image ---------- //

  @Delete(':fileName')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('fileName') fileName: FileEntity['title']) {
    return this.filesService.remove(fileName);
  }
}
