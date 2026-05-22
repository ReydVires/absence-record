import React, { useRef, useState } from 'react';
import { useAttendance } from '../hooks/useAttendance';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Label } from '@/components/ui/Label';
import styles from '@/App.module.css';

interface Props {
  user: any;
}

export const AttendanceDashboard: React.FC<Props> = ({ user }) => {
  const { data: records, isLoading, isError, error, checkIn, isCheckingIn, checkOut, isCheckingOut } = useAttendance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const today = new Date().toDateString();
  const todaysRecord = records?.find(r => new Date(r.date).toDateString() === today);
  const hasCheckedInToday = !!todaysRecord;
  const hasCheckedOutToday = !!todaysRecord?.checkOutTime;

  const handleCheckIn = async () => {
    if (!user?.id) return;
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setFileError('Please select an image first');
      return;
    }
    setFileError(null);
    try {
      await checkIn({ userId: user.id, imageName: file.name });
      setIsCheckInModalOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) { }
  };

  const handleCheckOut = async () => {
    if (!todaysRecord?.id) return;
    try {
      await checkOut(todaysRecord.id);
    } catch (err) { }
  };

  const renderAttendanceActions = () => {
    if (isLoading) return null;
    if (hasCheckedOutToday) {
      return (
        <div className={styles.completedMsg}>✓ Attendance completed for today</div>
      );
    }
    if (hasCheckedInToday) {
      return (
        <div className={styles.checkInSection}>
          <span>You've checked in today.</span>
          <Button variant="secondary" onClick={handleCheckOut} isLoading={isCheckingOut} loadingText="Checking out...">
            Check Out
          </Button>
        </div>
      );
    }
    return (
      <div className={styles.checkInSection}>
        <Button variant="primary" onClick={() => setIsCheckInModalOpen(true)}>Check In</Button>
      </div>
    );
  };

  return (
    <>
      {user.role !== 'admin' && (
        <Modal
          title="Daily Check In"
          description="Upload a photo to confirm your attendance."
          open={isCheckInModalOpen}
          onOpenChange={(open) => {
            setIsCheckInModalOpen(open);
            if (!open) setFileError(null);
          }}
        >
          <div className={styles.flexCol}>
            <div className={styles.fieldGroup}>
              <Label htmlFor="checkin-image">Attachment</Label>
              <input
                ref={fileInputRef}
                id="checkin-image"
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={() => setFileError(null)}
              />
            </div>
            {fileError ? <span className={styles.errorMsg}>{fileError}</span> : null}
            <Button variant="primary" onClick={handleCheckIn} isLoading={isCheckingIn} loadingText="Checking in...">
              Confirm Check In
            </Button>
          </div>
        </Modal>
      )}

      {user.role !== 'admin' && renderAttendanceActions()}

      {isLoading && <div className={styles.loading}>Loading records...</div>}
      {isError && <div className={styles.error}>Error loading records: {error?.message}</div>}

      {!isLoading && !isError && (
        <div className={styles.recordsList}>
          {records?.map((record) => (
            <div key={record.id} className={styles.recordItem}>
              <div className={styles.recordInfo}>
                <span className={styles.recordDate}>{new Date(record.date).toLocaleDateString()}</span>
                {user.role === 'admin' && record.userEmail && (
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--primary)', marginTop: '0.125rem', marginBottom: '0.125rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>👤</span> <span>{record.userEmail}</span>
                  </span>
                )}
                <span className={styles.recordNote}>
                  {record.imageName ? `📎 ${record.imageName}` : record.note || 'No notes added'}
                </span>
              </div>
              <div className={styles.recordMeta}>
                <span className={`${styles.badge} ${styles[record.status]}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
                {record.date ? (
                  <span className={styles.checkInTime}>
                    In: {new Date(record.date).toLocaleTimeString()}
                  </span>
                ) : null}
                {record.checkOutTime ? (
                  <span className={styles.checkOutTime}>
                    Out: {new Date(record.checkOutTime).toLocaleTimeString()}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
          {records?.length === 0 && <div className={styles.empty}>No records found.</div>}
        </div>
      )}
    </>
  );
};
