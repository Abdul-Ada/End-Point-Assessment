import { cn } from './cn'
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border/70 bg-white p-4 shadow-card dark:bg-slate-950', className)} {...props} />
}