import { useAttendance } from '@/features/attendance/hooks';
import { useAuth } from './features/auth/hooks/useAuth';
import { Button } from './components/ui/Button';
import styles from './App.module.css';

function App() {
  const { data: records, isLoading, isError, error } = useAttendance();
  const { login, user, isAuthenticated, logout } = useAuth();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Absence Records</h1>
        <p className={styles.subtitle}>Track and manage your daily attendance with ease.</p>
      </header>

      <main className={styles.card}>
        <div className={styles.authSection}>
          <div className={styles.userInfo}>
            <span className={styles.email}>{isAuthenticated ? user.email : 'Guest User'}</span>
            <span className={styles.status}>{isAuthenticated ? 'Logged In' : 'Not logged in'}</span>
          </div>

          {!isAuthenticated ? (
            <Button
              loadingText="Logging in..."
              onClick={async () => {
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
        </div>

        <section hidden={!isAuthenticated}>
          {isLoading && <div className={styles.loading}>Loading records...</div>}

          {isError && (
            <div className={styles.error}>
              Error loading records: {error?.message}
            </div>
          )}

          {!isLoading && !isError && (
            <div className={styles.recordsList}>
              {records?.map((record) => (
                <div key={record.id} className={styles.recordItem}>
                  <div className={styles.recordInfo}>
                    <span className={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</span>
                    <span className={styles.recordNote}>{record.note || 'No notes added'}</span>
                  </div>
                  <span className={`${styles.badge} ${styles[record.status]}`}>
                    {record.status}
                  </span>
                </div>
              ))}

              {records?.length === 0 && (
                <div className={styles.empty}>No records found.</div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
