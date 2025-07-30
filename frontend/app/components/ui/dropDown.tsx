import { ReactNode } from "react";
import { DaisyUIColor } from "../../types/daisyui";
import Button from "./button";
import { Link } from "@/i18n/routing";

interface DropDownItem {
  label?: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
  hidden?: boolean;
}

interface DropDownProps {
  items?: DropDownItem[];
  color?: DaisyUIColor;
  label?: string;
  icon: ReactNode;
  bgColor?: DaisyUIColor;
}

export default function DropDown({
  items,
  color = "ghost",
  icon,
  bgColor,
  label,
}: DropDownProps) {
  return (

    <div className="dropdown dropdown-end">
      <div tabIndex={0}>
        <Button label={label} icon={icon} color={color} />
      </div>
      <ul
        tabIndex={0}
        className={`dropdown-content z-[1] menu p-2 shadow bg-${
          bgColor || "base-100"
        } rounded-box `}
      >
        {(items?.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link href={item.href} className={`flex items-center gap-2 font-semibold whitespace-nowrap 
                ${item.active ? 'bg-neutral text-neutral-content' : '' }
                ${item.hidden ? 'hidden' : ''}`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className={`flex items-center gap-2 w-full text-left font-semibold
                  ${item.active ? 'bg-neutral text-neutral-content' : '' }`}
                
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            )}
          </li>
        )))}
      </ul>
    </div>
  );
}