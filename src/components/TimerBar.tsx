import { Hourglass } from 'lucide-react';
import { cn } from '../utils/cn';

type Props = { remainingMs: number; totalMs: number };

export default function TimerBar({ remainingMs, totalMs }: Props) {
  const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
  const danger = remainingMs <= 180_000;
  const mm = Math.floor(Math.max(0, remainingMs) / 60_000);
  const ss = Math.floor((Math.max(0, remainingMs) % 60_000) / 1000);

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
          <Hourglass className="size-3.5" />
          Payment window
        </span>
        <span
          className={cn(
            'font-mono text-xs font-semibold tabular-nums',
            danger ? 'animate-pulse text-danger' : 'text-zinc-700',
          )}
        >
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={cn(
            'h-full rounded-full relative',
            danger
              ? 'bg-linear-to-r from-danger to-red-500'
              : 'bg-linear-to-r from-bitcoin-deep to-blue-500',
          )}
          style={{ width: `${pct}%`, transition: 'width 1s linear' }}
        >
          {/* Glowing edge at progress head */}
          <span
            className={cn(
              'absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full',
              danger ? 'bg-danger' : 'bg-blue-400',
            )}
            style={{ animation: 'progress-glow 2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </div>
  );
}
