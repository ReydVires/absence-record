import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { Button } from '@/components/ui/Button';
import { UserResponse } from '@absence-record/shared';
import { UserModal } from './UserModal';
import { usePopup } from '@/components/ui/PopupContext';
import styles from '@/App.module.css';

export const EmployeeManagement: React.FC = () => {
  const { data: users, isLoading, isError, error, createUser, isCreating, updateUser, isUpdating, deleteUser } = useUsers();
  const { confirm, alert } = usePopup();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

  const handleAdd = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user: UserResponse) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await confirm('Are you sure you want to delete this employee?', {
        title: 'Delete Employee',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        variant: 'danger',
        onConfirm: async () => {
          await deleteUser(id);
        },
      });
    } catch (e: any) {
      await alert(e.response?.data?.message || 'Failed to delete user', 'Error');
    }
  };

  const handleSubmit = async (data: any) => {
    if (editingUser) {
      await updateUser({ id: editingUser.id, data });
    } else {
      await createUser(data);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading employees...</div>;
  if (isError) return <div className={styles.error}>Error: {error?.message}</div>;

  return (
    <div className={styles.flexCol} style={{ gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Employee Management</h2>
        <Button variant="primary" onClick={handleAdd}>+ Add Employee</Button>
      </div>

      <UserModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={editingUser}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      />

      <div className={styles.recordsList}>
        {users?.map((user) => (
          <div key={user.id} className={styles.recordItem}>
            <div className={styles.recordInfo}>
              <span className={styles.email} style={{ fontSize: '1rem' }}>{user.email}</span>
              <span className={styles.recordNote}>{(user as any).role === 'admin' ? 'HR Admin' : 'Employee'}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => handleEdit(user)}>Edit</Button>
              <Button variant="secondary" onClick={() => { handleDelete(user.id); }} style={{ color: '#dc2626', borderColor: '#fca5a5' }}>Delete</Button>
            </div>
          </div>
        ))}
        {users?.length === 0 && <div className={styles.empty}>No employees found.</div>}
      </div>
    </div>
  );
};
