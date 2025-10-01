// chain resolution handled by asset.id for accuracy across networks
import { BackButton } from '@/components/BackButton'
import { PasscodePromptModal } from '@/components/PasscodePromptModal/PasscodePromptModal'
import { getMinSendForSymbol } from '@/config/minSend'
import { api, publicApi } from '@/helpers/api'
import { getAssetDisplayName, getSymbolWithNetwork } from '@/helpers/labels'
import { useWalletStore } from '@/stores/wallet'
import { CryptoAsset } from '@/types/wallet'
import sendSuccessIcon from 'data-base64:@assets/public/send-success.png'
import transactionHistoryIcon from 'data-base64:@assets/public/transaction-history.png'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SendAssetSheetProps {
  asset: CryptoAsset
  onClose: () => void
}

export const SendAssetSheet: React.FC<SendAssetSheetProps> = ({
  asset,
  onClose,
}) => {
  const navigate = useNavigate()
  const wallets = useWalletStore((s) => s.wallets)
  const [to, setTo] = useState('')
  const [amt, setAmt] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [success, setSuccess] = useState<{
    txid: string
    from: string
    to: string
    amount: string
    symbol: string
    when: Date
  } | null>(null)
  const [passcodeEnabled, setPasscodeEnabled] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [passError, setPassError] = useState<string | null>(null)
  // Load preferences to know if passcode is enabled
  useEffect(() => {
    ;(async () => {
      try {
        const prefs = await api.preferences()
        setPasscodeEnabled(Boolean((prefs as any)?.passcodeEnabled))
      } catch {}
    })()
  }, [])

  const trxBalance = useMemo(() => {
    try {
      return Number(
        (wallets || []).find((w) => w.chain === 'tron')?.balance ?? 0
      )
    } catch {
      return 0
    }
  }, [wallets])

  const isUSDTTRC20 = useMemo(
    () => asset.id.toLowerCase() === 'usdt-trc20',
    [asset.id]
  )
  const isXrp = useMemo(() => asset.id.toLowerCase() === 'xrp', [asset.id])
  const [xrpInfo, setXrpInfo] = useState<{
    reserveBaseXrp: number
    reserveIncXrp: number
    ownerCount: number
    balanceXrp: number
    minReserveXrp: number
    feeXrp: number
    spendableXrp: number
  } | null>(null)
  useEffect(() => {
    ;(async () => {
      if (!isXrp) return
      try {
        const addr = (wallets || []).find((w) => w.chain === 'xrp')?.address
        const info = await publicApi.xrpInfo(addr)
        setXrpInfo(info as any)
      } catch {
        setXrpInfo(null)
      }
    })()
  }, [isXrp, wallets])

  // Validation logic
  const validation = useMemo(() => {
    const chain = asset.id.toLowerCase() as any
    const amount = parseFloat(amt)
    const hasValidAddress = to.trim().length > 0
    const minRequired = getMinSendForSymbol(asset.symbol)
    const meetsMin =
      amt.length > 0 &&
      !isNaN(amount) &&
      amount >= minRequired &&
      isFinite(amount)
    const hasValidAmount =
      amt.length > 0 && !isNaN(amount) && amount > 0 && isFinite(amount)
    const hasInsufficientBalance = hasValidAmount && amount > asset.balance
    const hasZeroBalance = asset.balance === 0
    const hasInvalidNumber =
      amt.length > 0 && (isNaN(amount) || amount <= 0 || !isFinite(amount))
    const needsTrxForFees = chain === 'usdt-trc20'
    const hasTrxForFees = !needsTrxForFees || trxBalance > 0
    const exceedsSpendable =
      isXrp && xrpInfo ? amount > Number(xrpInfo.spendableXrp || 0) : false

    return {
      isValid:
        hasValidAddress &&
        meetsMin &&
        !hasInsufficientBalance &&
        !hasZeroBalance &&
        hasTrxForFees &&
        !exceedsSpendable,
      hasValidAddress,
      hasValidAmount,
      meetsMin,
      minRequired,
      hasInsufficientBalance,
      hasZeroBalance,
      hasInvalidNumber,
      amount,
      needsTrxForFees,
      hasTrxForFees,
      isXrp,
      exceedsSpendable,
    }
  }, [to, amt, asset.balance, asset.symbol, trxBalance, isXrp, xrpInfo])

  const handleMaxClick = () => {
    if (isXrp && xrpInfo) {
      const max = Math.max(0, Number(xrpInfo.spendableXrp || 0))
      const maxStr = max
        .toFixed(6)
        .replace(/\.0+$/, '')
        .replace(/\.(\d*?)0+$/, '.$1')
      if (max > 0) setAmt(maxStr)
      return
    }
    if (asset.balance > 0) {
      setAmt(asset.balance.toString())
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow empty string
    if (value === '') {
      setAmt(value)
      return
    }

    // Only allow numbers and single decimal point
    // Prevent multiple decimal points and invalid patterns
    if (/^\d*\.?\d*$/.test(value)) {
      // Prevent multiple zeros at start (like 00.1)
      if (value.startsWith('00')) {
        return
      }

      // Prevent starting with decimal point followed by more than 8 decimal places
      const decimalParts = value.split('.')
      if (decimalParts.length === 2 && decimalParts[1].length > 8) {
        return
      }

      setAmt(value)
    }
  }
  if (success) {
    return (
      <div className="fixed inset-0 z-50 bg-zinc-950 overflow-y-auto overscroll-contain">
        {/* Blue glows */}
        <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500 opacity-90" />
        <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

        {/* Header */}
        <div className="w-full px-4 pt-4 flex justify-between items-center">
          <BackButton
            onClick={() => {
              onClose()
              navigate('/dashboard')
            }}
          />
          <div className="text-gray-100 text-sm font-bold">
            Send {getSymbolWithNetwork(asset.symbol)}
          </div>
          <div className="w-12 h-12 p-2.5" />
        </div>

        <div className="w-full px-4 mt-10 pb-24 flex flex-col items-center gap-12">
          <div className="w-40 h-40 relative">
            <img
              src={sendSuccessIcon}
              alt="Send successful"
              className="w-40 h-40 object-contain"
            />
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <div className="text-gray-100 text-2xl font-bold leading-loose">
              Send Successful
            </div>
            <div className="text-neutral-400 text-sm leading-normal">
              You successfully paid {success.amount} {success.symbol}
            </div>
          </div>

          <div className="self-stretch px-4 py-6 bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex flex-col gap-6">
            <div className="self-stretch flex flex-col gap-6">
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  Time
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight">
                  {success.when.toLocaleDateString()}{' '}
                  {success.when.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  To Address
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight max-w-[55%] text-right break-all">
                  {success.to}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  From
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight max-w-[55%] text-right break-all">
                  {success.from}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  TxID
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight max-w-[55%] text-right break-all">
                  {success.txid}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  Payment Method
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight">
                  {getSymbolWithNetwork(success.symbol)}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  Funds Used
                </div>
                <div className="text-gray-100 text-sm font-medium leading-tight">
                  {success.amount} {getSymbolWithNetwork(success.symbol)}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-start">
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  Status
                </div>
                <div className="text-emerald-400 text-sm font-medium leading-tight">
                  Success
                </div>
              </div>
            </div>
          </div>

          <button
            className="w-full h-14 p-3 bg-blue-500 rounded-2xl inline-flex justify-center items-center"
            onClick={() => {
              onClose()
              navigate('/dashboard')
            }}>
            <div className="text-gray-100 text-sm font-bold leading-snug">
              Back to Home
            </div>
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-zinc-950/95 overflow-y-auto overscroll-contain">
        {/* Blue glows */}
        <div className="pointer-events-none fixed right-6 top-10 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-500" />
        <div className="pointer-events-none fixed right-0 top-2 w-20 h-72 rotate-[-36.73deg] blur-3xl bg-blue-300 opacity-50" />

        {/* Header */}
        <div className="w-full px-4 pt-4 flex justify-between items-center">
          <BackButton onClick={onClose} />
          <div className="text-gray-100 text-sm font-bold">
            Send {getSymbolWithNetwork(asset.symbol)}
          </div>
          <div className="w-12 h-12 p-2.5 rounded-[50px]" />
        </div>

        {/* Asset summary card */}
        <div className="px-4 mt-4">
          <div className="w-full p-4 bg-neutral-900 rounded-2xl outline outline-[1.5px] outline-offset-[-1.5px] outline-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src={asset.icon}
                alt={asset.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="inline-flex flex-col items-start gap-2">
                <div className="text-gray-100 text-sm font-semibold leading-snug">
                  {getAssetDisplayName(asset.id, asset.symbol, asset.name)}
                </div>
                <div className="text-neutral-400 text-sm font-medium leading-tight">
                  {asset.balance.toFixed(2)} {asset.symbol}
                </div>
              </div>
            </div>
            <div className="inline-flex flex-col items-end gap-2">
              <div className="text-neutral-400 text-sm font-medium leading-tight">
                Total assets
              </div>
              <div className="text-gray-100 text-sm font-medium leading-snug">
                ${asset.balanceUSD.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="px-4 mt-4">
          <div className="w-full p-4 bg-neutral-900 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 inline-flex flex-col items-start gap-6">
            <div className="w-full flex flex-col items-start gap-6">
              <div className="text-neutral-400 text-sm font-medium leading-tight">
                Send with {asset.name} address
              </div>

              {/* Address */}
              <div className="w-full flex flex-col gap-4">
                <div className="w-full flex flex-col gap-[5px]">
                  <div className="w-full flex flex-col gap-3">
                    <div className="text-gray-100 text-sm font-medium leading-snug">
                      {asset.symbol} Address
                    </div>
                    <div className="w-full inline-flex gap-2">
                      <input
                        className={`flex-1 h-14 px-4 py-3.5 bg-zinc-950 rounded-2xl outline outline-1 outline-offset-[-1px] text-gray-100 placeholder-neutral-500 ${
                          to.length > 0 && !validation.hasValidAddress
                            ? 'outline-red-500'
                            : 'outline-zinc-800 focus:outline-blue-500'
                        }`}
                        placeholder="Paste recipient address"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                      />
                      <button className="w-14 h-14 px-4 py-3.5 bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center">
                        <img
                          src={transactionHistoryIcon}
                          alt="Scan"
                          className="w-6 h-6 opacity-80"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supported network note (USDT TRC20 only) */}
              {isUSDTTRC20 && (
                <div className="w-full -mt-2 mb-2">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-amber-400/10 rounded-lg outline outline-1 outline-offset-[-1px] outline-amber-400/25">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FBBF24"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <span className="text-amber-400 text-xs font-medium leading-tight">
                      Supported network: USDT TRC20 only
                    </span>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="w-full flex flex-col gap-3">
                <div className="text-gray-100 text-sm font-medium leading-snug">
                  Amount
                </div>
                <div
                  className={`w-full h-14 px-4 py-3.5 bg-zinc-950 rounded-2xl outline outline-1 outline-offset-[-1px] flex items-center gap-3 ${
                    validation.hasInvalidNumber ||
                    validation.hasInsufficientBalance
                      ? 'outline-red-500'
                      : 'outline-zinc-800 focus-within:outline-blue-500'
                  }`}>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="[0-9]*\.?[0-9]*"
                    className="min-w-0 bg-transparent text-gray-100 text-sm font-bold leading-snug flex-1 outline-none"
                    placeholder="0.00"
                    value={amt}
                    onChange={handleAmountChange}
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <div className="text-neutral-400 text-sm font-medium leading-snug">
                    {asset.symbol}
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 bg-neutral-800 rounded-lg flex justify-center items-center disabled:opacity-50 hover:bg-neutral-700 transition-colors text-sm font-medium text-gray-100 flex-shrink-0 min-w-0"
                    onClick={handleMaxClick}
                    disabled={asset.balance === 0}>
                    Max
                  </button>
                </div>
              </div>
            </div>

            {/* Validation Messages */}
            <div className="w-full">
              {validation.hasZeroBalance && (
                <div className="w-full text-red-400 text-sm">
                  No balance available to send
                </div>
              )}
              {!validation.hasValidAddress && to.length > 0 && (
                <div className="w-full text-red-400 text-sm">
                  Please enter a valid recipient address
                </div>
              )}
              {validation.hasInvalidNumber && (
                <div className="w-full text-red-400 text-sm">
                  Please enter a valid number greater than 0
                </div>
              )}
              {validation.hasInsufficientBalance && (
                <div className="w-full text-red-400 text-sm">
                  Insufficient balance. Available: {asset.balance.toFixed(6)}{' '}
                  {asset.symbol}
                </div>
              )}
              {!validation.meetsMin && amt.length > 0 && (
                <div className="w-full text-red-400 text-sm">
                  Minimum send is {validation.minRequired} {asset.symbol}
                </div>
              )}
              {validation.needsTrxForFees && !validation.hasTrxForFees && (
                <div className="w-full text-red-400 text-sm">
                  TRX balance required to pay network fees for USDT (TRC20).
                  Current TRX: {trxBalance.toFixed(6)}
                </div>
              )}
              {isXrp && xrpInfo && (
                <div className="w-full text-amber-400 text-sm">
                  Reserve: {xrpInfo.minReserveXrp.toFixed(6)} XRP • Spendable:{' '}
                  {xrpInfo.spendableXrp.toFixed(6)} XRP
                </div>
              )}
              {isXrp && xrpInfo && validation.exceedsSpendable && (
                <div className="w-full text-red-400 text-sm">
                  Maximum spendable is {xrpInfo.spendableXrp.toFixed(6)} XRP
                </div>
              )}
              {err && <div className="w-full text-red-400 text-sm">{err}</div>}
              {ok && <div className="w-full text-green-400 text-sm">{ok}</div>}
            </div>

            {/* Buttons */}
            <div className="w-full mt-6 inline-flex gap-2 justify-between items-center">
              <button
                className="w-44 h-14 p-3 bg-neutral-800 rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-800 flex justify-center items-center"
                onClick={onClose}>
                <div className="text-neutral-400 text-sm font-medium leading-normal">
                  Cancel
                </div>
              </button>
              <button
                className="w-44 h-14 p-3 bg-blue-500 rounded-2xl flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                disabled={busy || !validation.isValid}
                onClick={async () => {
                  if (busy) return
                  setErr(null)
                  setOk(null)
                  setBusy(true)
                  try {
                    const chain = asset.id.toLowerCase() as any
                    const cleanedTo = to.replace(/\s+/g, '').trim()
                    if (passcodeEnabled) {
                      setPassError(null)
                      setShowPassModal(true)
                      setBusy(false)
                      return
                    }
                    const res = await useWalletStore.getState().sendTransfer({
                      chain,
                      toAddress: cleanedTo,
                      amount: amt.trim(),
                    })
                    const txid = (res as any)?.txid || ''
                    const from = (res as any)?.from || ''
                    setOk(`Sent: ${txid || 'Transaction submitted'}`)
                    setSuccess({
                      txid,
                      from,
                      to,
                      amount: amt,
                      symbol: asset.symbol,
                      when: new Date(),
                    })
                  } catch (e: any) {
                    setErr(e?.message || 'Failed to send')
                  } finally {
                    setBusy(false)
                  }
                }}>
                <div className="text-gray-100 text-sm font-bold leading-snug">
                  {busy ? 'Sending...' : 'Send Now'}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPassModal && (
        <PasscodePromptModal
          mode="verify"
          onCancel={() => {
            setShowPassModal(false)
            setPassError(null)
          }}
          errorText={passError || undefined}
          onSubmit={async ({ currentPasscode }) => {
            try {
              setBusy(true)
              const chain = asset.id.toLowerCase() as any
              const cleanedTo = to.replace(/\s+/g, '').trim()
              const res = await useWalletStore.getState().sendTransfer({
                chain,
                toAddress: cleanedTo,
                amount: amt.trim(),
                passcode: currentPasscode,
              })
              const txid = (res as any)?.txid || ''
              const from = (res as any)?.from || ''
              setOk(`Sent: ${txid || 'Transaction submitted'}`)
              setSuccess({
                txid,
                from,
                to,
                amount: amt,
                symbol: asset.symbol,
                when: new Date(),
              })
              setShowPassModal(false)
              setPassError(null)
            } catch (e: any) {
              setPassError(String(e?.message || 'Invalid passcode'))
            } finally {
              setBusy(false)
            }
          }}
        />
      )}
    </>
  )
}
