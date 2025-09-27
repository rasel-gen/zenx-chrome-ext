import React, { useState } from 'react';

export interface PasscodePromptModalProps {
  mode: 'set' | 'update' | 'disable' | 'verify';
  onCancel: () => void;
  onSubmit: (params: { currentPasscode?: string; newPasscode?: string }) => Promise<void> | void;
  errorText?: string; // optional inline error display
}

/**
 * PasscodePromptModal
 * - Generic modal for passcode operations.
 *
 * Usage:
 * ```tsx
 * <PasscodePromptModal
 *   mode="verify"
 *   onCancel={() => setOpen(false)}
 *   onSubmit={({ currentPasscode }) => verifyAndContinue(currentPasscode!)}
 * />
 * ```
 */
export const PasscodePromptModal: React.FC<PasscodePromptModalProps> = ({ mode, onCancel, onSubmit, errorText }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);

  const title = mode === 'set' ? 'Set Passcode' : mode === 'update' ? 'Update Passcode' : mode === 'disable' ? 'Disable Passcode' : 'Enter Passcode';

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
      <div className="w-[360px] p-4 bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800 flex flex-col gap-3">
        <div className="text-gray-100 text-base font-bold">{title}</div>
        {(mode === 'update' || mode === 'disable') && (
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full h-12 px-3 bg-zinc-950 rounded-xl outline outline-1 outline-zinc-800 text-gray-100"
            placeholder="Current passcode"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        )}
        {(mode === 'set' || mode === 'update') && (
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full h-12 px-3 bg-zinc-950 rounded-xl outline outline-1 outline-zinc-800 text-gray-100"
            placeholder="New passcode"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        )}
        {mode === 'verify' && (
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full h-12 px-3 bg-zinc-950 rounded-xl outline outline-1 outline-zinc-800 text-gray-100"
            placeholder="Enter passcode"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        )}
        {errorText && (
          <div className="text-red-400 text-sm">{errorText}</div>
        )}
        <div className="flex gap-2 mt-2">
          <button className="flex-1 h-12 rounded-xl bg-neutral-800 text-neutral-300" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            className="flex-1 h-12 rounded-xl bg-blue-500 text-gray-100 disabled:opacity-50"
            disabled={busy || (mode === 'set' && !next) || (mode === 'update' && (!current || !next)) || (mode === 'disable' && !current) || (mode === 'verify' && !current)}
            onClick={async () => {
              try {
                setBusy(true);
                await onSubmit({ currentPasscode: current || undefined, newPasscode: next || undefined });
              } finally {
                setBusy(false);
              }
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};


