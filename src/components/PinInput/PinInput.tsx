import React, { useEffect, useMemo, useRef } from 'react';

export interface PinInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

/**
 * PinInput
 * - Renders fixed number of single-character inputs for numeric passcode/PIN entry
 * - Handles focus movement, backspace, and paste of multiple digits
 *
 * Usage:
 * ```tsx
 * const [pin, setPin] = useState('');
 * <PinInput length={6} value={pin} onChange={setPin} />
 * ```
 */
export const PinInput: React.FC<PinInputProps> = ({ length = 6, value, onChange, disabled, autoFocus }) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digits = useMemo(() => {
    const arr = Array.from({ length }, (_, i) => value[i] || '');
    return arr;
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      try { inputsRef.current[0]?.focus(); } catch {}
    }
  }, [autoFocus]);

  function setDigitAt(index: number, char: string) {
    const clean = char.replace(/\D/g, '').slice(0, 1);
    if (clean.length === 0) return;
    const arr = digits.slice();
    arr[index] = clean;
    onChange(arr.join('').slice(0, length));
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const v = e.target.value;
    if (v.length > 1) {
      // paste case or autocorrect; distribute across boxes
      const onlyDigits = v.replace(/\D/g, '').slice(0, length);
      if (!onlyDigits) return;
      const arr = digits.slice();
      for (let k = 0; k < onlyDigits.length && i + k < length; k++) {
        arr[i + k] = onlyDigits[k];
      }
      onChange(arr.join(''));
      const nextIndex = Math.min(i + onlyDigits.length, length - 1);
      try { inputsRef.current[nextIndex]?.focus(); } catch {}
      return;
    }
    if (v === '') {
      // clear current
      const arr = digits.slice();
      arr[i] = '';
      onChange(arr.join(''));
      return;
    }
    setDigitAt(i, v);
    if (i < length - 1) {
      try { inputsRef.current[i + 1]?.focus(); } catch {}
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === 'Backspace') {
      if (digits[i]) {
        const arr = digits.slice();
        arr[i] = '';
        onChange(arr.join(''));
      } else if (i > 0) {
        try { inputsRef.current[i - 1]?.focus(); } catch {}
        const arr = digits.slice();
        arr[i - 1] = '';
        onChange(arr.join(''));
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && i > 0) {
      try { inputsRef.current[i - 1]?.focus(); } catch {}
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      try { inputsRef.current[i + 1]?.focus(); } catch {}
      e.preventDefault();
    }
  }

  return (
    <div className="w-full max-w-[408px] mx-auto px-1 flex items-center justify-between gap-1 sm:gap-2">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          value={d}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          disabled={disabled}
          maxLength={1}
          className="w-10 h-12 sm:w-12 sm:h-12 text-center text-base sm:text-lg text-gray-100 bg-zinc-950 rounded-xl outline outline-1 outline-zinc-800 focus:outline-blue-500 disabled:opacity-50"
        />
      ))}
    </div>
  );
};


