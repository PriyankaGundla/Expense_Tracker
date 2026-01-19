import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, Matches, MaxLength } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Title of the expense' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(100, { message: 'Title can be at most 100 characters' })
  title: string;

  @ApiProperty({ description: 'Category of the expense' })
  @IsNotEmpty({ message: 'Category is required' })
  @MaxLength(50, { message: 'Category can be at most 50 characters' })
  category: string;

  @ApiProperty({ description: 'Amount of the expense' })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, { message: 'Amount must be a number' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  amount: number;

  @ApiProperty({ description: 'Date of the expense in dd-mm-yyyy format' })
  @IsNotEmpty({ message: 'Date is required' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/, {
    message: 'Date must be in dd-mm-yyyy format',
  })
  date: string;
}
