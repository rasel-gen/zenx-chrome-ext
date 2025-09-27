import { CurrencyBadge } from "@/components/CurrencyBadge/CurrencyBadge"
import { Page } from "@/components/Page"
// Biometry removed in favor of passcode
import { PasscodePromptModal } from "@/components/PasscodePromptModal/PasscodePromptModal"
import { SeedPhraseModal } from "@/components/SeedPhraseModal/SeedPhraseModal"
import { FIAT_CURRENCIES, FIAT_META, FIAT_SYMBOLS } from "@/config/fiats"
import { api } from "@/helpers/api"
import { useWalletStore } from "@/stores/wallet"
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate()

  // Create user data from Telegram initData or fallback to mock data (same logic as IndexPage)
  const userData = useMemo(() => {
    // Fallback for development/non-Telegram environment
    return {
      name: "John Smith",
      username: "john_smith",
      avatar: undefined
    }
  }, [])

  const baseCurrency = useWalletStore((s) => s.baseCurrency)
  const setBaseCurrency = useWalletStore((s) => s.setBaseCurrency)
  const keyrings = useWalletStore((s) => s.keyrings)
  const [isCurrencyOpen, setCurrencyOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [showSeedModal, setShowSeedModal] = useState(false)
  const [mnemonic, setMnemonic] = useState<string | null>(null)
  const [backupEmail, setBackupEmail] = useState<string>("")
  const [passcodeEnabled, setPasscodeEnabled] = useState<boolean>(false)
  const [showVerifyPassModal, setShowVerifyPassModal] = useState(false)
  const [verifyError, setVerifyError] = useState<string | null>(null)

  // Biometry debug removed

  useEffect(() => {
    // Load current backupEmail from preferences endpoint
    ;(async () => {
      try {
        const prefs = await api.preferences()
        if (typeof prefs?.backupEmail === "string") {
          setBackupEmail(prefs.backupEmail)
        }
        if (typeof (prefs as any)?.passcodeEnabled === "boolean") {
          setPasscodeEnabled(Boolean((prefs as any).passcodeEnabled))
        }
      } catch {}
    })()
  }, [])

  const maskedEmail = useMemo(() => {
    const email = backupEmail || ""
    const [local, domain] = email.split("@")
    if (!local || !domain) return ""
    const visible = local.slice(0, 2)
    return `${visible}${local.length > 2 ? "***" : ""}@${domain}`
  }, [backupEmail])

  // Biometry settings removed

  return (
    <Page back onBack={() => navigate("/dashboard")}>
      <div className="min-h-screen relative bg-zinc-950 overflow-hidden">
        {/* Blue glows */}
        <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500 opacity-90" />
        <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

        {/* Header */}
        <div className="w-full sticky top-0 z-10 px-4 pt-4 pb-3 bg-zinc-950/80 backdrop-blur">
          <div className="flex justify-between items-center">
            <button
              className="flex w-12 h-12 p-2.5 justify-center items-center rounded-[50px] border border-[color:var(--Radial,#252B31)]"
              style={{
                background:
                  "radial-gradient(232.26% 131.83% at 4.47% 1.52%, #252B31 0%, rgba(27,32,37,0.50) 100%)"
              }}
              onClick={() => navigate("/dashboard")}
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
            {/* Debug panel removed */}
            <h1 className="text-[#F0F3F7] text-base font-bold font-['Manrope'] leading-[140%]">
              Settings
            </h1>
            <div className="w-12 h-12" /> {/* Spacer for centering */}
          </div>
        </div>

        <div className="px-4 flex flex-col gap-3">
          {/* User Profile Section */}
          <div className="flex justify-between items-center self-stretch rounded-2xl border-[1.5px] border-[#25282F] bg-[#12151A] p-3.5">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {userData.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="w-36 flex flex-col">
                {userData.name && (
                  <div className="text-gray-100 text-lg font-semibold font-['Manrope'] leading-relaxed">
                    {userData.name}
                  </div>
                )}
                <div className="text-neutral-400 text-sm font-medium font-['Manrope'] leading-tight">
                  @{userData.username}
                </div>
              </div>
            </div>
            <div className="w-11 h-11" />
          </div>

          {/* Settings Menu */}
          <div className="flex flex-col items-start gap-3 self-stretch rounded-2xl border border-[#25282F] bg-[#12151A] p-3.5">
            {/* Wallets Management */}
            <button
              className="flex justify-between items-center w-full cursor-pointer active:opacity-80"
              onClick={() => navigate("/settings/wallets")}>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M3 8V6.75C3 5.23122 4.23122 4 5.75 4H6.25C7.76878 4 9 5.23122 9 6.75V8"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                    />
                    <rect
                      x="2.25"
                      y="8"
                      width="12"
                      height="7"
                      rx="1.5"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                    />
                    <circle cx="8.25" cy="11.5" r="1" fill="#F0F3F7" />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Wallets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-base font-medium font-['Manrope'] leading-relaxed">
                  {(keyrings || []).length} wallet
                  {(keyrings || []).length !== 1 ? "s" : ""}
                </span>
                <img
                  src="/arrow-right-01.png"
                  alt="Manage"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </button>

            <div className="w-[380px] h-px bg-[#25282F]" />
            {/* Backup Email */}
            <div className="flex items-center w-full gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M2.25 4.5L9 9.75L15.75 4.5"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3.375 3.75H14.625C15.2463 3.75 15.75 4.25368 15.75 4.875V13.125C15.75 13.7463 15.2463 14.25 14.625 14.25H3.375C2.75368 14.25 2.25 13.7463 2.25 13.125V4.875C2.25 4.25368 2.75368 3.75 3.375 3.75Z"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Backup Email
                </span>
              </div>
              <button
                className="flex items-center gap-2 bg-transparent ml-auto min-w-0"
                onClick={() => navigate("/settings/backup-email")}
                aria-label="Edit backup email">
                <span className="text-neutral-400 text-base font-medium font-['Manrope'] leading-relaxed text-right truncate max-w-[180px]">
                  {backupEmail ? maskedEmail : "Add"}
                </span>
                <img
                  src="/arrow-right-01.png"
                  alt="Edit"
                  className="w-4 h-4 opacity-60 shrink-0"
                />
              </button>
            </div>

            <div className="w-[380px] h-px bg-[#25282F]" />
            {/* Currency */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none">
                    <path
                      d="M18.3333 9.99984C18.3333 14.6022 14.6023 18.3332 10 18.3332C5.39763 18.3332 1.66667 14.6022 1.66667 9.99984C1.66667 5.39746 5.39763 1.6665 10 1.6665C14.6023 1.6665 18.3333 5.39746 18.3333 9.99984Z"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                    />
                    <path
                      d="M12.2585 8.38408C12.1759 7.74853 11.4462 6.72168 10.134 6.72166C8.60933 6.72163 7.9678 7.56605 7.83762 7.98826C7.63454 8.553 7.67516 9.71408 9.46225 9.84067C11.6962 9.999 12.5911 10.2627 12.4772 11.6298C12.3633 12.9969 11.1181 13.2923 10.134 13.2606C9.14983 13.229 7.5397 12.7769 7.47721 11.5609M9.97783 5.83154V6.72468M9.97783 13.2524V14.1648"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Currency
                </span>
              </div>
              <button
                className="flex items-center gap-2 bg-transparent"
                onClick={() => setCurrencyOpen(true)}
                aria-label="Open currency dropdown">
                <span className="text-neutral-400 text-base font-medium font-['Manrope'] leading-relaxed">
                  {baseCurrency}
                </span>
                <img
                  src="/arrow-right-01.png"
                  alt="Open"
                  className="w-4 h-4 opacity-60"
                />
              </button>
              {isCurrencyOpen && (
                <div
                  className="fixed inset-0 z-50"
                  onClick={() => setCurrencyOpen(false)}>
                  <div
                    className="absolute right-4 top-28 w-72 max-w-72 p-3.5 bg-neutral-900 rounded-2xl outline outline-1 outline-zinc-800"
                    onClick={(e) => e.stopPropagation()}>
                    {FIAT_CURRENCIES.map((code) => (
                      <button
                        key={code}
                        className="w-full p-3 border-b-[1.5px] border-zinc-800 inline-flex justify-between items-center bg-transparent text-left cursor-pointer last:border-b-0"
                        onClick={() => {
                          setBaseCurrency(code)
                          setCurrencyOpen(false)
                        }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                            <CurrencyBadge code={code} size={40} />
                          </div>
                          <div className="inline-flex flex-col items-start">
                            <div className="text-gray-100 text-base font-semibold leading-snug">
                              {code}
                            </div>
                            <div className="text-neutral-400 text-sm font-medium leading-tight">
                              {FIAT_META[code]?.label ?? ""}
                            </div>
                          </div>
                        </div>
                        <div className="text-neutral-400 text-base font-semibold leading-snug ml-2 min-w-[1.5rem] text-right">
                          {FIAT_SYMBOLS[code] ?? ""}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-[380px] h-px bg-[#25282F]" />

            {/* App Lock (Passcode) */}
            <button
              className="flex justify-between items-center w-full cursor-pointer active:opacity-80"
              onClick={() => navigate("/settings/passcode")}>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <rect
                      x="3"
                      y="8"
                      width="12"
                      height="7"
                      rx="1.5"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                    />
                    <path
                      d="M6 8V6.75C6 5.23122 7.23122 4 8.75 4H9.25C10.7688 4 12 5.23122 12 6.75V8"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Passcode {passcodeEnabled ? "(Enabled)" : "(Disabled)"}{" "}
                </span>
              </div>
              <div className="w-5 h-5 flex justify-center items-center">
                <img
                  src="/arrow-right-01.png"
                  alt="Open"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </button>

            <div className="w-[380px] h-px bg-[#25282F]" />

            {/* Export Recovery Phrase */}
            <button
              className="flex justify-between items-center w-full"
              onClick={async () => {
                if (exporting) return
                setExporting(true)
                try {
                  if (passcodeEnabled) {
                    setVerifyError(null)
                    setShowVerifyPassModal(true)
                    setExporting(false)
                    return
                  }
                  const { mnemonic } = await api.exportSeed()
                  setMnemonic(mnemonic)
                  setShowSeedModal(true)
                } catch (e) {
                  try {
                    // @ts-ignore
                    ;(window as any)?.Telegram?.WebApp?.showAlert?.(
                      "Failed to export recovery phrase."
                    )
                  } catch {
                    alert("Failed to export recovery phrase.")
                  }
                } finally {
                  setExporting(false)
                }
              }}
              disabled={exporting}
              aria-label="Export Recovery Phrase">
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M6 2.25H9.75C12.6495 2.25 15 4.6005 15 7.5C15 10.3995 12.6495 12.75 9.75 12.75H6"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 12.75L7.875 10.5M6 12.75L7.875 15"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  {exporting ? "Exporting..." : "Export Recovery Phrase"}
                </span>
              </div>
              <div className="w-5 h-5 flex justify-center items-center">
                <img
                  src="/arrow-right-01.png"
                  alt="Open"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </button>

            <div className="w-[380px] h-px bg-[#25282F]" />

            {/* Import removed from Settings per onboarding flow */}

            {/* Language (static English) */}
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 6.90559 2.35849 5.0117 3.74278 3.65102M9 16.5C8.27775 15.9648 8.39303 15.3416 8.75535 14.7185C9.31245 13.7606 9.31245 13.7605 9.31245 12.4833C9.31245 11.206 10.0715 10.6072 12.75 11.1428C13.9535 11.3836 14.8306 9.72067 16.393 10.2697M9 16.5C12.7093 16.5 15.7897 13.8072 16.393 10.2697M3.74278 3.65102C4.37974 3.71824 4.73638 4.05948 5.32872 4.68537C6.4533 5.87364 7.57785 5.97279 8.32763 5.5767C9.45218 4.98257 8.50718 4.02023 9.82703 3.49724C10.6362 3.17663 10.7904 2.33699 10.4075 1.63184M16.393 10.2697C16.4633 9.85702 16.5 9.43282 16.5 9C16.5 5.33893 13.8768 2.29054 10.4075 1.63184"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Language
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-base font-medium font-['Manrope'] leading-relaxed">
                  English
                </span>
                <img
                  src="/arrow-right-01.png"
                  alt="Expand"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </div>

            <div className="w-[380px] h-px bg-[#25282F]" />

            {/* Privacy Policy */}
            <button
              className="flex justify-between items-center w-full"
              onClick={() => navigate("/privacy")}>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M6 5.25H12"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 8.25H9"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.75 16.125V15.75C9.75 13.6287 9.75 12.5681 10.409 11.909C11.0681 11.25 12.1287 11.25 14.25 11.25H14.625M15 10.0073V7.5C15 4.67157 15 3.25736 14.1213 2.37868C13.2427 1.5 11.8284 1.5 9 1.5C6.17158 1.5 4.75736 1.5 3.87868 2.37868C3 3.25736 3 4.67157 3 7.5V10.9081C3 13.3419 3 14.5588 3.66455 15.383C3.79881 15.5495 3.95048 15.7012 4.117 15.8354C4.94123 16.5 6.15811 16.5 8.59185 16.5C9.12105 16.5 9.38558 16.5 9.6279 16.4145C9.6783 16.3967 9.72765 16.3763 9.77588 16.3532C10.0077 16.2423 10.1947 16.0553 10.5689 15.6811L14.1213 12.1287C14.5549 11.6951 14.7716 11.4784 14.8858 11.2027C15 10.9271 15 10.6204 15 10.0073Z"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Privacy Policy
                </span>
              </div>
              <div className="w-5 h-5 flex justify-center items-center">
                <img
                  src="/arrow-right-01.png"
                  alt="Open"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </button>

            <div className="w-[380px] h-px bg-[#25282F]" />

            {/* Contact Us */}
            <button
              className="flex justify-between items-center w-full"
              onClick={() => navigate("/settings/contact")}>
              <div className="flex items-center gap-2">
                <div
                  className="w-11 h-11 flex justify-center items-center rounded-[45.83px]"
                  style={{
                    padding: "9.167px",
                    background: "var(--Shading-2, #1D2026)",
                    aspectRatio: "1 / 1"
                  }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none">
                    <path
                      d="M16.5 8.67502C16.5 12.6374 13.1417 15.85 9 15.85C8.51303 15.8507 8.0274 15.8057 7.54905 15.7159C7.20475 15.6512 7.03258 15.6188 6.9124 15.6372C6.7922 15.6556 6.62189 15.7461 6.28124 15.9273C5.31761 16.4398 4.19396 16.6207 3.11333 16.4197C3.52406 15.9145 3.80456 15.3084 3.92834 14.6586C4.00334 14.2611 3.8175 13.875 3.53917 13.5923C2.275 12.3086 1.5 10.5788 1.5 8.67502C1.5 4.71268 4.85833 1.5 9 1.5C13.1417 1.5 16.5 4.71268 16.5 8.67502Z"
                      stroke="#F0F3F7"
                      strokeWidth="1.125"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.99662 9H9.00338M11.9933 9H12M6 9H6.00673"
                      stroke="#F0F3F7"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-gray-100 text-base font-medium font-['Manrope'] leading-relaxed">
                  Contact us
                </span>
              </div>
              <div className="w-5 h-5 flex justify-center items-center">
                <img
                  src="/arrow-right-01.png"
                  alt="Open"
                  className="w-4 h-4 opacity-60"
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Seed Phrase Modal */}
      {showSeedModal && mnemonic && (
        <SeedPhraseModal
          mnemonic={mnemonic}
          onClose={() => {
            setShowSeedModal(false)
            setMnemonic(null)
          }}
        />
      )}

      {/* Verify passcode for export */}
      {showVerifyPassModal && (
        <PasscodePromptModal
          mode="verify"
          onCancel={() => setShowVerifyPassModal(false)}
          errorText={verifyError || undefined}
          onSubmit={async ({ currentPasscode }) => {
            try {
              const { mnemonic } = await api.exportSeed(currentPasscode)
              setMnemonic(mnemonic)
              setShowSeedModal(true)
              setShowVerifyPassModal(false)
              setVerifyError(null)
            } catch (e: any) {
              setVerifyError(String(e?.message || "Invalid passcode"))
              // keep modal open for retry
            }
          }}
        />
      )}
    </Page>
  )
}
