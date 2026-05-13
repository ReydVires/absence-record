import { useState } from "react";
import styles from "./Button.module.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
}

export const Button = (props: Props) => {
  const {
    children,
    loadingText = 'Loading...',
    variant = 'primary',
    className = '',
    disabled,
    onClick,
    ...rest
  } = props


  const [loading, setLoading] = useState(false);
  const isLoading = props.isLoading || loading;

  const buttonClasses = [
    styles.btn,
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
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
};

