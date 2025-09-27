/**
 * Wallet Types for ZenX Wallet Frontend
 * 
 * Usage:
 * - Import these types to maintain type safety across wallet components
 * - Use CryptoAsset for individual cryptocurrency holdings
 * - Use WalletData for overall wallet state
 * - Use TransactionType for transaction history
 */

export interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  balanceUSD: number;
  price: number;
  priceChange24h: number;
  icon: string;
  address?: string;
}

export interface WalletData {
  user: {
    name: string;
    username: string;
    avatar?: string;
  };
  totalBalanceUSD: number;
  assets: CryptoAsset[];
  hideZeroBalances: boolean;
}

export interface TransactionType {
  id: string;
  type: 'send' | 'receive' | 'buy';
  asset: string;
  amount: number;
  amountUSD: number;
  timestamp: Date;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
  fromAddress?: string;
  toAddress?: string;
  seen?: boolean; // true if user has seen this transaction in the UI
}

export interface WalletAction {
  id: string;
  label: string;
  icon: string;
  type: 'send' | 'buy' | 'receive';
}
