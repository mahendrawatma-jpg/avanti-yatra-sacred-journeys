import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RippleEffect } from "./ripple-effect";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 relative overflow-hidden",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground relative overflow-hidden",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 relative overflow-hidden",
        ghost: "hover:bg-accent hover:text-accent-foreground relative overflow-hidden",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  withRipple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, withRipple = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    };

    if (withRipple && variant !== "link") {
      return (
        <RippleEffect>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Comp
              className={cn(
                buttonVariants({ variant, size, className }),
                "transition-all duration-300"
              )}
              ref={ref}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              {...props}
            >
              {children}
              {/* Color shift overlay */}
              <motion.div
                className="absolute inset-0 rounded-md opacity-0 pointer-events-none"
                animate={{
                  opacity: isPressed ? [0, 0.3, 0] : 0,
                  background: [
                    "radial-gradient(circle at center, hsl(15, 92%, 58%, 0.4), transparent 70%)",
                    "radial-gradient(circle at center, hsl(265, 75%, 60%, 0.4), transparent 70%)",
                    "radial-gradient(circle at center, hsl(195, 100%, 55%, 0.4), transparent 70%)",
                  ],
                }}
                transition={{ duration: 0.6 }}
              />
            </Comp>
          </motion.div>
        </RippleEffect>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "transition-all duration-300 active:scale-95"
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
