import { HTMLAttributes, ReactNode } from 'react';
import styles from './style.module.scss';

export type CardVariant = 'default' | 'hover' | 'clickable';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  children,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`card--${variant}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
