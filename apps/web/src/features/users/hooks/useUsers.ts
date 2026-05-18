import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { CreateUserDto, UpdateUserDto, UserResponse, ApiResponse } from '@absence-record/shared';

export const USERS_QUERY_KEY = ['users'];

export const useUsers = () => {
  const queryClient = useQueryClient();

  const query = useQuery<ApiResponse<{ users: UserResponse[] }>, Error, UserResponse[]>({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/users');
      return res.data;
    },
    select: (res) => res.data?.users ?? [],
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const res = await apiClient.post('/users', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }) => {
      const res = await apiClient.put(`/users/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  return {
    ...query,
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeleting: deleteUserMutation.isPending,
  };
};
