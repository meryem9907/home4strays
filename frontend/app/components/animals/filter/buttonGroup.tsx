import Button from "../../ui/button"; // passe den Pfad ggf. an
import { ReactNode } from "react";

/**
 * Interface defining the structure of individual button group items.
 *
 * @interface ButtonGroupItem
 * @template T - The value type for the button item
 * @property {T} value - The value associated with this button item
 * @property {ReactNode} [icon] - Optional icon to display with the button
 * @property {string} [label] - Optional text label for the button
 * @property {string} [tooltip] - Optional tooltip text shown on hover
 */
interface ButtonGroupItem<T> {
  value: T;
  icon?: ReactNode;
  label?: string;
  tooltip?: string;
}

/**
 * Props interface for the ButtonGroup component.
 *
 * @interface ButtonGroupProps
 * @template T - The value type for button items (must extend string)
 * @property {ButtonGroupItem<T>[]} items - Array of button items to display
 * @property {T} active - Currently selected value
 * @property {Function} onChange - Callback function when selection changes
 * @property {boolean} [includeReset=false] - Whether to include a reset button
 * @property {ReactNode} [resetIcon] - Optional icon for the reset button
 * @property {string} [resetLabel="Reset"] - Label text for the reset button
 * @property {T} resetValue - Value to use when reset is triggered
 * @property {"sm" | "md" | "lg"} [size] - Size of the buttons
 */
interface ButtonGroupProps<T> {
  items: ButtonGroupItem<T>[];
  active: T;
  onChange: (value: T) => void;
  includeReset?: boolean;
  resetIcon?: ReactNode;
  resetLabel?: string;
  resetValue: T;
  size?: "sm" | "md" | "lg";
}

/**
 * ButtonGroup component for single-select filtering with button-style interface.
 *
 * This component renders a group of buttons for single-select scenarios, such as
 * gender selection or verification status filtering. Only one option can be selected
 * at a time, and the component provides visual feedback for the active selection.
 *
 * Features:
 * - Single-select functionality (radio button behavior)
 * - Optional reset button to clear selection
 * - Icon and tooltip support for each item
 * - Visual indication of active selection
 * - Responsive button sizing
 * - Disabled state for reset button when appropriate
 *
 * @template T - The value type for button items (must extend string)
 * @param {ButtonGroupProps<T>} props - Component props
 * @returns {JSX.Element} Rendered button group component
 *
 * @example
 * ```tsx
 * // Gender filter with icons
 * const genderOptions = [
 *   { value: "Male", icon: <Mars />, label: "Male", tooltip: "Male animals" },
 *   { value: "Female", icon: <Venus />, label: "Female", tooltip: "Female animals" }
 * ];
 *
 * function GenderFilter() {
 *   const [selectedGender, setSelectedGender] = useState<string>("All");
 *
 *   return (
 *     <ButtonGroup
 *       items={genderOptions}
 *       active={selectedGender}
 *       onChange={setSelectedGender}
 *       includeReset={true}
 *       resetLabel="All Genders"
 *       resetValue="All"
 *       size="md"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Verification status filter
 * const verificationOptions = [
 *   { value: "verified", label: "Verified" },
 *   { value: "not verified", label: "Not Verified" }
 * ];
 *
 * function VerificationFilter() {
 *   const [verification, setVerification] = useState<string>("All");
 *
 *   return (
 *     <ButtonGroup
 *       items={verificationOptions}
 *       active={verification}
 *       onChange={setVerification}
 *       resetValue="All"
 *       size="sm"
 *     />
 *   );
 * }
 * ```
 */
export default function ButtonGroup<T extends string>({
  items,
  active,
  onChange,
  includeReset = false,
  resetIcon,
  resetLabel = "Reset",
  resetValue,
  size,
}: ButtonGroupProps<T>) {
  return (
    <div className="flex justify-center space-x-2  ">
      <div className="tooltip" data-tip="Reset">
        {includeReset && (
          <Button
            icon={resetIcon}
            label={resetLabel}
            size={size || "sm"}
            type="button"
            disabled={active === resetValue}
            onClick={() => onChange(resetValue)}
            color="primary"
            aria-label={resetLabel}
          />
        )}
      </div>
      {items.map(({ value, icon, label, tooltip }) => (
        <div className="tooltip" data-tip={tooltip} key={value}>
          <Button
            key={value}
            icon={icon}
            label={label}
            size={size || "sm"}
            type="button"
            color={active === value ? "secondary" : "primary"}
            onClick={() => onChange(value)}
            aria-label={label || String(value)}
          />
        </div>
      ))}
    </div>
  );
}
