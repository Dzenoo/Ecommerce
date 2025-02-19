import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  FilterQuery,
  Model,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';

import { Cart } from './schema/cart.schema';

import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  async findAndUpdateMany(
    query: FilterQuery<Cart> = {},
    update: UpdateQuery<Cart> = {},
  ): Promise<UpdateWriteOpResult> {
    return await this.cartModel.updateMany(query, update).exec();
  }

  async findOneByIdAndUpdate(
    id: string,
    update: UpdateQuery<Cart> = {},
  ): Promise<void> {
    await this.cartModel.findByIdAndUpdate(id, update).exec();
  }

  async findOne(query: FilterQuery<Cart>): Promise<Cart> {
    return this.cartModel.findOne(query).lean().exec();
  }

  async add(
    userId: string,
    productId: string,
    quantity: number,
    attributes: Record<string, any>,
  ): Promise<ResponseObject> {
    const product = await this.productService.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
      await this.userService.findOneByIdAndUpdate(userId, {
        $set: { cart: cart._id },
      });
    }

    const existingProduct = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        JSON.stringify(item.attributes) === JSON.stringify(attributes),
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        attributes,
      });
    }

    cart.totalPrice = await this.calculateTotalPrice(cart);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.CREATED,
      cart,
    };
  }

  async remove(userId: string, productId: string): Promise<ResponseObject> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = await this.calculateTotalPrice(cart);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.OK,
      cart,
    };
  }

  async update(
    userId: string,
    productId: string,
    quantity: number,
    action: 'increment' | 'decrement',
  ): Promise<ResponseObject> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (!item) {
      throw new NotFoundException('Product not found in cart');
    }

    if (action === 'increment') {
      item.quantity += quantity;
    } else if (action === 'decrement') {
      item.quantity -= quantity;

      if (item.quantity <= 0) {
        cart.items = cart.items.filter(
          (item: any) => item.product._id.toString() !== productId,
        );
      }
    }

    cart.totalPrice = await this.calculateTotalPrice(cart);
    cart.isActive = cart.items.length > 0;

    await cart.save();

    return {
      statusCode: HttpStatus.OK,
      cart,
    };
  }

  async get(userId: string): Promise<ResponseObject> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    return {
      statusCode: HttpStatus.OK,
      cart,
    };
  }

  async clear(userId: string): Promise<ResponseObject> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.userService.findOneByIdAndUpdate(userId, {
      $set: { cart: null },
    });
    await this.cartModel.deleteOne({ user: userId });

    return {
      statusCode: HttpStatus.OK,
      message: 'Cart cleared',
    };
  }

  private async calculateTotalPrice(cart: Cart): Promise<number> {
    let totalPrice = 0;
    for (const item of cart.items) {
      const product = await this.productService.findById(
        item.product.toString(),
      );
      if (product) {
        totalPrice += product.price * item.quantity;
      }
    }
    return totalPrice;
  }
}
