import { useAttendance } from '@/features/attendance/hooks';
import { useAuth } from './features/auth/hooks/useAuth';
import { Button } from './components/ui/Button';
import styles from './App.module.css';
import { Modal } from './components/ui/Modal';
import { Label } from './components/ui/Label';
import { Input } from './components/ui/Input';
import { useState } from 'react';

function App() {
  const { data: records, isLoading, isError, error } = useAttendance();

  const [showPassword, setShowPassword] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const { login, user, isAuthenticated, logout, isLoading: isLoginLoading, error: loginError } = useAuth({
    onError: () => setShowLoginError(true)
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password });
    } catch (err) {
      const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.value = '';
      }
    }
  }

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
            <Modal
              title="Login"
              description="Enter your credentials to login"
              trigger={
                <Button variant="primary">
                  Login
                </Button>
              }
              onOpenChange={() => {
                setShowLoginError(false);
              }}
            >
              <form id='login-form' onSubmit={handleLogin} className={styles.flexCol}>
                <section className={styles.flexCol}>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" placeholder='Eg. admin@admin.com' required />
                  </div>
                  <div className={styles.fieldGroup}>
                    <Label htmlFor="password">Password</Label>
                    <div className={styles.passwordWrapper}>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder='Eg. password123'
                        required
                      />
                      <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </section>
                {showLoginError && loginError ?
                  <span className={styles.errorMsg}>
                    {loginError.message.includes('401') ? 'Invalid credentials' : loginError.message}
                  </span> : null}
                <Button
                  loadingText="Checking in..."
                  type='submit'
                  isLoading={isLoginLoading}
                >
                  Check in
                </Button>
              </form>
            </Modal>
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
      </main >
    </div >
  );
}

export default App;
