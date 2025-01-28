import { SigninDto, SignupDto } from '@/types';

import { getApiHandler, postApiHandler } from '../api';

export const signup = async (
  data: SignupDto,
): Promise<
  ServerResponse<{
    redirectUrl?: string;
  }>
> => {
  return await postApiHandler('auth/signup', data);
};

export const signin = async (data: SigninDto): Promise<ServerResponse> => {
  return await postApiHandler('auth/signin', data);
};

export const getCurrentUser = async (): Promise<
  ServerResponse<{
    userId: string;
    role: 'user' | 'admin';
  }>
> => {
  return await getApiHandler('auth/me');
};

export const logout = async (): Promise<ServerResponse> => {
  return await postApiHandler('auth/logout', {});
};
