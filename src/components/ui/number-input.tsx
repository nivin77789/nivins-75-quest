import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, min = 0, max = 100, step = 0.1, unit, ...props }, ref) => {
    const handleIncrement = () => {
      const newValue = Math.min(value + step, max);
      onChange(parseFloat(newValue.toFixed(1)));
    };

    const handleDecrement = () => {
      const newValue = Math.max(value - step, min);
      onChange(parseFloat(newValue.toFixed(1)));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value) || 0;
      onChange(Math.min(Math.max(newValue, min), max));
    };

    return (
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleDecrement}
          disabled={value <= min}
          className="h-10 w-10 rounded-full hover:scale-110 transition-transform"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="relative flex-1">
          <input
            type="number"
            className={cn(
              "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            ref={ref}
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
              {unit}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleIncrement}
          disabled={value >= max}
          className="h-10 w-10 rounded-full hover:scale-110 transition-transform"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    );
  },
);
NumberInput.displayName = "NumberInput";

export { NumberInput };