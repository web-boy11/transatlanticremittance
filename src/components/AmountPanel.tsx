import { RefreshCw, TrendingUp } from 'lucide-react';
import CoinBadge from './CoinBadge';
import CopyButton from './CopyButton';
import type { Coin } from '../config';
import { formatUsd } from '../lib/crypto';

type Props = {
  coin: Coin;
  amountDisplay: string;
  fiat: number;
  rate: number;
  live: boolean;
  loading: boolean;
  onRefresh: () => void;
};

export default function AmountPanel({
  coin,
  amountDisplay,
  fiat,
  rate,
  live,
  loading,
  onRefresh,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-linear-to-b from-white to-slate-50/70 p-4 sm:p-5 shadow-xs">
      {/* Animated decorative glow based on coin color */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full opacity-15 blur-3xl animate-glow-pulse"
        style={{ backgroundColor: coin.color }}
      />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Amount to Pay
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 shadow-2xs">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: coin.color }} />
          {coin.networkLabel}
        </span>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <CoinBadge coin={coin} size="lg" glow />
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="font-mono text-2xl sm:text-[28px] font-bold tracking-tight text-slate-900 tabular-nums">
                {amountDisplay}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-blue-600">
                {coin.symbol}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Exact total ≈ {formatUsd(fiat)} USD
            </p>
          </div>
        </div>

        <CopyButton
          value={amountDisplay}
          label="Copy"
          className="border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-2xs"
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3 text-xs">
        <span className="inline-flex items-center gap-1 font-medium text-slate-500">
          <TrendingUp className="size-3.5 text-blue-600" />
          <span>Real-time spot rate:</span>
        </span>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-mono font-medium text-slate-700 tabular-nums">
            <span
              className={`size-1.5 rounded-full ${live ? 'bg-emerald-500' : 'bg-amber-500'}`}
              title={live ? 'Live rate from CoinGecko' : 'Using reference fallback rate'}
            />
            1 {coin.symbol} = {formatUsd(rate)}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh exchange rate"
            aria-label="Refresh exchange rate"
            className="grid size-6 place-items-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`size-3 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
