'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { twMerge } from 'tailwind-merge';

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold tracking-wide transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:pointer-events-none disabled:opacity-40',
  variants: {
    variant: {
      primary:
        'bg-white text-black hover:bg-neutral-200 focus:ring-neutral-300',
      secondary:
        'bg-neutral-800/80 text-neutral-100 hover:bg-neutral-700/80 focus:ring-neutral-500 border border-neutral-700/80 backdrop-blur-sm',
      outline:
        'border border-neutral-700 bg-transparent text-neutral-100 hover:bg-neutral-800 focus:ring-neutral-600',
      ghost:
        'text-neutral-100 hover:bg-neutral-800 hover:text-white focus:ring-neutral-700',
      destructive:
        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      icon: 'rounded-full bg-white/10 text-neutral-100 hover:bg-white/20 focus:ring-white/30 backdrop-blur-md',
    },
    size: {
      default: 'h-12 py-2 px-6',
      sm: 'h-10 rounded-lg px-4',
      lg: 'h-14 rounded-2xl px-10 text-lg',
      icon: 'h-12 w-12',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

const Button = ({
  className,
  children,
  variant,
  size,
  ...props
}: ButtonProps) => {
  const motionProps: MotionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  };

  return (
    <motion.button
      {...motionProps}
      className={twMerge(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </motion.button>
  );
};

Button.displayName = 'Button';

export { Button, buttonVariants };
