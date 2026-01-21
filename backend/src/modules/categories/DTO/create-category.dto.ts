import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Category name is required' })
  @MaxLength(50, { message: 'Category name can be at most 50 characters' })
  @Matches(/^[a-zA-Z0-9 ]+$/, {
    message: 'Category name can only contain letters, numbers, and spaces',
  })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Icon is required' })
  @MaxLength(50, { message: 'Icon can be at most 50 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Icon can only contain letters, numbers, underscores, or dashes',
  })
  icon: string;
}
