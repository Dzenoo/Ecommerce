import {
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  DATABASE_MODELS_TOKEN,
  DatabaseModels,
} from '@/common/modules/database/database.types';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_MODELS_TOKEN)
    private readonly db: DatabaseModels,
  ) {}

  async getOne(id: string): Promise<ResponseObject> {
    const user = await this.db.user.findById(id);

    if (!user) throw new NotFoundException('User not found');

    return {
      statusCode: HttpStatus.OK,
      user,
    };
  }
}
