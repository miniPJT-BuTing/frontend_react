'use client';

import { useState, useEffect, useRef } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  initialMin?: number;
  initialMax?: number;
  unit?: string;
  onChange?: (values: [number, number]) => void;
}

export default function DualRangeSlider({
  min,
  max,
  step = 1,
  initialMin,
  initialMax,
  unit = '',
  onChange,
}: DualRangeSliderProps) {
  const [minValue, setMinValue] = useState(initialMin ?? min);
  const [maxValue, setMaxValue] = useState(initialMax ?? max);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = (value: number) => Math.round(((value - min) / (max - min)) * 100);

  useEffect(() => {
    if (range.current) {
      const minPercent = getPercent(minValue);
      const maxPercent = getPercent(maxValue);

      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minValue, maxValue, min, max]);

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxValue - step);
    setMinValue(value);
    onChange?.([value, maxValue]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minValue + step);
    setMaxValue(value);
    onChange?.([minValue, value]);
  };

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex justify-between text-sm font-medium text-gray-900">
        <span>{minValue}{unit}</span>
        <span>{maxValue}{unit}</span>
      </div>
      
      <div className="relative h-6 flex items-center">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full z-0"></div>

        {/* Selected Range Track */}
        <div
          ref={range}
          className="absolute h-2 bg-[#F7ABCF] rounded-full z-10"
        ></div>

        {/* Left Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className="pointer-events-none absolute h-full w-full appearance-none bg-transparent z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F7ABCF] [&::-webkit-slider-thumb]:shadow-md"
        />

        {/* Right Thumb Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className="pointer-events-none absolute h-full w-full appearance-none bg-transparent z-30 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#F7ABCF] [&::-webkit-slider-thumb]:shadow-md"
        />
      </div>
    </div>
  );
}