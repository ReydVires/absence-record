import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ApiResponse, AttendanceResponse } from '@shared/index';
import { ATTENDANCE_QUERY_KEY } from './queries';

type Response = ApiResponse<{ attendances: AttendanceResponse[] }>

export const useAttendance = () => {
  return useQuery<Response, Error, AttendanceResponse[]>({
    queryKey: ATTENDANCE_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get('/attendance');
      return res.data;
    },
    select: (res) => res.data?.attendances ?? [],
  });
};
