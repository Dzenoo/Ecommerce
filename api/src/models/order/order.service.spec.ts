import { NotAcceptableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { OrderService } from './order.service';
import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

// --- helpers ----------------------------------------------------------------

/** Tiny stub that behaves like a Mongoose document with .save() */
const makeDoc = <T extends Record<string, any>>(data: T) =>
  ({ ...data, save: jest.fn().mockResolvedValue(data) }) as T & {
    save: jest.Mock;
  };

/** Build a mock DatabaseModels object with chainable query helpers */
const createMockDb = () => {
  const chainable = (resolvedValue: any = null) => {
    const chain: any = {
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(resolvedValue),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
    };
    return chain;
  };

  return {
    order: {
      create: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue(chainable([])),
      countDocuments: jest.fn().mockResolvedValue(0),
    },
    cart: {
      findOne: jest.fn(),
      deleteOne: jest.fn().mockResolvedValue({}),
    },
    product: {
      find: jest.fn().mockResolvedValue([]),
      findOneAndUpdate: jest.fn(),
    },
    address: {
      findOne: jest.fn(),
      findById: jest.fn(),
    },
    user: {
      findByIdAndUpdate: jest.fn().mockResolvedValue({}),
    },
  } as unknown as DatabaseModels;
};

// Fake mongoose connection whose session skips the real transaction machinery
const createMockConnection = () => ({
  startSession: jest.fn().mockResolvedValue({
    withTransaction: jest.fn(async (fn: () => Promise<any>) => fn()),
    endSession: jest.fn(),
  }),
});

// --- suite ------------------------------------------------------------------

describe('OrderService', () => {
  let service: OrderService;
  let db: ReturnType<typeof createMockDb>;
  let connection: ReturnType<typeof createMockConnection>;

  beforeEach(async () => {
    db = createMockDb();
    connection = createMockConnection();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: DATABASE_MODELS_TOKEN, useValue: db },
        { provide: getConnectionToken(), useValue: connection },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  // ---------- create --------------------------------------------------------

  describe('create', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const productId = new mongoose.Types.ObjectId();
    const cartId = new mongoose.Types.ObjectId().toString();
    const addressId = new mongoose.Types.ObjectId().toString();

    const fakeCart = {
      _id: cartId,
      user: userId,
      items: [{ product: productId, quantity: 2 }],
    };

    const fakeProduct = {
      _id: productId,
      name: 'Test Product',
      price: 50,
      discount: 10,
      stock: 10,
    };

    it('should create an order and deduct stock', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(fakeCart);
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);
      (db.address.findOne as jest.Mock).mockResolvedValue({ _id: addressId });
      (db.product.findOneAndUpdate as jest.Mock).mockResolvedValue(fakeProduct);

      const createdOrder = makeDoc({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        totalPrice: 90,
        status: 'Pending',
      });
      (db.order.create as jest.Mock).mockResolvedValue([createdOrder]);

      const result = await service.create(
        { cartId, addressId },
        userId,
      );

      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Order successfully created');
      // Stock decrement was called
      expect(db.product.findOneAndUpdate).toHaveBeenCalled();
      // Cart cleared
      expect(db.cart.deleteOne).toHaveBeenCalled();
    });

    it('should throw if cart not found', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ cartId, addressId }, userId),
      ).rejects.toThrow(NotAcceptableException);
    });

    it('should throw if cart is empty', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue({
        ...fakeCart,
        items: [],
      });

      await expect(
        service.create({ cartId, addressId }, userId),
      ).rejects.toThrow('Cart is empty');
    });

    it('should throw if address not found', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(fakeCart);
      (db.address.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create({ cartId, addressId }, userId),
      ).rejects.toThrow('Address not found');
    });

    it('should throw if neither addressId nor address provided', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(fakeCart);

      await expect(
        service.create({ cartId } as any, userId),
      ).rejects.toThrow('Either addressId or address details must be provided');
    });

    it('should throw if product stock is insufficient', async () => {
      const lowStockProduct = { ...fakeProduct, stock: 1 };
      (db.cart.findOne as jest.Mock).mockResolvedValue(fakeCart);
      (db.product.find as jest.Mock).mockResolvedValue([lowStockProduct]);
      (db.address.findOne as jest.Mock).mockResolvedValue({ _id: addressId });

      await expect(
        service.create({ cartId, addressId }, userId),
      ).rejects.toThrow(/Not enough stock/);
    });

    it('should freeze pricing with discount in order items', async () => {
      (db.cart.findOne as jest.Mock).mockResolvedValue(fakeCart);
      (db.product.find as jest.Mock).mockResolvedValue([fakeProduct]);
      (db.address.findOne as jest.Mock).mockResolvedValue({ _id: addressId });
      (db.product.findOneAndUpdate as jest.Mock).mockResolvedValue(fakeProduct);

      const createdOrder = makeDoc({ _id: new mongoose.Types.ObjectId() });
      (db.order.create as jest.Mock).mockResolvedValue([createdOrder]);

      await service.create({ cartId, addressId }, userId);

      const createCall = (db.order.create as jest.Mock).mock.calls[0];
      const orderData = createCall[0][0];

      // unitPrice = 50, discount = 10%, finalUnitPrice = 45
      expect(orderData.items[0].unitPrice).toBe(50);
      expect(orderData.items[0].discountPercent).toBe(10);
      expect(orderData.items[0].finalUnitPrice).toBe(45);
      // totalPrice = 45 * 2 = 90
      expect(orderData.totalPrice).toBe(90);
    });
  });

  // ---------- cancel --------------------------------------------------------

  describe('cancel', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const orderId = new mongoose.Types.ObjectId().toString();
    const productId = new mongoose.Types.ObjectId();

    const pendingOrder = makeDoc({
      _id: orderId,
      user: userId,
      status: 'Pending',
      items: [{ product: productId, quantity: 3 }],
    });

    it('should cancel a Pending order and restore stock', async () => {
      (db.order.findOne as jest.Mock).mockResolvedValue(pendingOrder);
      (db.product.findByIdAndUpdate as any) = jest.fn().mockResolvedValue({});

      const result = await service.cancel(orderId, userId);

      expect(result.statusCode).toBe(200);
      expect(pendingOrder.save).toHaveBeenCalled();
      // Stock restored
      expect(db.product.findByIdAndUpdate).toHaveBeenCalledWith(productId, {
        $inc: { stock: 3 },
      });
    });

    it('should throw if order not found', async () => {
      (db.order.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.cancel(orderId, userId)).rejects.toThrow(
        'Order not found',
      );
    });

    it('should throw if order is already cancelled', async () => {
      const cancelledOrder = makeDoc({ ...pendingOrder, status: 'Cancelled' });
      (db.order.findOne as jest.Mock).mockResolvedValue(cancelledOrder);

      await expect(service.cancel(orderId, userId)).rejects.toThrow(
        'Order is already cancelled',
      );
    });

    it('should throw if order status does not allow cancellation', async () => {
      const deliveredOrder = makeDoc({ ...pendingOrder, status: 'Delivered' });
      (db.order.findOne as jest.Mock).mockResolvedValue(deliveredOrder);

      await expect(service.cancel(orderId, userId)).rejects.toThrow(
        /Cannot cancel an order with status/,
      );
    });
  });

  // ---------- updateStatus --------------------------------------------------

  describe('updateStatus', () => {
    const orderId = new mongoose.Types.ObjectId().toString();
    const productId = new mongoose.Types.ObjectId();

    it('should transition Pending → Processing', async () => {
      const order = makeDoc({
        _id: orderId,
        status: 'Pending',
        items: [{ product: productId, quantity: 1 }],
      });
      (db.order.findById as jest.Mock).mockResolvedValue(order);

      const result = await service.updateStatus(orderId, 'Processing');

      expect(result.statusCode).toBe(200);
      expect(order.status).toBe('Processing');
      expect(order.save).toHaveBeenCalled();
    });

    it('should restore stock when cancelling via updateStatus', async () => {
      const order = makeDoc({
        _id: orderId,
        status: 'Processing',
        items: [{ product: productId, quantity: 5 }],
      });
      (db.order.findById as jest.Mock).mockResolvedValue(order);
      (db.product.findByIdAndUpdate as any) = jest.fn().mockResolvedValue({});

      await service.updateStatus(orderId, 'Cancelled');

      expect(db.product.findByIdAndUpdate).toHaveBeenCalledWith(productId, {
        $inc: { stock: 5 },
      });
    });

    it('should reject invalid status transitions', async () => {
      const order = makeDoc({ _id: orderId, status: 'Delivered', items: [] });
      (db.order.findById as jest.Mock).mockResolvedValue(order);

      await expect(
        service.updateStatus(orderId, 'Shipped'),
      ).rejects.toThrow(/Cannot transition from/);
    });

    it('should throw if order not found', async () => {
      (db.order.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateStatus(orderId, 'Processing'),
      ).rejects.toThrow('Order not found');
    });
  });

  // ---------- getOne --------------------------------------------------------

  describe('getOne', () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const orderId = new mongoose.Types.ObjectId().toString();

    it('should return order for the owner', async () => {
      const chain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: orderId,
          user: { _id: userId },
          address: {},
        }),
      };
      (db.order.findById as jest.Mock).mockReturnValue(chain);

      const result = await service.getOne(orderId, userId, 'user');

      expect(result.statusCode).toBe(200);
      expect(result.order).toBeDefined();
    });

    it('should throw if non-owner non-admin tries to view', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const chain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: orderId,
          user: { _id: userId },
          address: {},
        }),
      };
      (db.order.findById as jest.Mock).mockReturnValue(chain);

      await expect(
        service.getOne(orderId, otherUserId, 'user'),
      ).rejects.toThrow('Not authorized to view this order');
    });

    it('should allow admin to view any order', async () => {
      const otherUserId = new mongoose.Types.ObjectId().toString();
      const chain = {
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          _id: orderId,
          user: { _id: userId },
          address: {},
        }),
      };
      (db.order.findById as jest.Mock).mockReturnValue(chain);

      const result = await service.getOne(orderId, otherUserId, 'admin');

      expect(result.statusCode).toBe(200);
    });
  });
});
