import { Input } from "@/shared/ui/input";
import { maskPrice } from "@/shared/lib/price";

export function PriceInput({
  id,
  value,
  onChange,
  required,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <Input
      id={id}
      inputMode="numeric"
      autoComplete="off"
      placeholder="0"
      value={value}
      required={required}
      onChange={(event) => onChange(maskPrice(event.target.value))}
    />
  );
}
