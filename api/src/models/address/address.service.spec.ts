import { NotAcceptableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';

import { AddressService } from './address.service';
import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

// --- helpers ----------------------------------------------------------------

const createMockDb = () => ({
  address: {
    create: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn().mockResolvedValue(0),
  },
  user: {
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  },
});

const chainable = (resolvedValue: any = []) => ({
  select: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue(resolvedValue),
});

// --- suite ------------------------------------------------------------------

describe('AddressService', () => {
  let service: AddressService;
  let db: ReturnType<typeof createMockDb>;

  const userId = new mongoose.Types.ObjectId().toString();

  beforeEach(async () => {
    db = createMockDb();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: DATABASE_MODELS_TOKEN, useValue: db },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  // ---------- create --------------------------------------------------------

  describe('create', () => {
    const body = {
      fullName: 'John Doe',
      phoneNumber: '123456789',
      addressLine1: '123 Main St',
      city: 'TestCity',
      state: 'TS',
      postalCode: '12345',
      country: 'US',
    };

    it('should create an address and link to user', async () => {
      const createdAddress = { _id: new mongoose.Types.ObjectId(), ...body };
      (db.address.create as jest.Mock).mockResolvedValue(createdAddress);

      const result = await service.create(body as any, userId);

      expect(result.statusCode).toBe(201);
      expect(result.message).toBe('Address created successfully');
      expect(db.user.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        $push: { addresses: createdAddress._id },
      });
    });

    it('should throw if address creation fails', async () => {
      (db.address.create as jest.Mock).mockResolvedValue(null);

      await expect(service.create(body as any, userId)).rejects.toThrow(
        NotAcceptableException,
      );
    });
  });

  // ---------- update --------------------------------------------------------

  describe('update', () => {
    const addressId = new mongoose.Types.ObjectId().toString();

    it('should update an address', async () => {
      (db.address.find as jest.Mock).mockResolvedValue([]);
      (db.address.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: addressId,
        fullName: 'Updated Name',
      });

      const result = await service.update(
        addressId,
        { fullName: 'Updated Name' } as any,
        userId,
      );

      expect(result.statusCode).toBe(200);
      expect(result.message).toBe('Address updated successfully');
    });

    it('should unset other defaults when setting isDefault', async () => {
      const otherId = new mongoose.Types.ObjectId();
      const otherAddress = { _id: otherId, isDefault: true };

      (db.address.find as jest.Mock).mockResolvedValue([
        otherAddress,
        { _id: addressId, isDefault: false },
      ]);
      (db.address.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: addressId,
        isDefault: true,
      });

      await service.update(addressId, { isDefault: true } as any, userId);

      expect(db.address.findByIdAndUpdate).toHaveBeenCalledWith(otherId, {
        isDefault: false,
      });
    });

    it('should throw if address not found', async () => {
      (db.address.find as jest.Mock).mockResolvedValue([]);
      (db.address.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update(addressId, { fullName: 'X' } as any, userId),
      ).rejects.toThrow(NotAcceptableException);
    });
  });

  // ---------- delete --------------------------------------------------------

  describe('delete', () => {
    const addressId = new mongoose.Types.ObjectId().toString();

    it('should delete address and unlink from user', async () => {
      (db.address.findOneAndDelete as jest.Mock).mockResolvedValue({
        _id: addressId,
      });

      const result = await service.delete(addressId, userId);

      expect(result.statusCode).toBe(200);
      expect(db.user.findByIdAndUpdate).toHaveBeenCalledWith(userId, {
        $pull: { addresses: addressId },
      });
    });

    it('should throw if address not found', async () => {
      (db.address.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(addressId, userId)).rejects.toThrow(
        NotAcceptableException,
      );
    });
  });

  // ---------- getAll --------------------------------------------------------

  describe('getAll', () => {
    it('should return paginated addresses with count', async () => {
      const addresses = [{ _id: '1' }, { _id: '2' }];
      (db.address.find as jest.Mock).mockReturnValue(chainable(addresses));
      (db.address.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await service.getAll({ page: 1, limit: 10 } as any, userId);

      expect(result.statusCode).toBe(200);
      expect(result.addresses).toEqual(addresses);
      expect(result.totalAddresses).toBe(2);
    });
  });
});
