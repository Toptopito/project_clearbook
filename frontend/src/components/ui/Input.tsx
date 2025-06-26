import React, { forwardRef } from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const id = props.id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'has-error' : '';
    
    return (
      <div className={`input-wrapper ${widthClass} ${className}`}>
        {label && <label htmlFor={id} className="input-label">{label}</label>}
        <div className={`input-container ${errorClass}`}>
          {leftIcon && <div className="input-icon left">{leftIcon}</div>}
          <input 
            ref={ref} 
            id={id} 
            className={`form-input ${leftIcon ? 'has-left-icon' : ''} ${rightIcon ? 'has-right-icon' : ''}`} 
            {...props} 
          />
          {rightIcon && <div className="input-icon right">{rightIcon}</div>}
        </div>
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
