'use client';

import React, { useEffect, useRef, useState } from 'react';

interface GrowingInputProps {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onEnterPress?: () => void;
  onEmpty?: () => void;
}

const GrowingInput: React.FC<GrowingInputProps> = ({
  className = '',
  placeholder,
  value,
  onChange,
  onEnterPress,
  onEmpty,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const input = inputRef.current;
    const span = spanRef.current;
    if (input && span) {
      // Update the span content and adjust input height
      span.textContent = value || '\u200b'; // Zero-width space to maintain height when empty
      input.style.height = `${span.offsetHeight}px`;
    }
  }, [value]);

  return (
    <div className="relative w-full">
      {/* Hidden span for dynamic height calculation */}
      <span
        ref={spanRef}
        className="hidden-span absolute top-0 left-0 invisible whitespace-pre-wrap break-words"
      ></span>
      <input
        ref={inputRef}
        type="text"
        className={`${className} overflow-hidden resize-none h-auto`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (newValue === '' && onEmpty) onEmpty();
          onChange(newValue);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onEnterPress) onEnterPress();
        }}
      />
    </div>
  );
};

export default GrowingInput;
