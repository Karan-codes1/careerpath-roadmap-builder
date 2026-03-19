"use client";

import React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "./utils";

export function Progress({ className, value = 0, ...props }) {
  return (
    <ProgressPrimitive.Root
      className="bg-gray-200 h-3 w-full rounded-full overflow-hidden"
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="bg-black h-full transition-transform"
        style={{ transform: `translateX(-${100 - value+0.5}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
