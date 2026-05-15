import React from 'react';
import styles from './Form.module.css';

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = (props: Props) => {
  const { children, className = '', ...rest } = props;
  return (
    <label
      {...rest}
      className={`${styles.label} ${className}`}
    >
      {children}
    </label>
  );
};
