import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/authentication/guards/jwt-auth.guard';
import { Role } from '@/types';
import { RolesGuard } from '@/authentication/guards/role-auth.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getOverview() {
    return await this.analyticsService.getOverview();
  }
}
