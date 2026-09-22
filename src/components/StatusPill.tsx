import { LoaderCircle } from 'lucide-react';
import type { Phase } from '../lib/crypto';

type Kind = Phase['kind'] | 'expired';

const MAP: Record<Kind, { label: string; cls: string; pulse?: boolean; spin?: boolean }> = {
  form: { label: 'Awaiting Payment', cls: 'border-blue-200 bg-blue-50 text-blue-700', pulse: true },
  checking: { label: 'Verifying On-Chain', cls: 'border-blue-300 bg-blue-100/70 text-blue-800', spin: true },
  notfound: { label: 'Awaiting Broadcast', cls: 'border-amber-300 bg-amber-50 text-amber-800', pulse: true },
  verifying: { label: 'Confirming (1/2)', cls: 'border-indigo-300 bg-indigo-50 text-indigo-700', pulse: true },
  confirmed: { label: 'Verified & Paid', cls: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  review: { label: 'Manual Review', cls: 'border-slate-300 bg-slate-100 text-slate-700', pulse: true },
  expired: { label: 'Window Expired', cls: 'border-red-300 bg-red-50 text-red-700' },
};

export default function StatusPill({ kind }: { kind: Kind }) {
  const s = MAP[kind];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold whitespace-nowrap shadow-2xs ${s.cls}`}
    >
      {s.spin && <LoaderCircle className="size-3 animate-spin" />}
      {s.pulse && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {s.label}
    </span>
  );
}
