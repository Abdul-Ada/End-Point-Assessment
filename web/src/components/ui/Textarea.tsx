import { cn } from './cn'
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn('min-h-[120px] w-full rounded-xl border border-border bg-white p-3 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-accent/40 dark:bg-slate-900', props.className)}
    />
  )
}