import React from 'react';
import styles from './Form.module.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      ref={ref}
      className={`${styles.input} ${className}`}
    />
  );
});

Input.displayName = 'Input';
