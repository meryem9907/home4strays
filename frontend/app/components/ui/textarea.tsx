
interface TextAreaProps {
  rows?: number;
  label?: string;
  placeholder?: string;
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function TextArea({
  rows = 4,
  label,
  placeholder = "",
  name,
  value,
  disabled,
  onChange,
}: TextAreaProps) {

  return (
    <div className="form-control w-full">
      { label && (
        <label className="label">
        <label className="label-text text-xs">{label}</label>
      </label>
      )}
      
      <textarea
        className="textarea textarea-bordered w-full"
        rows={rows}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )   
}
