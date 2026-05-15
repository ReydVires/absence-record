import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { LoginRequest, AuthResponse, ApiResponse } from '@absence-record/shared';

interface Props {
  onError?: (error: Error) => void;
}

export const useAuth = (props?: Props) => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest): Promise<AuthResponse> => {
      const { data: res } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return res.data!;
    },
    onSuccess: (data) => {
      // Store token securely
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update axios default headers for subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;

      // Invalidate all queries to refresh data with new auth state
      queryClient.invalidateQueries();
    },
    onError: (error) => {
      props?.onError?.(error);
    }
  });

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
    queryClient.clear();
    window.location.href = '/';
  };

  const isAuthenticated = !!localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return {
    login: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    logout,
    isAuthenticated,
    user,
  };
};
