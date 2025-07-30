interface SelectProps {
  label: string;
  options: string[];
  disabled?: boolean;
  disabledInfo?: string;
  value: string;
  error?: string;
  onChange?: (value: string) => void;
}

export default function Select({
  label,
  options,
  disabled,
  disabledInfo,
  value,
  error,
  onChange,
}: SelectProps) {

  const select = (
    <span className="flex w-full">
      <select  
        className={`select w-full cursor-pointer ${error ? 'select-error' : ''}`}
        disabled={disabled}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled> { label } </option>

        { options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {/* {error && (
          <div className="tooltip flex items-center pl-2" data-tip={error}>
            <CircleAlert className="text-error" />
          </div>
        )} */}
    </span>
  );

  return disabled && disabledInfo ? (
    <div className="tooltip" data-tip={disabledInfo}>
      {select}
    </div>
  ) : (
    select
  );
}
