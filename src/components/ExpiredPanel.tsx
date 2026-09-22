import { motion } from 'framer-motion';
import { TimerOff, RotateCw } from 'lucide-react';

type Props = {
  submitted: boolean;
  windowMinutes: number;
  onRestart: () => void;
};

export default function ExpiredPanel({ submitted, windowMinutes, onRestart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col items-center rounded-2xl border border-rose-200 bg-rose-50/60 px-5 py-6 text-center"
    >
      <div className="grid size-14 place-items-center rounded-full border border-rose-300 bg-rose-100">
        <TimerOff className="size-7 text-rose-600" />
      </div>

      <p className="mt-4 font-serif-official text-lg font-bold tracking-wide text-navy-950 uppercase">
        Clearance Window Expired
      </p>

      <p className="mx-auto mt-1.5 max-w-[320px] text-[13px] leading-relaxed text-slate-600">
        For security and rate integrity, settlement requests expire after {windowMinutes} minutes and
        the exchange rate is re-quoted.
      </p>

      {submitted && (
        <p className="mx-auto mt-3 max-w-[320px] rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] font-medium leading-relaxed text-amber-900">
          Already broadcast a transfer? Keep your transaction hash — a fresh request will re-verify it
          automatically.
        </p>
      )}

      <button
        type="button"
        onClick={onRestart}
        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-navy-900 py-3.5 font-display text-sm font-bold text-white shadow-md transition hover:bg-navy-800"
      >
        <RotateCw className="size-4" />
        <span>Issue New Clearance Request</span>
      </button>
    </motion.div>
  );
}
