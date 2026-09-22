import type { Coin } from '../config';

/* ── formatting helpers ─────────────────────────────────────────── */

export const formatUsd = (n: number): string =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });

export const formatAmount = (n: number, decimals: number): string => n.toFixed(decimals);

export const shortHash = (s: string, head = 10, tail = 8): string =>
  s.length <= head + tail + 1 ? s : `${s.slice(0, head)}…${s.slice(-tail)}`;

export const isValidTxid = (coin: Coin, txid: string): boolean => coin.txidPattern.test(txid.trim());

/** QR / wallet-deeplink payload for a given coin + amount */
export const buildPaymentUri = (coin: Coin, amount: number): string => {
  switch (coin.uriScheme) {
    case 'bitcoin':
    case 'litecoin':
    case 'dogecoin':
    case 'bitcoincash':
      return `${coin.uriScheme}:${coin.address}?amount=${amount.toFixed(8)}`;
    case 'ethereum':
      return `ethereum:${coin.address}?value=${Math.round(amount * 1e18)}`;
    default:
      return coin.address;
  }
};

/* ── live exchange rates (single batched request) ───────────────── */

export type RateResult = { value: number; live: boolean };

export async function fetchRates(coins: Coin[]): Promise<Record<string, RateResult>> {
  const ids = coins.map((c) => c.coingeckoId).join(',');
  const fallback: Record<string, RateResult> = {};
  for (const c of coins) fallback[c.id] = { value: c.fallbackRate, live: false };

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(ids)}&vs_currencies=usd`,
      { cache: 'no-store' },
    );
    if (!res.ok) throw new Error('rate unavailable');
    const json = await res.json();
    const out: Record<string, RateResult> = {};
    for (const c of coins) {
      const v = json?.[c.coingeckoId]?.usd;
      out[c.id] = Number.isFinite(v) && v > 0 ? { value: v, live: true } : { value: c.fallbackRate, live: false };
    }
    return out;
  } catch {
    return fallback;
  }
}

/* ── on-chain transaction verification ──────────────────────────── */

export type CheckResult = {
  found: boolean;
  confirmations: number;
  matchedAddress: boolean;
  receivedAmount: number | null;
  confirmed: boolean;
};

const NOT_FOUND: CheckResult = {
  found: false,
  confirmations: 0,
  matchedAddress: false,
  receivedAmount: null,
  confirmed: false,
};

function sameAddress(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/** Bitcoin: Blockstream.info primary, Blockchair fallback */
async function lookupBitcoin(txid: string, coin: Coin): Promise<CheckResult | null> {
  try {
    const res = await fetch(`https://blockstream.info/api/tx/${txid}`);
    if (res.status === 404 || res.status === 400) return NOT_FOUND;
    if (!res.ok) throw new Error('explorer error');
    const tx = await res.json();

    let confirmations = 0;
    try {
      const tipRes = await fetch('https://blockstream.info/api/blocks/tip/height');
      const tip = parseInt((await tipRes.text()).trim(), 10);
      if (tx.status?.confirmed && Number.isFinite(tip)) {
        confirmations = Math.max(1, tip - tx.status.block_height + 1);
      }
    } catch {
      /* keep 0 confirmations */
    }

    const outs: Array<{ value?: number; scriptpubkey_address?: string }> = Array.isArray(tx.vout) ? tx.vout : [];
    const match = outs.find((o) => o.scriptpubkey_address && sameAddress(o.scriptpubkey_address, coin.address));
    return {
      found: true,
      confirmations,
      matchedAddress: Boolean(match),
      receivedAmount: match && typeof match.value === 'number' ? match.value / 1e8 : null,
      confirmed: confirmations >= coin.requiredConfirmations,
    };
  } catch {
    return lookupBlockchairUtxo(txid, coin, 'bitcoin');
  }
}

/** UTXO chains via Blockchair (Litecoin, Dogecoin, Bitcoin Cash, Bitcoin fallback) */
async function lookupBlockchairUtxo(txid: string, coin: Coin, slugOverride?: string): Promise<CheckResult | null> {
  const slug = slugOverride ?? coin.blockchairSlug;
  if (!slug) return null;
  try {
    const res = await fetch(`https://api.blockchair.com/${slug}/dashboards/transaction/${txid}`);
    if (!res.ok) return NOT_FOUND;
    const json = await res.json();
    const entry = json?.data?.[txid];
    if (!entry) return NOT_FOUND;

    const blockId: number = entry.transaction?.block_id ?? -1;
    const tip: number = json?.context?.state ?? -1;
    const confirmations = blockId > 0 && tip > 0 ? Math.max(0, tip - blockId + 1) : 0;

    const outs: Array<{ recipient?: string; value?: number }> = Array.isArray(entry.outputs) ? entry.outputs : [];
    const match = outs.find((o) => o.recipient && sameAddress(o.recipient, coin.address));

    return {
      found: true,
      confirmations,
      matchedAddress: Boolean(match),
      receivedAmount: match && typeof match.value === 'number' ? match.value / 1e8 : null,
      confirmed: confirmations >= coin.requiredConfirmations,
    };
  } catch {
    return null;
  }
}

/** Account-based chains via Blockchair (Ethereum) */
async function lookupBlockchairEth(txid: string, coin: Coin): Promise<CheckResult | null> {
  const slug = coin.blockchairSlug ?? 'ethereum';
  try {
    const res = await fetch(`https://api.blockchair.com/${slug}/dashboards/transaction/${txid}`);
    if (!res.ok) return NOT_FOUND;
    const json = await res.json();
    const entry = json?.data?.[txid];
    if (!entry) return NOT_FOUND;

    const tx = entry.transaction ?? {};
    const blockId: number = tx.block_id ?? -1;
    const tip: number = json?.context?.state ?? -1;
    const confirmations = blockId > 0 && tip > 0 ? Math.max(0, tip - blockId + 1) : 0;

    const recipient: string | undefined = tx.recipient;
    const matchedAddress = Boolean(recipient && sameAddress(recipient, coin.address));
    const rawValue = tx.value;
    const receivedAmount =
      matchedAddress && (typeof rawValue === 'number' || typeof rawValue === 'string')
        ? Number(rawValue) / 1e18
        : null;

    return {
      found: true,
      confirmations,
      matchedAddress,
      receivedAmount,
      confirmed: confirmations >= coin.requiredConfirmations,
    };
  } catch {
    return null;
  }
}

/**
 * Look up a transaction for the given coin. Returns `null` only when
 * the relevant public explorer(s) are unreachable (→ manual review).
 * Coins configured with `verify: 'manual'` should never reach here —
 * the caller routes those straight to manual review.
 */
export async function lookupTx(coin: Coin, txid: string): Promise<CheckResult | null> {
  switch (coin.verify) {
    case 'bitcoin':
      return lookupBitcoin(txid, coin);
    case 'blockchair-utxo':
      return lookupBlockchairUtxo(txid, coin);
    case 'blockchair-eth':
      return lookupBlockchairEth(txid, coin);
    default:
      return null;
  }
}

/* ── payment state machine ──────────────────────────────────────── */

export type Phase =
  | { kind: 'form' }
  | { kind: 'checking'; txid: string }
  | { kind: 'notfound'; txid: string }
  | { kind: 'verifying'; txid: string; check: CheckResult }
  | { kind: 'confirmed'; txid: string; check: CheckResult }
  | { kind: 'review'; txid: string; reason: 'unreachable' | 'wrong-address' | 'manual' };
