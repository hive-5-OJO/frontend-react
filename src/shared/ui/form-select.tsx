import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: Option[];
  onChange?: (value: string) => void;
  className?: string;
}

export const FormSelect = ({
  label,
  placeholder,
  value,
  options,
  onChange,
  className = '',
}: FormSelectProps) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
