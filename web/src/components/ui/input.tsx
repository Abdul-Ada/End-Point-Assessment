import { cn } from './cn'
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn('h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-accent/40 dark:bg-slate-900', props.className)}
    />
  )
}