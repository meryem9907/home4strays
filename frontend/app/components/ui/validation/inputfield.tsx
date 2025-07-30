"use client";

import {useState, ReactNode} from "react";
import {Eye, EyeClosed, CircleAlert, Info} from "lucide-react";

interface InputFieldProps {
  name?: string;
  icon?: ReactNode;
  label?: string;
  type: string;
  placeholder: string;
  info?: string;
  suffix?: string;
  step?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  maxLength?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function InputField({
  name,
  type,
  placeholder,
  value,
  info,
  suffix,
  step,
  onChange,
  error,
  label,
  icon,
  maxLength,
  min,
  max,
  disabled,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className={`input ${!suffix ? "floating-label" : ""} w-full ${error ? "input-error" : ""}`}>
        {!suffix && <span> {label ? label : placeholder} </span>}

        {icon}

        <input
          name={name}
          className="validator"
          type={showPassword ? "text" : type}
          step={step}
          maxLength={maxLength}
          min={min}
          max={max}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />

        {type === "password" && (
          <label className="swap items-center pr-2">
            <input type="checkbox" className="hidden" onChange={togglePasswordVisibility} />
            <div className="swap-on">
              <Eye className="w-5 h-5" />
            </div>
            <div className="swap-off">
              <EyeClosed className="w-5 h-5" />
            </div>
          </label>
        )}

        {info && (
          <div className="tooltip tooltip-left md:tooltip-top" data-tip={info}>
            <Info className="text-primary cursor-pointer" size={20} />
          </div>
        )}

        {!suffix && error && (
          <div className="tooltip flex items-center" data-tip={error}>
            <CircleAlert className="text-error" />
          </div>
        )}

        {suffix && <span className="label">{suffix}</span>}
      </label>
    </div>
  );
}
