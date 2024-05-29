import * as React from "react";
import { Button } from "@lemonsqueezy/wedges";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { ScrollArea } from "./ScrollArea";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "ss-dialog data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-500/40 data-[state=closed]:duration-300 data-[state=open]:duration-300",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "ease-slow-cubic data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 bg-background transition data-[state=closed]:duration-300 data-[state=open]:duration-300 dark:backdrop-blur-xl",
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 w-[90%] border-surface-200 focus:outline-none dark:border-l sm:max-w-[500px]",
        className
      )}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <div className="flex w-full flex-wrap items-center justify-between pl-8 pr-5 text-inherit">
    <SheetPrimitive.Title
      ref={ref}
      className={cn("text-xl font-medium text-foreground", className)}
      {...props}
    />

    <SheetPrimitive.Close aria-label="Close" asChild>
      <Button
        type="button"
        isIconOnly
        size="md"
        className={cn(
          "focus-visible:text-ss-text-950 relative -right-2 -top-6 z-50 size-8 bg-background text-foreground transition-none hover:text-foreground"
        )}
        variant="transparent"
        before={<XIcon size={20} className="size-5 shrink-0 !opacity-100" />}
      />
    </SheetPrimitive.Close>
  </div>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("prose text-balance px-8 text-sm leading-6 text-surface-700", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

type PageSheetElement = React.ElementRef<typeof SheetContent>;
type PageSheetProps = React.ComponentPropsWithoutRef<typeof SheetContent> & {
  title?: React.ReactNode;
  description?: React.ReactNode;
};

export const PageSheet = React.forwardRef<PageSheetElement, PageSheetProps>((props, ref) => {
  const { title, description, children, ...otherProps } = props;

  return (
    <SheetContent ref={ref} {...otherProps}>
      <ScrollArea className="h-full">
        <div className="py-8">
          <SheetHeader>
            {title ? <SheetTitle>{title}</SheetTitle> : null}
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>

          {children ? <div className="mt-8 px-8 text-sm">{children}</div> : null}
        </div>
      </ScrollArea>
    </SheetContent>
  );
});

PageSheet.displayName = "PageSheet";
