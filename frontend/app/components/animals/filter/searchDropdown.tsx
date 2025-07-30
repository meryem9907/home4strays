import { useState, useEffect, useRef } from "react";
import InputField from "../../ui/validation/inputfield";

interface SearchableDropdownProps {
  options: string[];
  onChange: (selectedOptions: string[]) => void;
  placeholder: string;
}

export default function SearchableDropdown({
  options,
  onChange,
  placeholder,
}: SearchableDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const onChangeRef = useRef(onChange);

  const safeOptions = Array.isArray(options)
    ? options.filter(
        (option) =>
          option != null && typeof option === "string" && option.trim() !== ""
      )
    : [];

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current(selectedOptions);
  }, [selectedOptions]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prevSelected) => {
      const updatedSelected = prevSelected.includes(option)
        ? prevSelected.filter((item) => item !== option)
        : [...prevSelected, option];
      return updatedSelected;
    });
  };

  const filteredOptions = safeOptions.filter((option) => {
    if (!option || typeof option !== "string" || option.trim() === "") {
      console.warn("[DEBUG] SearchableDropdown: Invalid option found:", option);
      return false;
    }
    return option.toLowerCase().startsWith(searchTerm.toLowerCase());
  });

  return (
    <div>
      <InputField
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="bg-neutral border border-base-200 shadow-md rounded-xl max-h-32 overflow-y-auto">
        <ul className="p-2">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="flex items-center space-x-2 p-2 hover:bg-base-300 cursor-pointer"
              onClick={() => handleCheckboxChange(option)}
            >
              <input
                type="checkbox"
                id={option}
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
                onClick={(e) => e.stopPropagation()}
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span className="cursor-pointer">{option}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
