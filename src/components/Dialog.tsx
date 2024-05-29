import * as React from "react";
import { Button } from "@lemonsqueezy/wedges";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "ss-dialog data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-foreground/40 data-[state=closed]:duration-300 data-[state=open]:duration-300",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed left-1/2 top-1/2 z-50 grid w-full max-w-screen-xs -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-surface-200 bg-background p-8 text-sm !shadow-none !outline-none duration-200",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> & {
    closeButton?: boolean;
  }
>(({ className, closeButton = true, ...props }, ref) => (
  <div className="flex w-full flex-wrap items-center justify-between text-inherit">
    <DialogPrimitive.Title
      ref={ref}
      className={cn("text-ss-text-950 text-2xl", className)}
      {...props}
    />

    {closeButton ? (
      <DialogPrimitive.Close aria-label="Close" asChild>
        <Button
          type="button"
          isIconOnly
          size="md"
          className={cn("text-ss-text-faded size-10 transition-none")}
          variant="transparent"
          before={<XIcon size={20} className="size-auto !opacity-100" />}
        />
      </DialogPrimitive.Close>
    ) : null}
  </div>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("prose text-ss-text-800 text-sm leading-6", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export const Dialog = Object.assign(DialogRoot, {
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Close: DialogClose,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
});
