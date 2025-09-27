/**
 * PasscodePage Component
 *
 * Usage:
 * - Dedicated page to set, update, or disable the app passcode
 * - Mirrors BackupEmailPage layout with back button and action buttons
 * - Reads current passcodeEnabled from preferences; shows appropriate inputs
 */

import { PasscodePromptModal } from "@/components/PasscodePromptModal/PasscodePromptModal"
import { PinInput } from "@/components/PinInput/PinInput"
import { api } from "@/helpers/api"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const PasscodePage: React.FC = () => {
  const navigate = useNavigate()
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [currentPasscode, setCurrentPasscode] = useState("")
  const [newPasscode, setNewPasscode] = useState("")
  const [confirmPasscode, setConfirmPasscode] = useState("")
  const [busy, setBusy] = useState(false)
  const [showDisableModal, setShowDisableModal] = useState(false)
  const [disableError, setDisableError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const prefs = await api.preferences()
        setPasscodeEnabled(Boolean((prefs as any)?.passcodeEnabled))
      } catch {}
    })()
  }, [])

  const handleSave = async () => {
    if (busy) return
    setBusy(true)
    try {
      if (!passcodeEnabled) {
        if (
          !newPasscode ||
          newPasscode.length !== 6 ||
          newPasscode !== confirmPasscode
        ) {
          setBusy(false)
          return
        }
        await api.updatePreferences({ setPasscode: { newPasscode } })
      } else {
        if (!currentPasscode || currentPasscode.length !== 6) {
          setBusy(false)
          try {
            ;(window as any)?.Telegram?.WebApp?.showAlert?.(
              "Please enter your current passcode."
            )
          } catch {
            alert("Please enter your current passcode.")
          }
          return
        }
        if (
          !newPasscode ||
          newPasscode.length !== 6 ||
          newPasscode !== confirmPasscode
        ) {
          setBusy(false)
          return
        }
        await api.updatePreferences({
          setPasscode: {
            currentPasscode: currentPasscode || undefined,
            newPasscode
          }
        })
      }
      navigate("/settings")
    } catch (e) {
      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showAlert?.(
          String((e as any)?.message || "Failed to update passcode")
        )
      } catch {
        alert(String((e as any)?.message || "Failed to update passcode"))
      }
    } finally {
      setBusy(false)
    }
  }

  const handleDisable = async () => {
    if (busy || !passcodeEnabled) {
      navigate("/settings")
      return
    }
    setDisableError(null)
    setShowDisableModal(true)
  }

  const handleCancel = () => {
    navigate("/settings")
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-zinc-950/95 overflow-y-auto">
        {/* Background eclipse effect */}
        <div
          className="fixed -top-[60px] -right-[60px] w-[400px] h-[400px] opacity-60 z-0 pointer-events-none"
          style={{
            backgroundImage: "url(/bg-eclips.png)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center"
          }}
        />

        {/* Blue glows */}
        <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500" />
        <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

        {/* Header with back button */}
        <div className="w-full px-4 pt-4 flex justify-between items-center relative z-10">
          <button
            onClick={handleCancel}
            className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
            style={{
              background:
                "radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)"
            }}
            aria-label="Back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="flex-shrink-0"
              style={{ aspectRatio: "1 / 1" }}>
              <path
                d="M3.33318 10H16.6665"
                stroke="#EBEFF0"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.4997 14.1667C7.4997 14.1667 3.33307 11.098 3.33305 10C3.33305 8.90204 7.49972 5.83337 7.49972 5.83337"
                stroke="#EBEFF0"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="text-gray-100 text-base font-bold">Passcode</div>
          <div className="w-12 h-12 p-2.5 rounded-[50px]" />
        </div>

        {/* Main form container */}
        <div className="px-4 mt-6 relative z-10">
          <div className="form-card w-full max-w-[408px]">
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
                <div className="self-stretch flex flex-col justify-start items-start gap-3">
                  <div className="self-stretch justify-center text-gray-100 text-base font-medium font-['Manrope'] leading-snug">
                    {passcodeEnabled ? "Update Passcode" : "Set Passcode"}
                  </div>

                  {passcodeEnabled && (
                    <div className="self-stretch inline-flex flex-col gap-2">
                      <div className="text-neutral-400 text-sm">
                        Current passcode
                      </div>
                      <PinInput
                        length={6}
                        value={currentPasscode}
                        onChange={setCurrentPasscode}
                        disabled={busy}
                      />
                    </div>
                  )}

                  <div className="self-stretch inline-flex flex-col gap-2">
                    <div className="text-neutral-400 text-sm">
                      {passcodeEnabled ? "New passcode" : "Passcode"}
                    </div>
                    <PinInput
                      length={6}
                      value={newPasscode}
                      onChange={setNewPasscode}
                      disabled={busy}
                      autoFocus={!passcodeEnabled}
                    />
                  </div>
                  <div className="self-stretch inline-flex flex-col gap-2">
                    <div className="text-neutral-400 text-sm">
                      Re-type passcode
                    </div>
                    <PinInput
                      length={6}
                      value={confirmPasscode}
                      onChange={setConfirmPasscode}
                      disabled={busy}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="self-stretch inline-flex justify-between items-center gap-4">
              <button
                onClick={handleCancel}
                disabled={busy}
                className="flex-1 h-14 p-3 bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center gap-2.5 active:opacity-80 disabled:opacity-50">
                <div className="text-right justify-center text-neutral-400 text-base font-medium font-['Manrope'] leading-normal">
                  Cancel
                </div>
              </button>
              <button
                onClick={handleSave}
                disabled={
                  busy ||
                  !newPasscode ||
                  newPasscode.length !== 6 ||
                  newPasscode !== confirmPasscode ||
                  (passcodeEnabled &&
                    (!currentPasscode || currentPasscode.length !== 6))
                }
                className="flex-1 h-14 p-3 bg-blue-500 rounded-2xl flex justify-center items-center gap-2.5 active:opacity-90 disabled:opacity-50">
                <div className="justify-center text-gray-100 text-base font-bold font-['Manrope'] leading-snug">
                  {busy ? "Saving..." : passcodeEnabled ? "Update" : "Save Now"}
                </div>
              </button>
            </div>

            {passcodeEnabled && (
              <div className="mt-4">
                <button
                  onClick={handleDisable}
                  disabled={busy}
                  className="text-red-400 text-sm underline disabled:opacity-50">
                  Disable passcode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDisableModal && (
        <PasscodePromptModal
          mode="verify"
          errorText={disableError || undefined}
          onCancel={() => {
            setShowDisableModal(false)
            setDisableError(null)
          }}
          onSubmit={async ({ currentPasscode }) => {
            try {
              await api.updatePreferences({
                disablePasscode: { currentPasscode }
              })
              setShowDisableModal(false)
              setDisableError(null)
              navigate("/settings")
            } catch (e: any) {
              setDisableError(String(e?.message || "Invalid passcode"))
            }
          }}
        />
      )}
    </>
  )
}
