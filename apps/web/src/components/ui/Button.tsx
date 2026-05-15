import React, { useState } from "react";
import styles from "./Button.module.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export const Button = React.forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    children,
    loadingText = 'Loading...',
    variant = 'primary',
    className = '',
    disabled,
    onClick,
    isLoading: externalIsLoading,
    ...rest
  } = props


  const [loading, setLoading] = useState(false);
  const isLoading = externalIsLoading || loading;


  const buttonClasses = [
    styles.btn,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      ref={ref}
      className={buttonClasses}
      onClick={async (event) => {
        if (isLoading || disabled) return;
        setLoading(true);
        try {
          await onClick?.(event);
        } finally {
          setLoading(false);
        }
      }}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <span className={styles.spinner} />
      )}
      <span>{isLoading ? loadingText : children}</span>
    </button>
  );
});

Button.displayName = 'Button';


