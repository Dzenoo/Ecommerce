import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { updateProfile } from '@/lib/actions/user.actions';

import { UpdateProfileDto } from '@/types';

import { useToast } from '../core/use-toast';

enum UserMutationType {
  UPDATE = 'UPDATE',
}

type UserMutationPayload = {
  type: UserMutationType.UPDATE;
  data: UpdateProfileDto;
};

const useUserMutation = (
  options?: Omit<
    UseMutationOptions<any, any, UserMutationPayload>,
    'mutationFn'
  >,
) => {
  const { toast } = useToast();

  const mutationFn = (payload: UserMutationPayload) => {
    switch (payload.type) {
      case UserMutationType.UPDATE:
        return updateProfile(payload.data);
      default:
        throw new Error('Invalid mutation type');
    }
  };

  const mutation = useMutation({
    mutationFn,
    onError: (error: any) => {
      toast({ title: 'Error', description: error?.response?.data?.message });
    },
    ...options,
  });

  return mutation;
};

export { useUserMutation, UserMutationType };
