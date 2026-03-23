import { Injectable, Logger } from '@nestjs/common';

import { UserService } from '@/models/user/user.service';

@Injectable()
export class ClerkWebhookService {
  private readonly logger = new Logger(ClerkWebhookService.name);

  constructor(private readonly userService: UserService) {}

  async handleUserCreated(userData: any) {
    try {
      const existingUser = await this.userService.findOne({
        clerkId: userData.id,
      });
      if (existingUser) return existingUser;

      return this.userService.createOne({
        clerkId: userData.id,
        email: this.extractPrimaryEmail(userData),
        username: userData.first_name,
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserUpdated(userData: any) {
    try {
      const user = await this.userService.findOne({ clerkId: userData.id });
      if (!user) {
        this.logger.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      const update: Record<string, any> = {};
      const email = this.extractPrimaryEmail(userData);
      if (email) update.email = email;
      if (userData.first_name) update.username = userData.first_name;

      if (Object.keys(update).length > 0) {
        await this.userService.findOneByIdAndUpdate(
          (user as any)._id.toString(),
          update,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserDeleted(userData: any) {
    try {
      const user = await this.userService.findOne({ clerkId: userData.id });
      if (!user) {
        this.logger.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      await this.userService.deleteOne((user as any)._id.toString());
    } catch (error) {
      this.logger.error(`Failed to delete user: ${error.message}`, error.stack);
      throw error;
    }
  }

  private extractPrimaryEmail(userData: any): string {
    return (
      userData.email_addresses?.find(
        (e: any) => e.id === userData.primary_email_address_id,
      )?.email_address || ''
    );
  }
}
