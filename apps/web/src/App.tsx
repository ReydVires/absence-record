import { useAttendance } from '@/features/attendance/hooks';
import { useAuth } from './features/auth/hooks/useAuth';
import { Button } from './components/ui/Button';

function App() {
  const { data: records, isLoading, isError, error } = useAttendance();
  const { login, user, isAuthenticated, logout } = useAuth();

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Absence Records</h1>
      <h2>{isAuthenticated ? user.email : 'Not logged in'}</h2>

      {!isAuthenticated ? (
        <Button
          loadingText="Logging in..."
          onClick={async (event) => {
            await login({
              email: "admin@admin.com",
              password: "password123"
            });
          }}
        >
          Login
        </Button>
      ) : (
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      )}

      {!isLoading ?
        <ul>
          {records?.map((record) => (
            <li key={record.id}>
              {record.date}: {record.status} - {record.note}
            </li>
          ))}
        </ul> : <p>Loading records...</p>}
      {!isLoading && !isError && records?.length === 0 ? <p>No records found.</p> : null}
      {isError && <p>Error loading records: {(error as Error).message}</p>}
    </div>
  );
}

export default App;
