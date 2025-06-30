import React from 'react';
import { LinkProps } from 'react-router-dom';
import './Button.css';

// Define base button props - common props for all button types
type ButtonBaseProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
};

// Props for default button HTML element
type ButtonProps = ButtonBaseProps & 
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: undefined | 'button';
};

// Props specifically for Link component
type ButtonLinkProps = ButtonBaseProps & 
  Omit<LinkProps, keyof ButtonBaseProps> & {
  as: 'a' | React.ComponentType<any>;
  to: string;
  disabled?: boolean;
};

// Polymorphic component props for other elements
type PolymorphicComponentProps<E extends React.ElementType> = ButtonBaseProps & {
  as: E;
} & Omit<React.ComponentPropsWithoutRef<E>, keyof ButtonBaseProps>;

// Combine all possible button props
type ButtonComponentProps = 
  | ButtonProps 
  | ButtonLinkProps
  | PolymorphicComponentProps<React.ElementType>;

const Button = <E extends React.ElementType = 'button'>({
  children,
  variant = 'primary',
  fullWidth = false,
  loading = false,
  icon,
  className = '',
  disabled,
  as,
  ...props
}: ButtonComponentProps) => {
  const Component = as || 'button';
  const baseClasses = 'button flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-all font-inter';
  // Using our theme CSS variables for consistent styling
  const variantClasses = {
    primary: 'text-white hover:bg-opacity-90 active:bg-opacity-100',
    secondary: 'bg-white border text-gray-800 hover:bg-gray-50 active:bg-gray-100',
    outline: 'bg-transparent border text-gray-800 hover:bg-gray-50',
    text: 'bg-transparent hover:bg-opacity-10 hover:underline px-2',
  };
  
  // Apply theme colors based on variant
  const getButtonStyle = () => {
    switch(variant) {
      case 'primary':
        return { backgroundColor: 'var(--primary)' };
      case 'secondary':
        return { borderColor: 'var(--primary)', color: 'var(--primary)' };
      case 'outline':
        return { borderColor: 'var(--text)', color: 'var(--text)' };
      case 'text':
        return { color: 'var(--primary)' };
      default:
        return {};
    }
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || loading ? 'opacity-60 cursor-not-allowed' : '';
  
  // For Link components, when disabled is true, we need to prevent navigation
  // by stopping the click event and adding appropriate styling
  const linkProps = (as !== 'button' && (disabled || loading)) ? { 
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    style: { pointerEvents: 'none' } 
  } : {};

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      style={getButtonStyle()}
      {...(Component === 'button' ? { disabled: disabled || loading } : linkProps)}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </Component>
  );
};

export default Button;
