import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import React, { TextareaHTMLAttributes } from "react";

const textareaVariants = cva(
  "font-mono transition-all duration-200 w-full border-2 shadow-[var(--theme-shadow)] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 min-h-16 resize-y",
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
        sm: "px-3 py-1.5 text-sm min-h-12",
        md: "px-4 py-2 text-base min-h-16",
        lg: "px-6 py-3 text-lg min-h-20",
      },
      state: {
        default: "",
        error: "border-red-500 text-red-600 shadow-red-200 focus:ring-red-200",
        success:
          "border-green-500 text-green-600 shadow-green-200 focus:ring-green-200",
      },
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default",
      resize: "vertical",
    },
  }
);

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
  success?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder = "Enter text",
      className,
      variant = "default",
      size = "md",
      state,
      resize = "vertical",
      error,
      success,
      ...props
    },
    ref
  ) => {
    // Determine state based on props
    const textareaState = error
      ? "error"
      : success
      ? "success"
      : state || "default";

    return (
      <textarea
        ref={ref}
        placeholder={placeholder}
        className={cn(
          textareaVariants({ variant, size, state: textareaState, resize }),
          className
        )}
        aria-invalid={error || props["aria-invalid"]}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
// import { cn } from "@/lib/utils";
// import { cva, VariantProps } from "class-variance-authority";
// import React, { TextareaHTMLAttributes } from "react";

// const textareaVariants = cva(
//   "font-head transition-all duration-200 w-full border-2 shadow-[var(--theme-shadow)] focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
//   {
//     variants: {
//       variant: {
//         default:
//           "bg-background text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 focus:shadow-none focus:translate-y-0.5 focus:ring-2 focus:ring-primary/20",
//         outline:
//           "bg-transparent text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 hover:bg-accent/5 focus:shadow-none focus:translate-y-0.5 focus:bg-accent/10 focus:ring-2 focus:ring-primary/20",
//         filled:
//           "bg-accent/10 text-foreground border-foreground hover:shadow-none hover:translate-y-0.5 hover:bg-accent/20 focus:shadow-none focus:translate-y-0.5 focus:bg-background focus:ring-2 focus:ring-primary/20",
//       },
//       size: {
//         sm: "px-3 py-1.5 text-sm",
//         md: "px-4 py-2 text-base",
//         lg: "px-6 py-3 text-lg",
//       },
//       state: {
//         default: "",
//         error: "border-red-500 text-red-600 shadow-red-200 focus:ring-red-200",
//         success:
//           "border-green-500 text-green-600 shadow-green-200 focus:ring-green-200",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "md",
//       state: "default",
//     },
//   }
// );

// interface InputProps
//   extends Omit<TextareaHTMLAttributes<HTMLInputElement>, "size">,
//     VariantProps<typeof textareaVariants> {}
// export const Textarea = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       placeholder = "Enter text",
//       className,
//       variant = "default",
//       size = "md",

//       state,
//       ...props
//     },
//     ref
//   ) => {
//     return (
//       <textarea
//         ref={ref}
//         placeholder={placeholder}
//         className={cn(textareaVariants({ variant, state }), className)}
//         aria-invalid={props["aria-invalid"]}
//         {...props}
//       />
//     );
//   }
// );

// Textarea.displayName = "Textarea";
// // import * as React from "react"

// // import { cn } from "@/lib/utils"

// // function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
// //   return (
// //     <textarea
// //       data-slot="textarea"
// //       className={cn(
// //         "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
// //         className
// //       )}
// //       {...props}
// //     />
// //   )
// // }

// // export { Textarea }
