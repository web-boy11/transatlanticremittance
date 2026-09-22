import type { Coin } from '../config';
import { cn } from '../utils/cn';
import { OFFICIAL_CRYPTO_SVGS } from '../lib/cryptoIcons';

type Props = {
  coin: Coin;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
};

const SIZES = {
  sm: 'size-6',
  md: 'size-9',
  lg: 'size-11',
  xl: 'size-13',
};

export default function CoinBadge({ coin, size = 'md', className, glow = false }: Props) {
  const svg = OFFICIAL_CRYPTO_SVGS[coin.id.toLowerCase()];

  if (svg) {
    return (
      <span
        className={cn(
          'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden shadow-xs transition-transform duration-200 select-none',
          SIZES[size],
          glow && 'ring-2 ring-blue-500/20 shadow-[0_4px_12px_rgba(37,99,235,0.15)]',
          className,
        )}
      >
        <span
          className="flex size-full items-center justify-center [&>svg]:size-full [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </span>
    );
  }

  // Fallback if coin icon is somehow missing
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-display font-bold text-white shadow-xs',
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: coin.color }}
    >
      {coin.symbol.slice(0, 4)}
    </span>
  );
}
