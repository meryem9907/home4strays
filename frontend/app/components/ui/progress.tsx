import { DaisyUIColor } from "@/app/types/daisyui";

interface ProgressProps {
  progress: number; 
  color?: DaisyUIColor;
}

export default function Progress({
  progress,
  color,
}: ProgressProps) {

  let resolvedColor: DaisyUIColor;

  if (color) {
    resolvedColor = color;
  } else if (progress >= 75) {
    resolvedColor = "success";
  } else if (progress >= 40) {
    resolvedColor = "warning";
  } else {
    resolvedColor = "error";
  }

  const colorClassMap: Record<DaisyUIColor, string> = {
    primary: "progress-primary",
    secondary: "progress-secondary",
    accent: "progress-accent",
    neutral: "progress-neutral",
    info: "progress-info",
    success: "progress-success",
    warning: "progress-warning",
    error: "progress-error",
    ghost: "progress-ghost",
  };

  const colorClass = colorClassMap[resolvedColor];

  return (
    <div className="w-full">
      <progress 
        className={`progress ${colorClass} w-full`} 
        value={progress} 
        max="100"
      />
    </div>
  )   
}