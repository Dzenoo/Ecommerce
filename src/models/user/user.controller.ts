import { Controller, Delete, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateProfile() {}

  @Delete('/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProfile() {}

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile() {}
}
