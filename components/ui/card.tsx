import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Text } from "./Text";

interface ICardProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Card = ({ className, ...props }: ICardProps) => {
  return (
    <div
      className={cn(
        "inline-block border-2 border-foreground bg-card text-card-foreground transition-all duration-300 cursor-pointer",
        "shadow-[var(--theme-shadow)]",
        "hover:shadow-none",
        "hover:translate-y-1",
        className
      )}
      {...props}
    />
  );
};

const CardHeader = ({ className, ...props }: ICardProps) => {
  return (
    <div
      className={cn("flex flex-col justify-start p-4", className)}
      {...props}
    />
  );
};

const CardTitle = ({ className, ...props }: ICardProps) => {
  return <Text as="h3" className={cn("mb-2", className)} {...props} />;
};

const CardDescription = ({ className, ...props }: ICardProps) => (
  <p className={cn("text-muted-foreground", className)} {...props} />
);

const CardContent = ({ className, ...props }: ICardProps) => {
  return <div className={cn("p-4", className)} {...props} />;
};

const CardComponent = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
});

export { CardComponent as Card };
