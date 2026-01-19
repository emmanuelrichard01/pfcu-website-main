
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
  { value: "Assistant General Secretary", label: "Assistant General Secretary" },
  { value: "P.R.O & Provost", label: "P.R.O & Provost" },
  { value: "Financial Secretary", label: "Financial Secretary" }
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
          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md focus:outline-none focus:ring-2 focus:ring-pfcu-primary focus:border-transparent text-sm"
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
