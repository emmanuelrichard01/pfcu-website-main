
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface PositionSelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
}

export const LEADERSHIP_POSITIONS = [
  { value: "Pastor/President", label: "Pastor/President" },
  { value: "Assistant Pastor/VP", label: "Assistant Pastor/VP" },
  { value: "General Secretary", label: "General Secretary" },
  { value: "Assistant Secretary & Treasurer", label: "Assistant Secretary & Treasurer" },
  { value: "P.R.O & Financial Secretary", label: "P.R.O & Financial Secretary" },
  { value: "Provost", label: "Provost" }
];

const PositionSelector = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ control, name }: PositionSelectorProps<TFieldValues, TName>) => {
  return (
    <FormItem>
      <FormLabel>Position</FormLabel>
      <FormControl>
        <select 
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pfcu-purple"
          {...control.register(name)}
        >
          {LEADERSHIP_POSITIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PositionSelector;
