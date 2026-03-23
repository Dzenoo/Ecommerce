import { Controller, Get, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { User } from '@/common/decorators/user.decorator';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(ClerkAuthGuard)
  async getCurrentUser(@User('userId') userId: string) {
    return await this.userService.getOne(userId);
  }
}
