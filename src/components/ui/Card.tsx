import React, { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'bordered' | 'elevated';
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    bordered: 'bg-white border-2 border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-200',
  };

  return (
    <div
      className={clsx(
        'rounded-lg',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Compound component pattern
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;