import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ClerkAuthGuard } from '@/common/guards/clerk-auth.guard';
import { Role } from '@/types';
import { ClerkRolesGuard } from '@/common/guards/clerk-roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('/analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @UseGuards(ClerkAuthGuard, ClerkRolesGuard)
  @Roles(Role.Admin)
  async getAnalytics() {
    return await this.analyticsService.getAnalytics();
  }
}
