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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // ---------- Create Image ---------- //

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  createFile(
    @UploadedFile(new FileImageValidationPipe()) file: Express.Multer.File,
  ) {
    return this.filesService.createFile(file);
  }

  // ---------- Find One Image ---------- //

  @Get(':fileName')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'fileName' })
  @ApiOperation({ summary: 'Find image by name' })
  async findOne(
    @Param('fileName') fileName: FileEntity['title'],
    @Res() res: Response,
  ) {
    await this.filesService.findOne(fileName);
    res.sendFile(fileName, { root: 'static' });
  }

  // ---------- Find All Images ---------- //

  @Get()
  @ApiOperation({ summary: 'Find all images' })
  @ApiOkResponse({ type: [FileEntity] })
  findAll() {
    return this.filesService.findAll();
  }

  // ---------- Update Images Size ---------- //

  @Patch(':fileName')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'fileName' })
  @ApiOperation({ summary: 'Update image size' })
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
  @ApiParam({ name: 'fileName' })
  @ApiOperation({ summary: 'Delete image' })
  remove(@Param('fileName') fileName: FileEntity['title']) {
    return this.filesService.remove(fileName);
  }
}
