import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';

import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/types';

import { User } from '@/common/decorators/user.decorator';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User('userId') userId: string,
  ) {
    return await this.userService.updateOne(userId, body);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  async getProfile(@User('userId') userId: string) {
    return await this.userService.getOne(userId);
  }
}
