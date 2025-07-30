'use client'

import { Check, X } from "lucide-react";
import { useState } from "react";

interface ToggleProps {
  text?: string;
  defaultTrue?: boolean;
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export default function Toggle({
  text,
  defaultTrue = false,
  value,
  onChange,
}: ToggleProps) {

  const [internalValue, setInternalValue] = useState(defaultTrue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (checked: boolean) => {
    if (!isControlled) {
      setInternalValue(checked);
    }
    onChange?.(checked);
  };

  return (
    <span className="flex items-center gap-3 px-2">
      <label className={`toggle toggle-sm ${currentValue ? 'text-success' : 'text-error'}`}>
        <input 
          className=""
          type="checkbox" 
          checked={currentValue}
          onChange={(e) => handleChange(e.target.checked)}
        />
        <X className="h-full w-full" />
        <Check className="h-full w-full " />
      </label>
      <p> { text } </p>
    </span>
  )   
}
