import { useEffect, useRef, useState } from 'react';
import { Wifi, Cpu, Layers } from 'lucide-react';
import type { Coin } from '../config';
import { cn } from '../utils/cn';

type Props = { coin: Coin };

const BARS = 28;

/**
 * Live network monitor strip — animated activity bars plus a self-updating
 * settlement-ledger index, giving the terminal a real "online now" feel.
 */
export default function LiveNetworkPulse({ coin }: Props) {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BARS }, () => 0.25 + Math.random() * 0.5)
  );
  const [latency, setLatency] = useState(38);
  const [sweep, setSweep] = useState(0);
  const startRef = useRef(Date.now());

  // animate activity bars
  useEffect(() => {
    const t = window.setInterval(() => {
      setBars((prev) => {
        const next = prev.slice(1);
        next.push(0.18 + Math.random() * 0.82);
        return next;
      });
    }, 420);
    return () => window.clearInterval(t);
  }, []);

  // flickering rail latency reading
  useEffect(() => {
    const t = window.setInterval(() => {
      setLatency(24 + Math.floor(Math.random() * 40));
    }, 2600);
    return () => window.clearInterval(t);
  }, []);

  // horizontal scan sweep
  useEffect(() => {
    const t = window.setInterval(() => setSweep((s) => (s + 1) % 100), 60);
    return () => window.clearInterval(t);
  }, []);

  // ledger index: advances believably with elapsed time
  const ledgerIndex = 842_100 + Math.floor((Date.now() - startRef.current) / 900);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-800 glass-dark p-3.5 text-white">
      {/* sweeping scanner line with glow */}
      <div
        className="pointer-events-none absolute inset-y-0 w-20 bg-linear-to-r from-transparent via-blue-500/15 to-transparent"
        style={{ left: `${sweep}%`, filter: 'blur(1px)' }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[10.5px] font-mono font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="size-3 text-emerald-400" />
            <span className="text-emerald-400">Rail Live</span>
          </span>
          <span className="text-navy-700">/</span>
          <span className="hidden sm:inline">{coin.symbol} Monitor</span>
        </div>

        <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Cpu className="size-3 text-blue-400" />
            <span className="tabular-nums text-slate-300">{latency}ms</span>
          </span>
          <span className="flex items-center gap-1">
            <Layers className="size-3 text-gold-500" />
            <span className="tabular-nums text-slate-300">#{ledgerIndex.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* animated activity histogram with gradient bars and glow */}
      <div className="relative mt-2.5 flex h-8 items-end gap-[3px]">
        {bars.map((v, i) => (
          <span
            key={i}
            className={cn(
              'flex-1 rounded-sm transition-all duration-300 ease-out animate-bar-glow',
              v > 0.72
                ? 'bg-linear-to-t from-gold-600 to-gold-400'
                : v > 0.45
                  ? 'bg-linear-to-t from-blue-700 to-blue-400'
                  : 'bg-blue-500/30'
            )}
            style={{
              height: `${Math.max(12, v * 100)}%`,
              animationDelay: `${i * 70}ms`,
            }}
          />
        ))}
      </div>

      <div className="relative mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LISTENING FOR BROADCAST PROOFS
        </span>
        <span>LEDGER SYNC · CONTINUOUS</span>
      </div>
    </div>
  );
}
