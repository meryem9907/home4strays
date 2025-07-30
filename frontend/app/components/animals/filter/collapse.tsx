import { ReactNode } from "react";

interface CollapseProps {
  title: string;
  content: ReactNode;
  type?: "arrow" | "plus";
}   

export default function Collapse({ 
    title, 
    content, 
    type = "arrow",

}: 
CollapseProps) {
  const collClassMap: Record<"arrow"|"plus", string> = {
    arrow: "collapse-arrow",
    plus: "collapse-plus",
  };
	const collClass = collClassMap[type];
 
  return (
    <div tabIndex={0} className={` collapse ${collClass} overflow-visible relative `}>
      <input type="checkbox" className="peer"/>
      <div className="collapse-title text-md font-semibold">
        {title}
      </div>
      <div className="collapse-content peer-checked:block">
        {content}
      </div>
    </div>
	);
}