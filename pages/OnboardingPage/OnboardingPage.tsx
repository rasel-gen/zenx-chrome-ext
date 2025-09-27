import { Page } from "@/components/Page"
import { api } from "@/helpers/api"
import { useWalletStore } from "@/stores/wallet"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const bootstrap = useWalletStore((s) => s.bootstrap)
  const wallets = useWalletStore((s) => s.wallets)
  const [importOpen, setImportOpen] = useState(false)
  const [mnemonic, setMnemonic] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")

  // Redirect guard: if wallets already exist, go to dashboard
  useEffect(() => {
    if ((wallets || []).length > 0) {
      console.log("navigating to dashboard")
      navigate("/dashboard", { replace: true })
    }
  }, [wallets, navigate])

  const createNew = async () => {
    if (loading) return
    setLoading(true)
    setLoadingMessage("Creating your wallet...")
    try {
      await api.createSeedAndWallets()
      setLoadingMessage("Setting up your account...")
      await bootstrap()
      console.log("navigating to dashboard")
      navigate("/dashboard")
    } catch (error) {
      setLoading(false)
      setLoadingMessage("")
      console.error(error)
      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showAlert?.(
          "Failed to create wallet. Please try again."
        )
      } catch {
        alert("Failed to create wallet. Please try again.")
      }
    }
  }

  const doImport = async () => {
    if (loading) return
    if (!mnemonic.trim()) return
    setLoading(true)
    setLoadingMessage("Importing your wallet...")
    try {
      await api.importSeed(mnemonic.trim())
      setLoadingMessage("Restoring your account...")
      await bootstrap()
      console.log("navigating to dashboard")
      navigate("/dashboard")
    } catch (error) {
      setLoading(false)
      setLoadingMessage("")
      try {
        // @ts-ignore
        ;(window as any)?.Telegram?.WebApp?.showAlert?.(
          "Failed to import. Check phrase and try again."
        )
      } catch {
        alert("Failed to import. Check phrase and try again.")
      }
    }
  }

  // Show loading screen when processing
  if (loading) {
    return (
      <Page back={false}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Full background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/splash.svg)" }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center gap-6">
              {/* Loading message */}
              <div className="text-center">
                <h2 className="text-white text-xl font-semibold drop-shadow-lg">
                  {loadingMessage}
                </h2>
                <p className="text-gray-200 text-sm mt-2 drop-shadow">
                  Please wait...
                </p>
              </div>

              {/* Loading spinner */}
              <div className="flex gap-1">
                <div
                  className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"
                  style={{ animationDelay: "0ms" }}></div>
                <div
                  className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"
                  style={{ animationDelay: "150ms" }}></div>
                <div
                  className="w-3 h-3 bg-white rounded-full animate-bounce shadow-lg"
                  style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        </div>
      </Page>
    )
  }

  return (
    <Page back={false}>
      <div className="min-h-screen bg-[#0A0D12] flex flex-col">
        <div className="flex-1 px-4 py-8 flex flex-col justify-center">
          {/* Security Information */}
          <div className="mb-8">
            <div className="bg-[#12151A]/80 backdrop-blur border border-[#25282F] rounded-2xl p-6 mb-6">
              <h2 className="text-white text-lg font-semibold font-['Manrope'] mb-4">
                Security Guidelines
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-gray-300 text-sm font-['Manrope']">
                    Backup your recovery/seed phrase securely.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-gray-300 text-sm font-['Manrope']">
                    Never share your private key or seed phrase.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-gray-300 text-sm font-['Manrope']">
                    Protect your device with PIN/biometrics.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-gray-300 text-sm font-['Manrope']">
                    Do not store backup in cloud or screenshots.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-gray-300 text-sm font-['Manrope']">
                    All transactions are irreversible — double check before
                    sending.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <p className="text-amber-200 text-xs font-['Manrope'] leading-relaxed">
                <strong>Note:</strong> Loss of funds due to negligence is the
                user's responsibility; ZenX Wallet is not liable.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4">
            {!importOpen ? (
              <>
                {/* Create New Wallet button */}
                <button
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold font-['Manrope'] text-base shadow-lg shadow-blue-500/25 active:scale-[0.98] transition-transform"
                  onClick={createNew}
                  disabled={loading}>
                  Create New Wallet
                </button>

                <div className="flex items-center gap-3 px-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#25282F] to-transparent" />
                  <span className="text-neutral-500 text-sm font-['Manrope']">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#25282F] to-transparent" />
                </div>

                {/* Import button */}
                <button
                  className="w-full py-4 px-6 rounded-2xl border border-[#25282F] bg-[#12151A]/50 backdrop-blur text-[#F0F3F7] font-semibold font-['Manrope'] text-base active:scale-[0.98] transition-transform"
                  onClick={() => setImportOpen(true)}>
                  Import Recovery Phrase
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Import input area */}
                <div className="p-4 rounded-2xl border border-[#25282F] bg-[#12151A]">
                  <label className="text-neutral-400 text-sm font-['Manrope'] mb-2 block">
                    Enter your 12-word recovery phrase
                  </label>
                  <textarea
                    className="w-full p-3 rounded-xl bg-zinc-900/50 border border-[#25282F] text-[#F0F3F7] font-['Manrope'] text-sm placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                    rows={4}
                    placeholder="word1 word2 word3..."
                    value={mnemonic}
                    onChange={(e) => setMnemonic(e.target.value)}
                    autoFocus
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <button
                    className="flex-1 py-3 px-4 rounded-xl border border-[#25282F] bg-transparent text-neutral-400 font-medium font-['Manrope'] active:scale-[0.98] transition-transform"
                    onClick={() => {
                      setImportOpen(false)
                      setMnemonic("")
                    }}>
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold font-['Manrope'] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-transform shadow-lg shadow-blue-500/25"
                    onClick={doImport}
                    disabled={loading || !mnemonic.trim()}>
                    Import Wallet
                  </button>
                </div>
              </div>
            )}

            {/* Terms note */}
            <div className="mt-4">
              <p className="text-center text-neutral-500 text-xs font-['Manrope'] leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
}
