/**
 * ─────────────────────────────────────────────────────────────────
 * TRANSATLANTIC TASK FORCE (TATF) — FINANCIAL SETTLEMENT GATEWAY
 * Intergovernmental Maritime & Defense Financial Clearing Bureau
 * ─────────────────────────────────────────────────────────────────
 */

export type VerifyMode = 'bitcoin' | 'blockchair-utxo' | 'blockchair-eth' | 'manual';

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  networkLabel: string;
  address: string;
  color: string;
  coingeckoId: string;
  fallbackRate: number;
  displayDecimals: number;
  txidPattern: RegExp;
  uriScheme?: string;
  verify: VerifyMode;
  blockchairSlug?: string;
  requiredConfirmations: number;
  enabled: boolean;
};

const HEX64 = /^[0-9a-fA-F]{64}$/;
const HEX64_0X = /^0x[0-9a-fA-F]{64}$/;
const BASE58_SIG = /^[1-9A-HJ-NP-Za-km-z]{60,90}$/;

export const DEFAULT_COINS: Coin[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    networkLabel: 'Bitcoin Core Network',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    color: '#F7931A',
    coingeckoId: 'bitcoin',
    fallbackRate: 98_500,
    displayDecimals: 8,
    txidPattern: HEX64,
    uriScheme: 'bitcoin',
    verify: 'bitcoin',
    requiredConfirmations: 2,
    enabled: true,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    networkLabel: 'ERC-20 Mainnet Protocol',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976',
    color: '#627EEA',
    coingeckoId: 'ethereum',
    fallbackRate: 3_250,
    displayDecimals: 6,
    txidPattern: HEX64_0X,
    uriScheme: 'ethereum',
    verify: 'blockchair-eth',
    blockchairSlug: 'ethereum',
    requiredConfirmations: 12,
    enabled: true,
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    networkLabel: 'TRC-20 Clearing Rail',
    address: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
    color: '#26A17B',
    coingeckoId: 'tether',
    fallbackRate: 1,
    displayDecimals: 2,
    txidPattern: HEX64,
    verify: 'manual',
    requiredConfirmations: 20,
    enabled: true,
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    networkLabel: 'Solana Cluster Network',
    address: '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1',
    color: '#9945FF',
    coingeckoId: 'solana',
    fallbackRate: 155,
    displayDecimals: 4,
    txidPattern: BASE58_SIG,
    verify: 'manual',
    requiredConfirmations: 32,
    enabled: true,
  },
  {
    id: 'ltc',
    name: 'Litecoin',
    symbol: 'LTC',
    networkLabel: 'Litecoin Core Rail',
    address: 'ltc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080',
    color: '#345D9D',
    coingeckoId: 'litecoin',
    fallbackRate: 92,
    displayDecimals: 8,
    txidPattern: HEX64,
    uriScheme: 'litecoin',
    verify: 'blockchair-utxo',
    blockchairSlug: 'litecoin',
    requiredConfirmations: 6,
    enabled: true,
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    networkLabel: 'BEP-20 Smart Clearing',
    address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E',
    color: '#F3BA2F',
    coingeckoId: 'binancecoin',
    fallbackRate: 610,
    displayDecimals: 5,
    txidPattern: HEX64_0X,
    verify: 'manual',
    requiredConfirmations: 15,
    enabled: true,
  },
  {
    id: 'xrp',
    name: 'XRP Ledger',
    symbol: 'XRP',
    networkLabel: 'Ripple Net Ledger',
    address: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
    color: '#23292F',
    coingeckoId: 'ripple',
    fallbackRate: 2.15,
    displayDecimals: 4,
    txidPattern: HEX64,
    verify: 'manual',
    requiredConfirmations: 4,
    enabled: true,
  },
  {
    id: 'bch',
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    networkLabel: 'Bitcoin Cash Protocol',
    address: 'qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy',
    color: '#8DC351',
    coingeckoId: 'bitcoin-cash',
    fallbackRate: 440,
    displayDecimals: 8,
    txidPattern: HEX64,
    uriScheme: 'bitcoincash',
    verify: 'blockchair-utxo',
    blockchairSlug: 'bitcoin-cash',
    requiredConfirmations: 3,
    enabled: true,
  },
  {
    id: 'doge',
    name: 'Dogecoin',
    symbol: 'DOGE',
    networkLabel: 'Dogecoin Ledger',
    address: 'DH5yaieqoZN36fDVciNyRueRGvGLR3mr7L',
    color: '#C2A633',
    coingeckoId: 'dogecoin',
    fallbackRate: 0.28,
    displayDecimals: 4,
    txidPattern: HEX64,
    uriScheme: 'dogecoin',
    verify: 'blockchair-utxo',
    blockchairSlug: 'dogecoin',
    requiredConfirmations: 10,
    enabled: true,
  },
  {
    id: 'trx',
    name: 'TRON Protocol',
    symbol: 'TRX',
    networkLabel: 'Tron Network',
    address: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
    color: '#EF0027',
    coingeckoId: 'tron',
    fallbackRate: 0.16,
    displayDecimals: 2,
    txidPattern: HEX64,
    verify: 'manual',
    requiredConfirmations: 20,
    enabled: true,
  },
];

// Re-export as COINS for backward compatibility
export const COINS = DEFAULT_COINS;

export interface OrganizationSettings {
  taskForceName: string;
  subAgency: string;
  caseReference: string;
  operationCode: string;
  fiatAmount: number;
  fiatCurrency: string;
  windowMinutes: number;
  disclaimerNote: string;
  complianceLevel: string;
}

export const DEFAULT_ORG_SETTINGS: OrganizationSettings = {
  taskForceName: 'Transatlantic Joint Task Force',
  subAgency: 'Bureau of International Maritime & Strategic Settlement',
  caseReference: 'TATF-SEC-2026/894-B',
  operationCode: 'OP-ATLANTIC-SENTINEL',
  fiatAmount: 4850.0,
  fiatCurrency: 'USD',
  windowMinutes: 30,
  disclaimerNote:
    'Official intergovernmental clearing window. Transactions are logged under bilateral mutual audit protocols.',
  complianceLevel: 'FATF Tier-1 / ISO-20022 Non-Custodial Direct Settle',
};

export const ADMIN_PASSCODE = 'taskforce-admin-2026';

/**
 * Private command link slug. The dispatch console stays invisible to
 * ordinary visitors — it is only revealed when this key is presented:
 *
 *   https://your-site.com/#admin          (short form also works)
 *   https://your-site.com/?admin=tatf-command
 */
export const ADMIN_LINK_KEY = 'tatf-command';
