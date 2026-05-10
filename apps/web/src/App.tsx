import { useAttendance } from '@/features/attendance/hooks';

function App() {
  const { data: records = [], isLoading, isError, error } = useAttendance();

  if (isLoading) return <div>Loading records...</div>;
  if (isError) return <div>Error loading records: {(error as Error).message}</div>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Absence Records</h1>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            {record.date}: {record.status} - {record.note}
          </li>
        ))}
      </ul>
      {records.length === 0 && <p>No records found.</p>}
    </div>
  );
}

export default App;
