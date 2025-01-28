import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { User } from '@/common/decorators/user.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/update')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User('userId') userId: string,
  ) {
    return await this.userService.updateOne(userId, body);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@User('userId') userId: string) {
    return await this.userService.getOne(userId);
  }
}
