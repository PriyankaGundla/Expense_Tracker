import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/create-user.dto';
import { User } from 'src/entities/users/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post('create-user')
  @ApiOperation({ summary: 'Create a new user (Signup)' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error / Email exists' })
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Partial<User>> {

    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    if (!createUserDto.acceptedTerms) {
      throw new BadRequestException('You must accept the Terms & Conditions');
    }

    const user = await this.userService.create(createUserDto);

    const { password, ...result } = user;
    return result;
  }
}
