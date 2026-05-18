import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { UserResponse } from '@absence-record/shared';
import styles from '@/App.module.css';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserResponse | null;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({ open, onOpenChange, user, onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'employee' | 'admin'>('employee');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (user) {
        setEmail(user.email);
        setPassword('');
        setRole((user as any).role || 'employee');
      } else {
        setEmail('');
        setPassword('');
        setRole('employee');
      }
      setError(null);
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!user && !password) {
      setError('Password is required for new users');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onSubmit({ email, password, role });
      onOpenChange(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    }
  };

  return (
    <Modal
      title={user ? 'Edit Employee' : 'Add Employee'}
      description={user ? 'Update the details for this employee.' : 'Create a new employee account.'}
      open={open}
      onOpenChange={onOpenChange}
    >
      <form onSubmit={handleSubmit} className={styles.flexCol}>
        <div className={styles.fieldGroup}>
          <Label htmlFor="user-email">Email</Label>
          <Input
            id="user-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="employee@company.com"
          />
        </div>

        <div className={styles.fieldGroup}>
          <Label htmlFor="user-password">{user ? 'New Password (leave empty to keep current)' : 'Password'}</Label>
          <Input
            id="user-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <div className={styles.fieldGroup}>
          <Label htmlFor="user-role">Role</Label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className={styles.fileInput}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && <span className={styles.errorMsg} style={{ padding: '0.5rem' }}>{error}</span>}

        <Button type="submit" variant="primary" isLoading={isLoading} loadingText="Saving...">
          {user ? 'Save Changes' : 'Create User'}
        </Button>
      </form>
    </Modal>
  );
};
