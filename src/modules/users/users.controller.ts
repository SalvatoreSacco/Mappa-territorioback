import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { UsersService, User } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

export class CreateUserDto {
  @IsString() @MinLength(1) name: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.usersService.getUserById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() dto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(dto.name);
  }
}
