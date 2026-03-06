import { Button } from './button';

interface FilterToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const FilterToggleButton = ({ isOpen, onToggle }: FilterToggleButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      leftIcon={
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      }
    >
      <span className="inline-block w-[4.5rem] text-center">
        {isOpen ? '필터 접기' : '필터 펼치기'}
      </span>
    </Button>
  );
};
