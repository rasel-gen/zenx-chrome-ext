import { getFiatIconOrFallback } from "@/config/fiats"
import type { LucideIcon } from "lucide-react"
import {
  DollarSign,
  Euro,
  IndianRupee,
  JapaneseYen,
  PoundSterling,
  RussianRuble,
  SwissFranc,
  TurkishLira
} from "lucide-react"
import React from "react"

type Props = {
  code: string
  size?: number // pixel size for icon circle area width/height
  className?: string
}

const CODE_TO_LUCIDE: Record<string, LucideIcon> = {
  USD: DollarSign,
  EUR: Euro,
  GBP: PoundSterling,
  JPY: JapaneseYen,
  INR: IndianRupee,
  RUB: RussianRuble,
  CHF: SwissFranc,
  TRY: TurkishLira,
  // Map CNY visually to Yen icon as both use "¥"
  CNY: JapaneseYen
  // Fallback examples for less common codes could be mapped to generic icons if desired
}

export const CurrencyBadge: React.FC<Props> = ({
  code,
  size = 24,
  className
}) => {
  const fallback = getFiatIconOrFallback(code)
  const Icon = CODE_TO_LUCIDE[code]

  return (
    <div
      className={`rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden ${className || ""}`}
      style={{ width: size, height: size }}>
      {fallback.type === "icon" ? (
        <img
          src={fallback.value}
          alt={`${code} icon`}
          style={{ width: size, height: size }}
          className="object-cover"
        />
      ) : Icon ? (
        <Icon
          size={Math.max(12, Math.floor(size * 0.7))}
          className="text-gray-200"
        />
      ) : (
        <span
          className="text-gray-200 font-bold"
          style={{ fontSize: Math.max(9, Math.floor(size * 0.35)) }}>
          {fallback.value}
        </span>
      )}
    </div>
  )
}

export default CurrencyBadge
