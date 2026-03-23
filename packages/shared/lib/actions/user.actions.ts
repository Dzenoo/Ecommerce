import { IUser, UpdateProfileDto } from '../../types';
import { getApiHandler, patchApiHandler } from '../api';

export const updateProfile = async (
  data: UpdateProfileDto,
): Promise<ServerResponse> => {
  return await patchApiHandler('user/update', data);
};

export const getCurrentUser = async (): Promise<
  ServerResponse<{
    user: IUser;
  }>
> => {
  return await getApiHandler('user');
};
