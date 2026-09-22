import { useEffect, useState } from 'react';
import { ArrowRight, CircleCheck, Info, ShieldCheck, TriangleAlert } from 'lucide-react';
import { cn } from '../utils/cn';
import { isValidTxid } from '../lib/crypto';
import type { Coin } from '../config';
import CoinBadge from './CoinBadge';

type Props = { coin: Coin; onSubmit: (txid: string) => void; disabled?: boolean };

export default function TxidForm({ coin, onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);

  // reset the field whenever the customer switches coins
  useEffect(() => {
    setValue('');
    setTouched(false);
  }, [coin.id]);

  const trimmed = value.trim();
  const valid = isValidTxid(coin, trimmed);
  const showError = touched && trimmed.length > 0 && !valid;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid && !disabled) onSubmit(trimmed);
      }}
    >
      <div className="flex items-center justify-between">
        <label htmlFor="txid" className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
          <CoinBadge coin={coin} size="sm" />
          <span>{coin.symbol} Transaction Hash / TXID</span>
        </label>
        <span className="text-[11px] font-semibold text-slate-400">Step 2 of 3</span>
      </div>

      <div className="relative">
        <input
          id="txid"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setTouched(true);
          }}
          onBlur={() => setTouched(true)}
          spellCheck={false}
          autoComplete="off"
          placeholder={`Paste your outgoing ${coin.symbol} transaction hash`}
          className={cn(
            'w-full rounded-xl border bg-white px-4 py-3.5 pr-11 font-mono text-[13px] text-slate-900 transition placeholder:text-slate-400 focus:ring-3 focus:outline-none shadow-xs',
            showError
              ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
              : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100',
          )}
        />
        {valid && (
          <CircleCheck className="absolute top-1/2 right-4 size-5 -translate-y-1/2 text-emerald-600" />
        )}
      </div>

      {showError ? (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
          <TriangleAlert className="size-3.5 shrink-0" />
          Invalid transaction hash format for {coin.name} ({coin.networkLabel}).
        </p>
      ) : (
        <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-slate-500">
          <Info className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
          <span>
            After sending funds from your wallet, copy the transaction ID (TXID or hash) and submit it here.
            Our system will automatically register and verify your receipt.
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={!valid || disabled}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-display text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
      >
        <ShieldCheck className="size-4" />
        <span>Submit & Verify Payment</span>
        <ArrowRight className="size-4" />
      </button>
    </form>
  );
}
