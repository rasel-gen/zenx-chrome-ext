/**
 * TransactionHistory Component
 *
 * Usage:
 * - Displays recent transaction history with status indicators
 * - Shows transaction type icons (send, receive, buy)
 * - Includes transaction amounts and timestamps
 * - Links to full transaction history view
 * - Responsive design with clean layout
 *
 * Props:
 * - transactions: Array of recent transactions to display
 * - onTransactionClick?: Callback for transaction selection
 * - onSeeAllClick?: Callback for "See all" button
 * - maxItems?: Maximum number of transactions to show (default: 5)
 */

import { TransactionType } from "@/types/wallet"
import React from "react"

import "./TransactionHistory.css"

import { FIAT_SYMBOLS } from "@/config/fiats"
import { useWalletStore } from "@/stores/wallet"

interface TransactionHistoryProps {
  transactions: TransactionType[]
  onTransactionClick?: (transaction: TransactionType) => void
  onSeeAllClick?: () => void
  maxItems?: number
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onTransactionClick,
  onSeeAllClick,
  maxItems = 5
}) => {
  const displayTransactions = transactions.slice(0, maxItems)
  const baseCurrency = useWalletStore((s) => s.baseCurrency)
  const currencySymbol = FIAT_SYMBOLS[baseCurrency] ?? ""

  const getTransactionIcon = (type: TransactionType["type"]) => {
    switch (type) {
      case "send":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 2L11 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "receive":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 14L12 21L5 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 21V3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case "buy":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M8 12H16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )
      default:
        return null
    }
  }

  // Status chip removed from home transaction history per requirements

  const formatAmount = (amount: number, type: TransactionType["type"]) => {
    const sign = type === "receive" || type === "buy" ? "+" : "-"
    return `${sign}${amount.toFixed(8).replace(/\.?0+$/, "")}`
  }

  const formatAmountUSD = (
    amountUSD: number,
    type: TransactionType["type"]
  ) => {
    const sign = type === "receive" || type === "buy" ? "+" : "-"
    return `${sign}${currencySymbol}${amountUSD.toFixed(2)}`
  }

  const formatDate = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`

    return timestamp.toLocaleDateString()
  }

  if (displayTransactions.length === 0) {
    return (
      <div className="transaction-history">
        <div className="transaction-history__header">
          <h3 className="transaction-history__title">Transaction</h3>
        </div>
        <div className="transaction-history__empty">
          <p>No transactions yet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-history">
      <div className="transaction-history__header">
        <h3 className="transaction-history__title">Transaction</h3>
        {transactions.length > maxItems && (
          <button
            className="transaction-history__see-all"
            onClick={onSeeAllClick}>
            See all
          </button>
        )}
      </div>

      <div className="transaction-history__list">
        {displayTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="transaction-history__item"
            onClick={() => onTransactionClick?.(transaction)}>
            <div className="transaction-history__item-left">
              <div
                className={`transaction-history__icon transaction-history__icon--${transaction.type}`}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="transaction-history__info">
                <div className="transaction-history__type">
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}{" "}
                  {transaction.asset}
                </div>
                <div className="transaction-history__date">
                  {formatDate(transaction.timestamp)}
                </div>
              </div>
            </div>

            <div className="transaction-history__item-right">
              <div
                className={`transaction-history__amount transaction-history__amount--${transaction.type}`}>
                {formatAmount(transaction.amount, transaction.type)}{" "}
                {transaction.asset}
              </div>
              <div className="transaction-history__amount-usd">
                {formatAmountUSD(transaction.amountUSD, transaction.type)}
              </div>
              {/* Status hidden on home transaction history */}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
