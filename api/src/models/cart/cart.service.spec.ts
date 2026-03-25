import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';

import { CartService } from './cart.service';
import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

// --- helpers ----------------------------------------------------------------

const makeDoc = <T extends Record<string, any>>(data: T) =>
  ({ ...data, save: jest.fn().mockResolvedValue(data) }) as T & {
    save: jest.Mock;
  };

const createMockDb = () => ({
  cart: {
    findOne: jest.fn(),
    create: jest.fn(),
    deleteOne: jest.fn().mockResolvedValue({}),
  },
  product: {
    findOne: jest.fn(),
    find: jest.fn().mockResolvedValue([]),
  },
  user: {
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  },
});

// --- suite ------------------------------------------------------------------

describe('CartService', () => {
  let service: CartService;
  let db: ReturnType<typeof createMockDb>;

  const userId = new mongoose.Types.ObjectId().toString();
  const productId = new mongoose.Types.ObjectId().toString();

  const fakeProduct = {
    _id: new mongoose.Types.ObjectId(productId),
    name: 'Widget',
    price: 25,
    discount: 20,
    stock: 10,
  };

  beforeEach(async () => {
    db = createMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: DATABASE_MODELS_TOKEN, useValue: db },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  // ---------- add -----------------------------------------------------------

  describe('add', () => {
    it('should create a new cart and add product', async () => {
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);
      (db.cart.findOne as jest.Mock).mockResolvedValue(null);

      const newCart = makeDoc({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        items: [],
        totalPrice: 0,
        isActive: false,
      });
      (db.cart.create as jest.Mock).mockResolvedValue(newCart);

      // After adding, calculateTotalPrice will call db.product.find
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);

      const result = await service.add(userId, productId, 2);

      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Product added to cart');
      expect(newCart.items).toHaveLength(1);
      expect(newCart.items[0].quantity).toBe(2);
    });

    it('should throw if product not found', async () => {
      (db.product.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.add(userId, productId, 1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if quantity is 0', async () => {
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);

      await expect(service.add(userId, productId, 0)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if requested quantity exceeds stock', async () => {
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);
      (db.cart.findOne as jest.Mock).mockResolvedValue(null);

      const cart = makeDoc({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        items: [],
      });
      (db.cart.create as jest.Mock).mockResolvedValue(cart);

      await expect(service.add(userId, productId, 999)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should increment quantity for duplicate product+attributes', async () => {
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);

      const existingItem = {
        product: new mongoose.Types.ObjectId(productId),
        quantity: 2,
        attributes: { color: 'red' },
      };
      // Make product.toString() work for the comparison
      existingItem.product.toString = () => productId;

      const cart = makeDoc({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        items: [existingItem],
        totalPrice: 0,
        isActive: true,
      });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);

      const result = await service.add(userId, productId, 1, { color: 'red' });

      expect(result.statusCode).toBe(201);
      expect(existingItem.quantity).toBe(3);
    });
  });

  // ---------- remove --------------------------------------------------------

  describe('remove', () => {
    it('should remove item from cart', async () => {
      const itemId = new mongoose.Types.ObjectId().toString();
      const cart = makeDoc({
        user: userId,
        items: [{ _id: { toString: () => itemId }, product: productId, quantity: 1 }],
        totalPrice: 25,
        isActive: true,
      });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);
      (db.product.find as jest.Mock).mockResolvedValue([]);

      const result = await service.remove(userId, itemId);

      expect(result.statusCode).toBe(200);
      expect(cart.items).toHaveLength(0);
      expect(cart.isActive).toBe(false);
    });

    it('should throw if cart not found', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.remove(userId, 'someItemId'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ---------- update --------------------------------------------------------

  describe('update', () => {
    const itemId = new mongoose.Types.ObjectId().toString();

    it('should increment item quantity', async () => {
      const item = {
        _id: { toString: () => itemId },
        product: new mongoose.Types.ObjectId(productId),
        quantity: 2,
        attributes: {},
      };
      item.product.toString = () => productId;

      const cart = makeDoc({
        user: userId,
        items: [item],
        totalPrice: 0,
        isActive: true,
      });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);

      const result = await service.update(userId, itemId, 'increment');

      expect(result.statusCode).toBe(200);
      expect(item.quantity).toBe(3);
    });

    it('should decrement item quantity', async () => {
      const item = {
        _id: { toString: () => itemId },
        product: new mongoose.Types.ObjectId(productId),
        quantity: 3,
        attributes: {},
      };

      const cart = makeDoc({
        user: userId,
        items: [item],
        totalPrice: 0,
        isActive: true,
      });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);

      const result = await service.update(userId, itemId, 'decrement');

      expect(result.statusCode).toBe(200);
      expect(item.quantity).toBe(2);
    });

    it('should throw when decrementing below 1', async () => {
      const item = {
        _id: { toString: () => itemId },
        product: new mongoose.Types.ObjectId(productId),
        quantity: 1,
        attributes: {},
      };

      const cart = makeDoc({ user: userId, items: [item] });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);

      await expect(
        service.update(userId, itemId, 'decrement'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw when incrementing beyond stock', async () => {
      const item = {
        _id: { toString: () => itemId },
        product: new mongoose.Types.ObjectId(productId),
        quantity: 10, // already at stock limit
        attributes: {},
      };
      item.product.toString = () => productId;

      const cart = makeDoc({ user: userId, items: [item] });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);
      (db.product.findOne as jest.Mock).mockResolvedValue(fakeProduct);

      await expect(
        service.update(userId, itemId, 'increment'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ---------- clear ---------------------------------------------------------

  describe('clear', () => {
    it('should delete cart and unlink from user', async () => {
      const cart = makeDoc({ user: userId, items: [] });
      (db.cart.findOne as jest.Mock).mockResolvedValue(cart);

      const result = await service.clear(userId);

      expect(result.statusCode).toBe(200);
      expect(db.cart.deleteOne).toHaveBeenCalledWith({ user: userId });
      expect(db.user.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        $set: { cart: null },
      });
    });

    it('should throw if cart not found', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.clear(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
