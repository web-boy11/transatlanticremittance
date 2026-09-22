import type { Coin } from '../config';
import CoinBadge from './CoinBadge';
import { cn } from '../utils/cn';

type Props = {
  coins: Coin[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

export default function CoinSelector({ coins, selectedId, onSelect, disabled }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          Select Cryptocurrency
        </span>
        <span className="text-[11px] font-medium text-slate-400">
          {coins.length} available
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 px-0.5 no-scrollbar scroll-smooth">
        {coins.map((coin) => {
          const active = coin.id === selectedId;
          return (
            <button
              key={coin.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(coin.id)}
              className={cn(
                'group relative flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-40',
                active
                  ? 'border-blue-600 bg-blue-50/70 shadow-[0_2px_12px_rgba(37,99,235,0.18)] ring-2 ring-blue-500/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 hover:shadow-[0_2px_8px_rgba(37,99,235,0.08)] shadow-2xs',
              )}
            >
              <CoinBadge coin={coin} size="sm" className={cn('transition-transform group-hover:scale-110', active && 'ring-2 ring-blue-400/40')} />
              <div className="flex flex-col text-left">
                <span className={cn('text-xs font-bold leading-none', active ? 'text-blue-900' : 'text-slate-800')}>
                  {coin.symbol}
                </span>
                <span className="text-[10px] font-medium text-slate-400 mt-0.5 leading-none">
                  {coin.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
