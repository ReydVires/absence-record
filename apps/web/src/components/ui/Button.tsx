import { useState } from "react";

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
    style,
    disabled,
    onClick,
    ...rest
  } = props


  const [loading, setLoading] = useState(false);
  const isLoading = props.isLoading || loading;

  const baseStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: isLoading || disabled ? 'not-allowed' : 'pointer',
    opacity: isLoading || disabled ? 0.7 : 1,
    border: 'none',
    fontWeight: 'bold',
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const variants = {
    primary: { backgroundColor: '#007bff', color: 'white' },
    secondary: { backgroundColor: '#6c757d', color: 'white' },
    danger: { backgroundColor: '#dc3545', color: 'white' },
  };

  return (
    <button
      {...rest}
      onClick={async (event) => {
        setLoading(true);
        try {
          await onClick?.(event);
        } finally {
          setLoading(false);
        }
      }}
      disabled={isLoading || disabled}
      style={{ ...baseStyle, ...variants[variant], ...style }}
    >
      {isLoading && (
        <span className="spinner" style={{
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {isLoading ? loadingText : children}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};
