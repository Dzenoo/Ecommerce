import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

@Injectable()
export class CartService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async findOne(query: any) {
    return this.db.cart.findOne(query);
  }

  async add(
    userId: string,
    productId: string,
    quantity: number,
    attributes: Record<string, any> = {},
  ): Promise<ResponseObject> {
    const product = await this.db.product.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0.');
    }

    let cart = await this.db.cart.findOne({ user: userId });
    if (!cart) {
      cart = await this.db.cart.create({ user: userId, items: [] });
      await this.db.user.findByIdAndUpdate(userId, {
        $set: { cart: cart._id },
      });
    }

    const existingProduct = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes),
    );

    const totalQuantity = existingProduct
      ? existingProduct.quantity + quantity
      : quantity;

    if (totalQuantity > product.stock) {
      throw new BadRequestException(
        `Not enough stock. Available: ${product.stock}, in cart: ${existingProduct?.quantity || 0}.`,
      );
    }

    if (existingProduct) {
      existingProduct.quantity = totalQuantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        attributes,
      });
    }

    cart.totalPrice = await this.calculateTotalPrice(cart.items);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.CREATED,
      cart,
      message: 'Product added to cart',
    };
  }

  async remove(userId: string, itemId: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      (item: any) => item._id.toString() !== itemId,
    );

    cart.totalPrice = await this.calculateTotalPrice(cart.items);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.OK,
      cart,
      message: 'Product removed successfully',
    };
  }

  async update(
    userId: string,
    itemId: string,
    action: 'increment' | 'decrement',
  ): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find((item: any) => item._id.toString() === itemId);
    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    if (action === 'increment') {
      const product = await this.db.product.findById(item.product.toString());
      if (!product || item.quantity + 1 > product.stock) {
        throw new BadRequestException('Not enough stock.');
      }
      item.quantity += 1;
    } else if (action === 'decrement') {
      if (item.quantity <= 1) {
        throw new BadRequestException('Quantity must be greater than 0.');
      }
      item.quantity -= 1;
    }

    cart.totalPrice = await this.calculateTotalPrice(cart.items);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.OK,
      cart,
    };
  }

  async get(userId: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({ user: userId }).populate({
      path: 'items.product',
      model: 'Product',
    });

    if (!cart) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        cart: {
          items: [],
        },
      };
    }

    // Keep cart.totalPrice consistent with current product pricing/discounts.
    cart.totalPrice = await this.calculateTotalPrice(cart.items);

    return {
      statusCode: HttpStatus.OK,
      cart,
    };
  }

  async clear(userId: string): Promise<ResponseObject> {
    const cart = await this.db.cart.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.db.user.findByIdAndUpdate(userId, {
      $set: { cart: null },
    });
    await this.db.cart.deleteOne({ user: userId });

    return {
      statusCode: HttpStatus.OK,
      message: 'Cart cleared',
    };
  }

  private async calculateTotalPrice(
    items: {
      product: any;
      quantity: number;
      attributes: Record<string, any>;
    }[],
  ): Promise<number> {
    if (items.length === 0) return 0;

    const productIds = items.map((item) =>
      String(item.product?._id ? item.product._id : item.product),
    );
    const products = await this.db.product.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let totalPrice = 0;
    for (const item of items) {
      const productId = String(item.product?._id ? item.product._id : item.product);
      const product = productMap.get(productId);
      if (product) {
        const discountPercent = product.discount ?? 0;
        const discountedUnitPrice =
          Math.round(product.price * (1 - discountPercent / 100) * 100) / 100;
        totalPrice += discountedUnitPrice * item.quantity;
      }
    }
    // Round to 2 decimals to avoid floating-point drift.
    return Math.round(totalPrice * 100) / 100;
  }
}
