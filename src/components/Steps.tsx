import { Check } from 'lucide-react';
import { cn } from '../utils/cn';

const LABELS = ['Send crypto', 'Submit TXID', 'Verification'];

type Props = { current: number; done?: boolean };

export default function Steps({ current, done }: Props) {
  return (
    <ol className="flex items-center">
      {LABELS.map((label, i) => {
        const n = i + 1;
        const isDone = Boolean(done) || n < current;
        const isActive = !done && n === current;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[11px] font-semibold transition-colors duration-300',
                  isDone
                    ? 'border-mint bg-mint text-white'
                    : isActive
                      ? 'border-bitcoin bg-bitcoin/10 text-bitcoin'
                      : 'border-line bg-panel-2 text-zinc-500',
                )}
              >
                {isDone ? <Check className="size-3.5" /> : n}
              </span>
              <span
                className={cn(
                  'hidden whitespace-nowrap text-xs font-medium transition-colors duration-300 sm:block',
                  isDone ? 'text-mint' : isActive ? 'text-zinc-800' : 'text-zinc-500',
                )}
              >
                {label}
              </span>
            </div>
            {n < LABELS.length && (
              <span className={cn('mx-2 h-px flex-1 transition-colors duration-300', isDone ? 'bg-mint/50' : 'bg-line')} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
