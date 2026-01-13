import {
  Controller,
  Post,
  Get,
  Param,
  NotFoundException,
  Body,
  BadRequestException,
  ParseUUIDPipe,
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

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid UUID format' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<Partial<User>> {

    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

}
