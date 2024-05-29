import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { Tooltip as WedgesTooltip } from "@lemonsqueezy/wedges";

type TooltipElement = ElementRef<typeof WedgesTooltip>;
type TooltipProps = ComponentPropsWithoutRef<typeof WedgesTooltip>;

export const TooltipGroupItem = forwardRef<TooltipElement, TooltipProps>((props, ref) => {
  const {
    arrow = false,
    children,
    className,
    color = "soft",
    sideOffset = 10,
    size = "sm",
    content,
    delayDuration = 300,
    disableHoverableContent = false,
    open,
    ...otherProps
  } = props;

  return (
    <WedgesTooltip.Root
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
      defaultOpen={open}
    >
      <WedgesTooltip.Portal>
        <WedgesTooltip.Content
          ref={ref}
          arrow={arrow}
          sideOffset={sideOffset}
          color={color}
          content={content}
          {...otherProps}
        />
      </WedgesTooltip.Portal>

      <WedgesTooltip.Trigger>{children}</WedgesTooltip.Trigger>
    </WedgesTooltip.Root>
  );
});

TooltipGroupItem.displayName = "TooltipGroupItem";

export const Tooltip = forwardRef<TooltipElement, TooltipProps>((props, ref) => {
  const {
    arrow = false,
    children,
    className,
    color = "soft",
    sideOffset = 10,
    size = "sm",
    content,
    delayDuration = 300,
    disableHoverableContent = false,
    ...otherProps
  } = props;

  return (
    <WedgesTooltip.Provider>
      <WedgesTooltip.Root
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <>
          <WedgesTooltip.Portal>
            <WedgesTooltip.Content
              ref={ref}
              arrow={arrow}
              sideOffset={sideOffset}
              color={color}
              content={content}
              {...otherProps}
            />
          </WedgesTooltip.Portal>
          <WedgesTooltip.Trigger>{children}</WedgesTooltip.Trigger>
        </>
      </WedgesTooltip.Root>
    </WedgesTooltip.Provider>
  );
});

Tooltip.displayName = "Tooltip";
