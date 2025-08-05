import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const variantClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  };

  const iconClasses = {
    success: 'text-success-400',
    error: 'text-danger-400',
    warning: 'text-warning-400',
    info: 'text-primary-400',
  };

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const Icon = icons[variant];

  return (
    <div
      className={clsx(
        'border rounded-md p-4',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={clsx('h-5 w-5', iconClasses[variant])} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">{title}</h3>
          )}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className={clsx(
                  'inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  iconClasses[variant]
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;