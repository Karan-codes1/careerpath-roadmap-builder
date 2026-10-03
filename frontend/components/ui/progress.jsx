"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "./utils";

export function Progress({ className, indicatorClassName, value = 0, ...props }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <ProgressPrimitive.Root
      value={safeValue}
      className={cn("bg-gray-200 dark:bg-gray-700 h-3 w-full rounded-full overflow-hidden", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("bg-black h-full rounded-full transition-transform duration-300", indicatorClassName)}
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
