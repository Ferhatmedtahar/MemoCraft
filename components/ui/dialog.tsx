"use client";

import { cn } from "@/lib/utils";
import * as ReactDialog from "@radix-ui/react-dialog";
import { cva, VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import React, { HTMLAttributes, ReactNode } from "react";
import { Button } from "./button";

const Dialog = ReactDialog.Root;
const DialogTrigger = ReactDialog.Trigger;

const overlayVariants = cva(
  `fixed bg-black/80 font-head
    data-[state=open]:fade-in-0
    data-[state=open]:animate-in 
    data-[state=closed]:animate-out 
    data-[state=closed]:fade-out-0 
  `,
  {
    variants: {
      variant: {
        default: "inset-0 z-50 bg-black/80",
        none: "fixed bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface IDialogBackdropProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof overlayVariants> {}

const DialogBackdrop = React.forwardRef<HTMLDivElement, IDialogBackdropProps>(
  function DialogBackdrop(inputProps: IDialogBackdropProps, forwardedRef) {
    const { variant = "default", className, ...props } = inputProps;

    return (
      <ReactDialog.Overlay
        className={cn(overlayVariants({ variant }), className)}
        ref={forwardedRef}
        {...props}
      />
    );
  }
);
DialogBackdrop.displayName = "DialogBackdrop";

const dialogVariants = cva(
  `fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
  flex flex-col border-2 shadow-md overflow-y-auto bg-background text-foreground
  w-full h-fit max-h-[80vh] max-w-full duration-300 p-4
  data-[state=open]:animate-in 
  data-[state=open]:slide-in-from-left-1/2 
  data-[state=open]:slide-in-from-top-[48%]
  data-[state=open]:fade-in-0 
  data-[state=open]:zoom-in-95 
  data-[state=closed]:animate-out 
  data-[state=closed]:fade-out-0 
  data-[state=closed]:slide-out-to-top-[48%] 
  data-[state=closed]:slide-out-to-left-1/2 
  data-[state=closed]:zoom-out-95`,
  {
    variants: {
      size: {
        auto: "max-w-fit",
        sm: "lg:max-w-[30%]",
        md: "lg:max-w-[40%]",
        lg: "lg:max-w-[50%]",
        xl: "lg:max-w-[60%]",
        "2xl": "lg:max-w-[70%]",
        "3xl": "lg:max-w-[80%]",
        "4xl": "lg:max-w-[90%]",
        screen: "max-w-[100%]",
      },
    },
    defaultVariants: {
      size: "auto",
    },
  }
);

interface IDialogContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogVariants> {
  overlay?: IDialogBackdropProps;
}

const DialogContent = React.forwardRef<HTMLDivElement, IDialogContentProps>(
  function DialogContent(inputProps: IDialogContentProps, forwardedRef) {
    const {
      children,
      size = "auto",
      className,
      overlay,
      ...props
    } = inputProps;

    return (
      <ReactDialog.Portal>
        <DialogBackdrop {...overlay} />
        <ReactDialog.Content
          className={cn(dialogVariants({ size }), className)}
          ref={forwardedRef}
          {...props}
        >
          <div className="flex flex-col relative">{children}</div>
        </ReactDialog.Content>
      </ReactDialog.Portal>
    );
  }
);
DialogContent.displayName = "DialogContent";

// Proper DialogTitle component
interface IDialogTitleProps
  extends React.ComponentProps<typeof ReactDialog.Title> {}
const DialogTitle = React.forwardRef<HTMLHeadingElement, IDialogTitleProps>(
  function DialogTitle({ className, children, ...props }, ref) {
    return (
      <ReactDialog.Title
        className={cn(
          "text-lg font-semibold leading-none tracking-tight text-primary-foreground",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </ReactDialog.Title>
    );
  }
);
DialogTitle.displayName = "DialogTitle";

interface IDialogDescriptionProps
  extends React.ComponentProps<typeof ReactDialog.Description> {}
const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  IDialogDescriptionProps
>(function DialogDescription({ className, children, ...props }, ref) {
  return (
    <ReactDialog.Description
      className={cn("text-sm text-foreground", className)}
      ref={ref}
      {...props}
    >
      {children}
    </ReactDialog.Description>
  );
});
DialogDescription.displayName = "DialogDescription";

const dialogFooterVariants = cva(
  "flex items-center justify-end border-t-2 min-h-12 gap-4 px-4 py-2",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
      },
      position: {
        fixed: "sticky bottom-0",
        static: "static",
      },
    },
    defaultVariants: {
      position: "fixed",
    },
  }
);

export interface IDialogFooterProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogFooterVariants> {}

const DialogFooter = ({
  children,
  className,
  position,
  variant,
  ...props
}: IDialogFooterProps) => {
  return (
    <div
      className={cn(dialogFooterVariants({ position, variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

const dialogHeaderVariants = cva(
  "flex items-center justify-between border-b-2 px-4 py-3 min-h-12",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
      },
      position: {
        fixed: "sticky top-0",
        static: "static",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "static",
    },
  }
);

const DialogHeaderDefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="flex flex-col gap-1.5">{children}</div>
      <ReactDialog.Close asChild>
        <Button
          type="button"
          size={"icon"}
          // className=" opacity-90 ring-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </ReactDialog.Close>
    </>
  );
};

interface IDialogHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogHeaderVariants> {
  asChild?: boolean;
}

const DialogHeader = ({
  children,
  className,
  position,
  variant,
  asChild,
  ...props
}: IDialogHeaderProps) => {
  return (
    <div
      className={cn(dialogHeaderVariants({ position, variant }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <DialogHeaderDefaultLayout>{children}</DialogHeaderDefaultLayout>
      )}
    </div>
  );
};

// DialogBody component for content area
interface IDialogBodyProps extends HTMLAttributes<HTMLDivElement> {}
const DialogBody = ({ children, className, ...props }: IDialogBodyProps) => {
  return (
    <div className={cn("flex-1 px-4 py-4", className)} {...props}>
      {children}
    </div>
  );
};

const DialogComponent = Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Content: DialogContent,
  Body: DialogBody,
  Footer: DialogFooter,
  Close: ReactDialog.Close,
});

export { DialogComponent as Dialog };
