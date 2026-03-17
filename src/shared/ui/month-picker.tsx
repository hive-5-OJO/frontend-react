import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@/shared/lib/utils';

interface MonthPickerProps {
  label?: string;
  value?: string; // Format: YYYY-MM
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export const MonthPicker = ({ label, value, onChange, className = '', placeholder }: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    if (value) return parseInt(value.split('-')[0]);
    return new Date().getFullYear();
  });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (value) return parseInt(value.split('-')[1]);
    return new Date().getMonth() + 1;
  });
  const [yearRangeStart, setYearRangeStart] = useState(() => {
    const year = value ? parseInt(value.split('-')[0]) : new Date().getFullYear();
    return Math.floor(year / 10) * 10;
  });

  const years = Array.from({ length: 10 }, (_, i) => yearRangeStart + i);
  const months = [
    { value: 1, label: '1월' },
    { value: 2, label: '2월' },
    { value: 3, label: '3월' },
    { value: 4, label: '4월' },
    { value: 5, label: '5월' },
    { value: 6, label: '6월' },
    { value: 7, label: '7월' },
    { value: 8, label: '8월' },
    { value: 9, label: '9월' },
    { value: 10, label: '10월' },
    { value: 11, label: '11월' },
    { value: 12, label: '12월' },
  ];

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    const formattedValue = `${selectedYear}-${String(month).padStart(2, '0')}`;
    onChange?.(formattedValue);
    setOpen(false);
  };

  const handlePrevYears = () => {
    setYearRangeStart(yearRangeStart - 10);
  };

  const handleNextYears = () => {
    setYearRangeStart(yearRangeStart + 10);
  };

  const displayValue = value ? `${selectedYear}년 ${selectedMonth}월` : null;

  return (
    <div className={className}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none',
              'hover:border-gray-300',
              'focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50'
            )}
          >
            <span className={displayValue ? '' : 'text-gray-400'}>{displayValue || placeholder || '선택'}</span>
            <svg
              className="size-4 shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start">
          <div className="space-y-4">
            {/* 년도 선택 */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <button
                  onClick={handlePrevYears}
                  className="rounded p-1 outline-none hover:bg-gray-100"
                  title="이전 10년"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {yearRangeStart} - {yearRangeStart + 9}
                </span>
                <button
                  onClick={handleNextYears}
                  className="rounded p-1 outline-none hover:bg-gray-100"
                  title="다음 10년"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={cn(
                      'rounded px-2 py-1 text-sm outline-none transition-colors',
                      selectedYear === year
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* 월 선택 */}
            <div>
              <label className="mb-2 block text-xs font-medium text-gray-700">월</label>
              <div className="grid grid-cols-4 gap-1">
                {months.map((month) => (
                  <button
                    key={month.value}
                    onClick={() => handleMonthSelect(month.value)}
                    className={cn(
                      'rounded px-2 py-1 text-sm outline-none transition-colors',
                      selectedMonth === month.value
                        ? 'bg-primary-600 text-white'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    {month.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
