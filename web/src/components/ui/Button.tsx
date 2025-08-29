import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const button = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-accent text-white hover:opacity-95',
        outline: 'border border-border bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800',
        ghost: 'hover:bg-slate-100 dark:hover:bg-slate-900'
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-5'
      }
    },
    defaultVariants: { variant: 'default', size: 'md' }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size, className }))} {...props} />
}