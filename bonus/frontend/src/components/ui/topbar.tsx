import * as React from 'react';
import { cn } from '@/src/lib/utils';

interface TopbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Topbar({ className, children, ...props }: TopbarProps) {
  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b bg-background px-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TopbarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-1 items-center justify-between', className)}
      {...props}
    />
  );
}

export function TopbarLeft({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props} />
  );
}

export function TopbarRight({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-4', className)} {...props} />
  );
}
