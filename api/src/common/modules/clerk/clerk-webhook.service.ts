import { Inject, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '../database/database.types';

@Injectable()
export class ClerkWebhookService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async handleUserCreated(userData: any) {
    try {
      const existingUser = await this.db.user.findOne({
        clerkId: userData.id,
      });
      if (existingUser) return existingUser;

      const email = this.extractPrimaryEmail(userData);
      const username =
        userData.username || userData.first_name || email.split('@')[0];

      return this.db.user.create({
        clerkId: userData.id,
        email,
        username,
      });
    } catch (error) {
      console.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserUpdated(userData: any) {
    try {
      const user = await this.db.user.findOne({ clerkId: userData.id });
      if (!user) {
        console.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      const update: Record<string, any> = {};
      const email = this.extractPrimaryEmail(userData);
      if (email) update.email = email;
      if (userData.first_name) update.username = userData.first_name;

      if (Object.keys(update).length > 0) {
        await this.db.user.findByIdAndUpdate(
          (user as any)._id.toString(),
          update,
        );
      }
    } catch (error) {
      console.error(`Failed to update user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async handleUserDeleted(userData: any) {
    try {
      const user = await this.db.user.findOne({ clerkId: userData.id });
      if (!user) {
        console.warn(`User not found for clerkId: ${userData.id}`);
        return;
      }

      const userId = (user as any)._id.toString();

      // Cancel any active orders and restore stock
      const activeOrders = await this.db.order.find({
        user: userId,
        status: { $in: ['Pending', 'Processing'] },
      });

      for (const order of activeOrders) {
        for (const item of order.items) {
          await this.db.product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
        order.status = 'Cancelled';
        await order.save();
      }

      // Remove user reviews, update product review arrays, and recalculate ratings
      const reviews = await this.db.review.find({ user: userId });
      const affectedProductIds = [
        ...new Set(reviews.map((r) => r.product.toString())),
      ];

      for (const review of reviews) {
        await this.db.product.findByIdAndUpdate(review.product, {
          $pull: { reviews: review._id },
        });
      }

      await Promise.all([
        this.db.cart.deleteMany({ user: userId }),
        this.db.address.deleteMany({ user: userId }),
        this.db.wishlist.deleteMany({ user: userId }),
        this.db.review.deleteMany({ user: userId }),
        this.db.user.deleteOne({ _id: userId }),
      ]);

      // Recalculate average ratings for all affected products
      for (const productId of affectedProductIds) {
        const result = await this.db.review.aggregate([
          {
            $match: {
              product: new mongoose.Types.ObjectId(productId),
            },
          },
          { $group: { _id: null, avgRating: { $avg: '$rating' } } },
        ]);
        const averageRating =
          result.length > 0 ? Math.round(result[0].avgRating * 10) / 10 : 0;
        await this.db.product.findByIdAndUpdate(productId, { averageRating });
      }

      console.log(`User ${userId} and related data deleted`);
    } catch (error) {
      console.error(`Failed to delete user: ${error.message}`, error.stack);
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
