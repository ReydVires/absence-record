import React, { createContext, useContext, useState, useRef } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import styles from './PopupContext.module.css';

interface PopupOptions {
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onConfirm?: () => void | Promise<void>;
}

interface PopupContextType {
  alert: (message: string, title?: string) => Promise<void>;
  confirm: (
    message: string,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      variant?: 'primary' | 'secondary' | 'danger';
      onConfirm?: () => void | Promise<void>;
    }
  ) => Promise<boolean>;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PopupOptions>({
    title: '',
    message: '',
    type: 'alert',
  });

  const resolver = useRef<{ resolve: (value: any) => void; reject: (reason?: any) => void } | null>(null);

  const showAlert = (message: string, title: string = 'Notice') => {
    setOptions({
      title,
      message,
      type: 'alert',
      confirmText: 'OK',
    });
    setOpen(true);
    return new Promise<void>((resolve, reject) => {
      resolver.current = { resolve, reject };
    });
  };

  const showConfirm = (
    message: string,
    config?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      variant?: 'primary' | 'secondary' | 'danger';
      onConfirm?: () => void | Promise<void>;
    }
  ) => {
    setOptions({
      title: config?.title || 'Are you sure?',
      message,
      type: 'confirm',
      confirmText: config?.confirmText || 'Confirm',
      cancelText: config?.cancelText || 'Cancel',
      variant: config?.variant || 'danger',
      onConfirm: config?.onConfirm,
    });
    setOpen(true);
    return new Promise<boolean>((resolve, reject) => {
      resolver.current = { resolve, reject };
    });
  };

  const handleConfirm = async () => {
    if (options.onConfirm) {
      try {
        await options.onConfirm();
      } catch (err) {
        if (resolver.current) {
          resolver.current.reject(err);
          resolver.current = null;
        }
        setOpen(false);
        throw err;
      }
    }
    setOpen(false);
    if (resolver.current) {
      resolver.current.resolve(options.type === 'confirm' ? true : undefined);
      resolver.current = null;
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (resolver.current) {
      resolver.current.resolve(false);
      resolver.current = null;
    }
  };

  return (
    <PopupContext.Provider value={{ alert: showAlert, confirm: showConfirm }}>
      {children}
      <Modal
        title={options.title}
        description={options.message}
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleCancel();
          }
        }}
      >
        <div className={styles.popupActions}>
          {options.type === 'confirm' && (
            <Button variant="secondary" onClick={handleCancel}>
              {options.cancelText}
            </Button>
          )}
          <Button
            variant={options.variant || 'primary'}
            onClick={handleConfirm}
          >
            {options.confirmText}
          </Button>
        </div>
      </Modal>
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};
