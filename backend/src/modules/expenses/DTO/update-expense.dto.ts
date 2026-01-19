import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Matches, IsOptional } from 'class-validator';

export class UpdateExpenseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'date must be in dd-mm-yyyy format',
  })
  date?: string;
}
