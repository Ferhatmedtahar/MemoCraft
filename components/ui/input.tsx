import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { InputHTMLAttributes } from "react";

const inputVariants = cva(
  "font-head transition-all duration-200 w-full border-2 shadow-[var(--theme-shadow)] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-background text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 focus:shadow-none focus:translate-y-0.5 focus:ring-2 focus:ring-primary/20",
        outline:
          "bg-transparent text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 hover:bg-accent/5 focus:shadow-none focus:translate-y-0.5 focus:bg-accent/10 focus:ring-2 focus:ring-primary/20",
        filled:
          "bg-accent/10 text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 hover:bg-accent/20 focus:shadow-none focus:translate-y-0.5 focus:bg-background focus:ring-2 focus:ring-primary/20",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
      },
      state: {
        default: "",
        error: "border-red-500 text-red-600 shadow-red-200 focus:ring-red-200",
        success:
          "border-green-500 text-green-600 shadow-green-200 focus:ring-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
    },
  }
);

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      placeholder = "Enter text",
      className,
      variant = "default",
      size = "md",

      state,
      ...props
    },
    ref
  ) => {
    return (
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={cn(inputVariants({ variant, state }), className)}
        aria-invalid={props["aria-invalid"]}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
