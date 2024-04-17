import { IsNumber } from 'class-validator';

export class UpdateFileDto {
  @IsNumber()
  height: number;

  @IsNumber()
  width: number;
}
