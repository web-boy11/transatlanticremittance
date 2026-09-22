import { cn } from '../utils/cn';

type Props = {
  color?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const SIZES = {
  sm: 'size-48',
  md: 'size-72',
  lg: 'size-96',
};

/**
 * Animated ambient glow orb — a soft pulsing gradient in a given color.
 * Place behind panels for a premium glass-morphism halo effect.
 */
export default function GlowOrb({ color = '#2563eb', className, size = 'md' }: Props) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute rounded-full blur-3xl animate-glow-pulse',
        SIZES[size],
        className,
      )}
      style={{
        background: `radial-gradient(circle, ${color}30 0%, ${color}10 40%, transparent 70%)`,
      }}
      aria-hidden="true"
    />
  );
}

