import { motion } from 'framer-motion';
import {
  CircleCheckBig,
  Clock3,
  LoaderCircle,
  RefreshCw,
  SearchX,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { formatAmount, shortHash, type Phase } from '../lib/crypto';
import type { Coin } from '../config';
import CopyButton from './CopyButton';
import CoinBadge from './CoinBadge';

type Props = {
  coin: Coin;
  phase: Phase;
  expectedAmount: number;
  caseReference: string;
  onRetry: () => void;
  onNewTxid: () => void;
};

const iconBox = 'grid size-12 shrink-0 place-items-center rounded-2xl border';

function TxRow({ txid, coin }: { txid: string; coin: Coin }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5">
      <div className="min-w-0">
        <p className="text-[10px] font-bold tracking-[0.14em] text-slate-400 uppercase">
          Submitted {coin.symbol} Transaction Hash
        </p>
        <p className="mt-0.5 truncate font-mono text-xs font-semibold text-slate-700" title={txid}>
          {txid}
        </p>
      </div>
      <CopyButton value={txid} />
    </div>
  );
}

function WarnBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-600" />
      <p className="text-[12px] font-medium leading-relaxed text-amber-800">{text}</p>
    </div>
  );
}

function OkBox({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3">
      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
      <p className="text-[12px] font-semibold leading-relaxed text-emerald-800">{text}</p>
    </div>
  );
}

export default function VerifyPanel({
  coin,
  phase,
  expectedAmount,
  caseReference,
  onRetry,
  onNewTxid,
}: Props) {
  /* 'form' is rendered by the TXID form, never by this panel */
  if (phase.kind === 'form') return null;

  /* ── checking ─────────────────────────────────────────────── */
  if (phase.kind === 'checking') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="flex flex-col items-center rounded-2xl border border-blue-100 bg-blue-50/40 p-6 text-center"
      >
        <div className="relative">
          <CoinBadge coin={coin} size="lg" glow />
          <LoaderCircle className="absolute -right-1 -bottom-1 size-5 animate-spin rounded-full bg-white p-0.5 text-blue-600" />
        </div>
        <p className="mt-4 font-display text-base font-bold text-slate-900">
          Querying {coin.name} Blockchain…
        </p>
        <p className="mt-1 max-w-[290px] text-xs font-medium text-slate-500">
          Interrogating public decentralized nodes to locate and validate your broadcast proof.
        </p>
      </motion.div>
    );
  }

  /* ── not found yet ────────────────────────────────────────── */
  if (phase.kind === 'notfound') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-3.5"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
          <div className={cn(iconBox, 'border-amber-300 bg-amber-100 text-amber-700')}>
            <SearchX className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-slate-900">
              Transaction Not Yet Indexed
            </p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
              The hash is not visible on public {coin.name} explorers yet. If you recently approved it,
              wallets can take 1–3 minutes to propagate. This terminal re-checks automatically every
              30 seconds.
            </p>
          </div>
        </div>

        <TxRow txid={phase.txid} coin={coin} />

        <div className="flex gap-2">
          <button type="button" onClick={onRetry} className="btn-ghost flex-1 font-bold text-slate-700">
            <RefreshCw className="size-3.5 text-blue-600" /> Check Again
          </button>
          <button type="button" onClick={onNewTxid} className="btn-ghost flex-1 font-bold text-slate-700">
            Re-enter TXID
          </button>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400">
          Reference <span className="font-mono text-slate-600">{caseReference}</span> · keep this
          window open or retain your transaction hash.
        </p>
      </motion.div>
    );
  }

  /* ── manual review / unreachable / wrong address ──────────── */
  if (phase.kind === 'review') {
    const wrongAddress = phase.reason === 'wrong-address';
    const manual = phase.reason === 'manual';

    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-3.5"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div
            className={cn(
              iconBox,
              wrongAddress
                ? 'border-red-300 bg-red-100 text-red-600'
                : 'border-blue-200 bg-blue-100 text-blue-700'
            )}
          >
            {wrongAddress ? <TriangleAlert className="size-6" /> : <Clock3 className="size-6" />}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-slate-900">
              {wrongAddress ? 'Destination Address Mismatch' : 'Registered for Manual Clearance'}
            </p>
            {wrongAddress ? (
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
                This transaction output does not match the designated {coin.symbol} vault address{' '}
                <span className="font-mono font-semibold text-slate-900">
                  {shortHash(coin.address, 8, 6)}
                </span>
                . Please confirm you submitted the correct transaction hash.
              </p>
            ) : manual ? (
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
                Your{' '}
                <span className="font-semibold text-slate-800">
                  {coin.name} ({coin.networkLabel})
                </span>{' '}
                broadcast proof has been registered against {caseReference}. This rail is settled by
                the duty comptroller against the vault ledger.
              </p>
            ) : (
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
                The public blockchain explorer interface is temporarily unavailable. Your transaction
                hash has been logged against {caseReference} and will be reconciled at the vault.
              </p>
            )}
          </div>
        </div>

        <TxRow txid={phase.txid} coin={coin} />

        <div className="flex gap-2">
          {wrongAddress ? (
            <button type="button" onClick={onNewTxid} className="btn-ghost flex-1 font-bold">
              Use a Different Hash
            </button>
          ) : !manual ? (
            <button type="button" onClick={onRetry} className="btn-ghost flex-1 font-bold">
              <RefreshCw className="size-3.5" /> Retry Auto-Check
            </button>
          ) : (
            <button type="button" onClick={onNewTxid} className="btn-ghost flex-1 font-bold">
              Submit Another Hash
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  /* ── verifying & confirmed ────────────────────────────────── */
  const { check } = phase;
  const req: number = coin.requiredConfirmations;
  const underpaid =
    check.receivedAmount !== null && check.receivedAmount + 1e-8 < expectedAmount * 0.995;

  if (phase.kind === 'verifying') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="space-y-3.5"
      >
        <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/60 p-4">
          <div className={cn(iconBox, 'border-blue-300 bg-blue-100 text-blue-600')}>
            <LoaderCircle className="size-6 animate-spin" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold text-slate-900">Confirming On-Chain</p>
            <p className="mt-1 text-[12px] font-medium leading-relaxed text-slate-600">
              Broadcast proof located and matched to the designated vault address. Awaiting{' '}
              <span className="font-mono font-bold text-slate-900">{req}</span>{' '}
              {req === 1 ? 'block confirmation' : 'block confirmations'} for final settlement.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500">Block Confirmations</span>
            <span className="font-mono font-bold text-blue-600 tabular-nums">
              {check.confirmations} / {req}
            </span>
          </div>
          <div className="mt-2.5 flex gap-1.5">
            {Array.from({ length: req }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 flex-1 rounded-full transition-colors duration-500',
                  i < check.confirmations ? 'bg-blue-600' : 'bg-slate-200'
                )}
              />
            ))}
          </div>
        </div>

        {underpaid && (
          <WarnBox text="Received amount differs from the quoted amount. This case has been flagged for comptroller review." />
        )}
        {check.receivedAmount !== null && !underpaid && (
          <OkBox
            text={`Transfer located: ${formatAmount(
              check.receivedAmount,
              coin.displayDecimals
            )} ${coin.symbol} received at the vault.`}
          />
        )}

        <TxRow txid={phase.txid} coin={coin} />
        <p className="text-center text-[11px] font-medium text-slate-400">
          Refreshing every 15 seconds. You may keep this window open.
        </p>
      </motion.div>
    );
  }

  /* confirmed */
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-3.5"
    >
      <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <div className="grid size-16 place-items-center rounded-full border-2 border-emerald-300 bg-emerald-100 shadow-sm">
            <CircleCheckBig className="size-9 text-emerald-600" />
          </div>
        </motion.div>
        <p className="mt-3 font-serif-official text-xl font-bold tracking-wide text-navy-950 uppercase">
          Settlement Confirmed
        </p>
        <p className="mt-1 text-xs font-semibold text-slate-600">
          {check.confirmations}+ network confirmations on {coin.name}
          {check.receivedAmount !== null
            ? ` · ${formatAmount(check.receivedAmount, coin.displayDecimals)} ${coin.symbol} received`
            : ''}
        </p>
      </div>

      {underpaid ? (
        <WarnBox text="Received amount differs from the quoted amount — the comptroller will review this case before final release." />
      ) : (
        <OkBox text={`Case ${caseReference} is marked as settled and cleared.`} />
      )}

      <TxRow txid={phase.txid} coin={coin} />
      <p className="text-center text-[11px] font-semibold text-slate-400">
        You may safely retain this receipt and close this window.
      </p>
    </motion.div>
  );
}
