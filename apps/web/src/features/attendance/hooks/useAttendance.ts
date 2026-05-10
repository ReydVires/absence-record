import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { AttendanceResponse } from '@shared/index';
import { ATTENDANCE_QUERY_KEY } from './queries';

const getAttendanceRecords = async (): Promise<AttendanceResponse[]> => {
  const { data } = await apiClient.get('/attendance');
  return data;
};

export const useAttendance = () => {
  return useQuery({
    queryKey: ATTENDANCE_QUERY_KEY,
    queryFn: getAttendanceRecords,
  });
};
