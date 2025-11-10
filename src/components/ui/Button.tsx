"use client";

import { motion, type MotionProps } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-bold tracking-wider uppercase transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:pointer-events-none disabled:opacity-40 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40",
  variants: {
    variant: {
      primary:
        "bg-gradient-to-r from-teal-400 to-cyan-500 text-white shadow-lg shadow-cyan-500/30 focus:ring-cyan-400",
      secondary:
        "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-pink-500/30 focus:ring-pink-400",
      destructive:
        "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 focus:ring-red-400",
      glass:
        "bg-white/10 text-white border-2 border-white/20 backdrop-blur-xl shadow-lg shadow-black/20 hover:bg-white/20 focus:ring-white/30",
      "social-x":
        "bg-black text-white hover:bg-neutral-800 focus:ring-neutral-600",
      "social-line":
        "bg-[#06C755] text-white hover:bg-[#05a546] focus:ring-[#06C755]",
      "social-facebook":
        "bg-[#1877F2] text-white hover:bg-[#166bda] focus:ring-[#1877F2]",
      "social-copy":
        "bg-neutral-600 text-white hover:bg-neutral-500 focus:ring-neutral-400",
    },
    size: {
      default: "h-12 py-2 px-8",
      sm: "h-10 rounded-full px-6 text-sm",
      lg: "h-14 rounded-full px-12 text-lg",
      icon: "h-14 w-14 p-4",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
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
    transition: { type: "spring", stiffness: 400, damping: 17 },
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

Button.displayName = "Button";

export { Button, buttonVariants };
