import { useEffect, useState } from 'react';
import { Activity, Radio } from 'lucide-react';
import type { Coin } from '../config';
import type { RateResult } from '../lib/crypto';
import { formatUsd } from '../lib/crypto';
import CoinBadge from './CoinBadge';

type Props = {
  coins: Coin[];
  rates: Record<string, RateResult>;
  onSelect?: (id: string) => void;
  selectedId?: string;
};

/** Live spot-rate tape — a continuously scrolling institutional market feed. */
export default function LiveMarketTicker({ coins, rates, onSelect, selectedId }: Props) {
  const [utc, setUtc] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setUtc(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const items = coins.map((c) => ({
    coin: c,
    rate: rates[c.id]?.value ?? c.fallbackRate,
    live: rates[c.id]?.live ?? false,
  }));

  // duplicate the tape so the marquee loops seamlessly
  const tape = [...items, ...items];

  return (
    <div className="w-full border-b border-navy-800 bg-navy-950/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-3">
        {/* Live badge */}
        <span className="flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="hidden sm:inline">Live Feed</span>
          <Activity className="size-3" />
        </span>

        <span className="h-3.5 w-px bg-navy-800 shrink-0" />

        {/* Scrolling tape (pauses on hover) */}
        <div className="relative flex-1 min-w-0 overflow-hidden group">
          <div className="flex items-center gap-6 whitespace-nowrap will-change-transform ticker-tape">
            {tape.map((item, i) => {
              const active = item.coin.id === selectedId;
              return (
                <button
                  key={`${item.coin.id}-${i}`}
                  type="button"
                  onClick={() => onSelect?.(item.coin.id)}
                  title={`Select ${item.coin.symbol}`}
                  className={`flex items-center gap-1.5 text-[11px] font-mono shrink-0 transition-colors cursor-pointer ${
                    active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CoinBadge coin={item.coin} size="sm" className="!size-4" />
                  <span className="font-bold">{item.coin.symbol}</span>
                  <span className="tabular-nums">{formatUsd(item.rate)}</span>
                  <span className={`size-1 rounded-full ${item.live ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
              );
            })}
          </div>
          {/* edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-navy-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-navy-950 to-transparent" />
        </div>

        <span className="h-3.5 w-px bg-navy-800 shrink-0 hidden sm:block" />

        {/* Live UTC clock */}
        <span className="shrink-0 flex items-center gap-1.5 text-[10.5px] font-mono text-slate-400 tabular-nums">
          <Radio className="size-3 text-blue-400" />
          <span className="hidden xs:inline">{utc.toISOString().slice(11, 19)}</span>
          <span className="font-semibold text-slate-300">UTC</span>
        </span>
      </div>
    </div>
  );
}
