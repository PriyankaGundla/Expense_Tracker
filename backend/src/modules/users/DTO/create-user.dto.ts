import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {

  @ApiProperty({
    description: 'Full name of the user',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z ]+$/, {
    message: 'Name can contain only letters and spaces',
  })
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: 'Valid email address',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters, include uppercase, lowercase, number & special character',
    minLength: 8,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    {
      message:
        'Password must contain uppercase, lowercase, number, and special character',
    },
  )
  password: string;
}
