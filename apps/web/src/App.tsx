import { useState } from 'react';
import { useAuth } from './features/auth/hooks/useAuth';
import { Button } from './components/ui/Button';
import { Modal } from './components/ui/Modal';
import { Label } from './components/ui/Label';
import { Input } from './components/ui/Input';
import { AttendanceDashboard } from './features/attendance/components/AttendanceDashboard';
import { EmployeeManagement } from './features/users/components/EmployeeManagement';
import styles from './App.module.css';

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const { login, user, isAuthenticated, logout, isLoading: isLoginLoading, error: loginError } = useAuth({
    onError: () => setShowLoginError(true)
  });

  const [activeTab, setActiveTab] = useState<'attendance' | 'employees'>('attendance');

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
      if (passwordInput) passwordInput.value = '';
    }
  }

  const isAdmin = user?.role === 'admin';

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
            <span className={styles.status}>
              {isAuthenticated ? (isAdmin ? 'HR Admin' : 'Employee') : 'Not logged in'}
            </span>
          </div>

          {!isAuthenticated ? (
            <Modal
              title="Login"
              description="Enter your credentials to login"
              trigger={<Button variant="primary">Login</Button>}
              onOpenChange={() => setShowLoginError(false)}
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
                <Button loadingText="Logging in..." type='submit' isLoading={isLoginLoading}>
                  Login
                </Button>
              </form>
            </Modal>
          ) : (
            <Button variant="secondary" onClick={logout}>Logout</Button>
          )}
        </div>

        <section hidden={!isAuthenticated}>
          {isAdmin && (
            <div className={styles.tabsContainer}>
              <button 
                className={`${styles.tab} ${activeTab === 'attendance' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                Global Attendance Logs
              </button>
              <button 
                className={`${styles.tab} ${activeTab === 'employees' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('employees')}
              >
                Employee Management
              </button>
            </div>
          )}

          {(!isAdmin || activeTab === 'attendance') && user && (
            <AttendanceDashboard user={user} />
          )}

          {isAdmin && activeTab === 'employees' && (
            <EmployeeManagement />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
