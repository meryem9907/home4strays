"use client"

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface DescriptionProps {
  description: string;
}

export default function Description({
  description,
}: DescriptionProps) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1 text-primary text-sm cursor-pointer mb-2"
      >
        Description
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="mt-2">{description}</p>
      </div>
    </div>
  )   
}
