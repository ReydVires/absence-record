import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse, AttendanceResponse } from '@shared/index';
import { ATTENDANCE_QUERY_KEY } from './queries';

type Response = ApiResponse<{ attendances: AttendanceResponse[] }>

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const query = useQuery<Response, Error, AttendanceResponse[]>({
    queryKey: ATTENDANCE_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/attendance');
      return res.data;
    },
    select: (res) => res.data?.attendances ?? [],
  });

  const checkInMutation = useMutation({
    mutationFn: async (params: { userId: string; imageName?: string }) => {
      const res = await apiClient.post('/attendance', {
        userId: params.userId,
        status: 'present',
        imageName: params.imageName,
        date: new Date().toISOString(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: async (recordId: string) => {
      const res = await apiClient.patch(`/attendance/${recordId}/checkout`, {
        checkOutTime: new Date().toISOString(),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_QUERY_KEY });
    },
  });

  return {
    ...query,
    checkIn: checkInMutation.mutateAsync,
    isCheckingIn: checkInMutation.isPending,
    checkOut: checkOutMutation.mutateAsync,
    isCheckingOut: checkOutMutation.isPending,
  };
};

