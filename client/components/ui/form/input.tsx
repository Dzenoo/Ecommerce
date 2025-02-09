import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
  showSearchIcon?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showSearchIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {showSearchIcon && (
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
        )}
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            showSearchIcon ? 'pl-10' : '',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';

export { Input };
