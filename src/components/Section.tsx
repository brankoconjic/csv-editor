import React, { forwardRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const SectionRoot = ({
  children,
  className,
  destructive = false,
  transparent = false,
  halfGridItems = false,
  hover = true,
}: {
  className?: string;
  children: ReactNode;
  destructive?: boolean;
  transparent?: boolean;
  halfGridItems?: boolean;
  hover?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-px text-sm last:mb-0",
        transparent && "-mx-6 mb-10 [&_.section-item]:px-6 [&_.section-item]:after:inset-x-6",
        !transparent && "mb-6 rounded-lg border border-surface-100 p-3",
        destructive &&
          "ss-bg-effect-dots destructive-section !border-destructive/10 !bg-destructive-400/10 py-0",
        halfGridItems &&
          "[&_.section-item]:grid [&_.section-item]:grid-cols-1 lg:[&_.section-item]:grid-cols-2",
        !hover && "[&_.section-item]:hover:!bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

const SectionItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
  }
>((props, ref) => {
  const { children, className, hover = false, onClick } = props;

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={cn(
        "section-item relative flex flex-wrap items-center justify-between gap-4 rounded-lg px-4 py-3.5 text-sm after:absolute after:inset-x-4 after:-bottom-px after:h-px after:bg-surface-100 last:after:hidden lg:flex-nowrap",
        hover &&
          "hover:bg-surface-50 has-[.section-highlight]:bg-surface-50 has-[:focus-visible]:bg-surface-50 has-[[data-state=open]]:!bg-surface-50",
        className
      )}
    >
      {children}
    </div>
  );
});

SectionItem.displayName = "SectionItem";

export const Section = Object.assign(SectionRoot, {
  Root: SectionRoot,
  Item: SectionItem,
});
