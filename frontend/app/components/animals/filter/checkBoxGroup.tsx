import Button from "../../ui/button";
import { ReactNode } from "react";

/**
 * Interface defining the structure of individual checkbox group items.
 *
 * @interface CheckboxGroupItem
 * @template T - The value type for the checkbox item
 * @property {T} value - The value associated with this checkbox item
 * @property {ReactNode} [icon] - Optional icon to display with the item
 * @property {string} [label] - Optional text label for the item
 * @property {string} [tooltip] - Optional tooltip text shown on hover
 * @property {boolean} [wide] - Whether the item should take full width
 */
export interface CheckboxGroupItem<T> {
  value: T;
  icon?: ReactNode;
  label?: string;
  tooltip?: string;
  wide?: boolean;
}

/**
 * Props interface for the CheckboxGroup component.
 *
 * @interface CheckboxGroupProps
 * @template T - The value type for checkbox items (must extend string)
 * @property {CheckboxGroupItem<T>[]} items - Array of checkbox items to display
 * @property {T[]} active - Array of currently selected values
 * @property {Function} onChange - Callback function when selection changes
 * @property {boolean} [includeReset=false] - Whether to include a reset button
 * @property {ReactNode} [resetIcon] - Optional icon for the reset button
 * @property {string} [resetLabel="Reset"] - Label text for the reset button
 * @property {T} resetValue - Value to use when reset is triggered
 * @property {"sm" | "md" | "lg"} [size] - Size of the buttons
 * @property {"row" | "col"} [direction="row"] - Layout direction for the button group
 * @property {boolean} [wide] - Whether buttons should take full width
 */
interface CheckboxGroupProps<T> {
  items: CheckboxGroupItem<T>[];
  active: T[];
  onChange: (value: T[]) => void;
  includeReset?: boolean;
  resetIcon?: ReactNode;
  resetLabel?: string;
  resetValue: T;
  size?: "sm" | "md" | "lg";
  direction?: "row" | "col";
  wide?: boolean;
}

/**
 * CheckboxGroup component for multi-select filtering with button-style interface.
 *
 * This component renders a group of buttons that behave like checkboxes, allowing
 * users to select multiple options from a list. Each item can have an icon, label,
 * and tooltip. The component supports reset functionality and flexible layout options.
 *
 * Features:
 * - Multi-select functionality with toggle behavior
 * - Optional reset button to clear all selections
 * - Icon and tooltip support for each item
 * - Flexible layout (row or column)
 * - Responsive button sizing
 * - Full width option for buttons
 * - Disabled state for reset button when appropriate
 *
 * @template T - The value type for checkbox items (must extend string)
 * @param {CheckboxGroupProps<T>} props - Component props
 * @returns {JSX.Element} Rendered checkbox group component
 *
 * @example
 * ```tsx
 * // Species filter with icons
 * const speciesOptions = [
 *   { value: "Cat", icon: <Cat />, label: "Cats", tooltip: "Feline animals" },
 *   { value: "Dog", icon: <Dog />, label: "Dogs", tooltip: "Canine animals" },
 *   { value: "Bird", icon: <Bird />, label: "Birds", tooltip: "Avian animals" }
 * ];
 *
 * function SpeciesFilter() {
 *   const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
 *
 *   return (
 *     <CheckboxGroup
 *       items={speciesOptions}
 *       active={selectedSpecies}
 *       onChange={setSelectedSpecies}
 *       includeReset={true}
 *       resetLabel="All Species"
 *       resetValue="any"
 *       size="md"
 *       direction="row"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Health status filter without icons
 * const healthOptions = [
 *   { value: "Healthy", label: "Healthy" },
 *   { value: "Sick", label: "Needs Medical Care" },
 *   { value: "Vaccinated", label: "Fully Vaccinated" }
 * ];
 *
 * function HealthFilter() {
 *   const [healthStatus, setHealthStatus] = useState<string[]>([]);
 *
 *   return (
 *     <CheckboxGroup
 *       items={healthOptions}
 *       active={healthStatus}
 *       onChange={setHealthStatus}
 *       resetValue="no filter"
 *       size="sm"
 *       direction="col"
 *       wide={true}
 *     />
 *   );
 * }
 * ```
 */
export default function CheckboxGroup<T extends string>({
  items,
  active,
  onChange,
  includeReset = false,
  resetIcon,
  resetLabel = "Reset",
  size,
  wide,
  resetValue,

  direction = "row",
}: CheckboxGroupProps<T>) {
  /**
   * Toggles the selection state of a checkbox item.
   * If the item is currently selected, it will be removed from the selection.
   * If the item is not selected, it will be added to the selection.
   *
   * @param {T} value - The value to toggle
   */
  const toggleValue = (value: T) => {
    if (active.includes(value)) {
      // Remove from selection
      onChange(active.filter((v) => v !== value));
    } else {
      // Add to selection
      onChange([...active, value]);
    }
  };

  /**
   * Determines if the component is in its reset state.
   * Reset state is when no items are selected or only the reset value is selected.
   */
  const isResetState =
    active.length === 0 || (active.length === 1 && active[0] === resetValue);

  return (
    <div
      className={`flex justify-center flex-wrap gap-2 ${
        direction === "col" ? "flex-col" : "flex-row"
      }`}
    >
      {includeReset && (
        <div className="tooltip" data-tip="Reset">
          <Button
            icon={resetIcon}
            label={resetLabel}
            size={size || "sm"}
            type="button"
            onClick={() => onChange([])}
            color="primary"
            aria-label={resetLabel}
            disabled={isResetState}
          />
        </div>
      )}
      {items.map(({ value, icon, label, tooltip }) => {
        const button = (
          <Button
            icon={icon}
            label={label}
            size={size || "sm"}
            type="button"
            color={active.includes(value) ? "secondary" : "primary"}
            onClick={() => toggleValue(value)}
            aria-label={label || String(value)}
            wide={wide}
          />
        );

        return tooltip ? (
          <div className="tooltip" data-tip={tooltip} key={value}>
            {button}
          </div>
        ) : (
          <div key={value}>{button}</div>
        );
      })}
    </div>
  );
}
