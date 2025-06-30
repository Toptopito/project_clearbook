import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  title?: string | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outlined' | 'elevated';
  headerClassName?: string;
  bodyClassName?: string;
  footerContent?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  action,
  className = '',
  variant = 'default',
  headerClassName = '',
  bodyClassName = '',
  footerContent
}) => {
  return (
    <div className={`card card-${variant} ${className}`}>
      {(title || action) && (
        <div className={`card-header ${headerClassName}`}>
          {title && (
            typeof title === 'string' 
              ? <h3 className="card-title">{title}</h3>
              : title
          )}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className="card-footer">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Card;
