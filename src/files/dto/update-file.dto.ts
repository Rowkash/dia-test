import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateFileDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 500 })
  @IsNumber()
  width: number;
}
