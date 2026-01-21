import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, MaxLength, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Category name' })
  @IsOptional()
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @MaxLength(50, { message: 'Category name can be at most 50 characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Category icon' })
  @IsOptional()
  @IsNotEmpty({ message: 'Icon cannot be empty' })
  @MaxLength(50, { message: 'Icon can be at most 50 characters' })
  icon?: string;
}
