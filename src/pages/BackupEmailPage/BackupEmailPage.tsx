/**
 * BackupEmailPage Component
 *
 * Usage:
 * - Dedicated page for adding/editing backup email
 * - Follows app's design patterns with back button navigation
 * - Matches Figma design with proper header and layout
 * - No loading states, follows other page patterns
 *
 * Props: None (uses navigation state or API to get current email)
 */

import { api } from "@/helpers/api"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const BackupEmailPage: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Load current backup email on mount (no loading state)
  useEffect(() => {
    const loadCurrentEmail = async () => {
      try {
        const prefs = await api.preferences()
        setEmail(prefs.backupEmail || "")
      } catch (error) {
        console.error("Failed to load preferences:", error)
      }
    }

    loadCurrentEmail()
  }, [])

  const handleSave = async () => {
    const trimmedEmail = email.trim()

    // Basic email validation
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showAlert?.(
          "Please enter a valid email address."
        )
      } catch {
        alert("Please enter a valid email address.")
      }
      return
    }

    setIsSaving(true)
    try {
      await api.updatePreferences({ backupEmail: trimmedEmail || null })

      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showPopup?.({
          title: "Backup Email",
          message: trimmedEmail
            ? "Email saved successfully."
            : "Email removed successfully."
        })
      } catch {}

      // Navigate back to settings
      navigate("/settings")
    } catch (error) {
      console.error("Failed to save backup email:", error)
      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showAlert?.(
          "Failed to save backup email. Please try again."
        )
      } catch {
        alert("Failed to save backup email. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    navigate("/settings")
  }

  return (
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
        <div className="text-gray-100 text-base font-bold">Backup Email</div>
        <div className="w-12 h-12 p-2.5 rounded-[50px]" />
      </div>

      {/* Main form container */}
      <div className="px-4 mt-6 relative z-10">
        <div className="form-card w-full max-w-[408px]">
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-[5px]">
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                <div className="self-stretch justify-center text-gray-100 text-base font-medium font-['Manrope'] leading-snug">
                  Backup Email
                </div>
                <div className="self-stretch h-14 px-4 py-3.5 bg-zinc-950 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 inline-flex justify-start items-center gap-2.5">
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSaving}
                    className="flex-1 bg-transparent text-gray-100 text-sm font-medium font-['Manrope'] leading-tight placeholder:text-neutral-400 outline-none disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="self-stretch inline-flex justify-between items-center gap-4">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 h-14 p-3 bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center gap-2.5 active:opacity-80 disabled:opacity-50">
              <div className="text-right justify-center text-neutral-400 text-base font-medium font-['Manrope'] leading-normal">
                Cancel
              </div>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 h-14 p-3 bg-blue-500 rounded-2xl flex justify-center items-center gap-2.5 active:opacity-90 disabled:opacity-50">
              <div className="justify-center text-gray-100 text-base font-bold font-['Manrope'] leading-snug">
                {isSaving ? "Saving..." : "Save Now"}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
