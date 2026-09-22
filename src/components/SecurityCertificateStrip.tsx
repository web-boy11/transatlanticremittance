import { Shield, CheckCircle2 } from 'lucide-react';
import type { OrganizationSettings, Coin } from '../config';
import { formatUsd } from '../lib/crypto';
import TransatlanticSeal from './TransatlanticSeal';

type Props = {
  settings: OrganizationSettings;
  activeCoin: Coin;
  amountDisplay: string;
};

export default function SecurityCertificateStrip({ settings, activeCoin, amountDisplay }: Props) {
  return (
    <div className="rounded-2xl border border-navy-800 glass-dark text-white p-4 sm:p-5 shadow-lg relative overflow-hidden shimmer-overlay">
      {/* Background Watermark Seal */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-10">
        <TransatlanticSeal size="xl" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-400 border border-gold-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase">
              <Shield className="size-3" /> OFFICIAL CLEARANCE NOTICE
            </span>
            <span className="text-slate-400 font-mono text-xs">· {settings.caseReference}</span>
          </div>

          <h2 className="font-serif-official text-base sm:text-lg font-bold text-slate-100 tracking-wide uppercase">
            {settings.operationCode}
          </h2>

          <p className="text-xs text-slate-300 font-medium">
            Settlement Bureau: <span className="text-white">{settings.subAgency}</span>
          </p>
        </div>

        {/* Invoice Amount summary block */}
        <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-navy-800 pt-3 sm:pt-0 sm:pl-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
            Assessment Due
          </span>
          <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5">
            <span className="font-mono text-2xl font-bold text-white tracking-tight tabular-nums">
              {formatUsd(settings.fiatAmount)}
            </span>
            <span className="font-mono text-xs font-semibold text-blue-400">USD</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center sm:justify-end gap-1 mt-0.5">
            <CheckCircle2 className="size-3" />
            <span>≈ {amountDisplay} {activeCoin.symbol}</span>
          </span>
        </div>
      </div>

      {/* Security Verification Bar */}
      <div className="mt-4 pt-3 border-t border-navy-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>VAULT PROTOCOL: DIRECT MUTUAL CLEARANCE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">
            DIRECTIVE <span className="text-slate-200">{settings.operationCode}</span>
          </span>
          <span className="hidden text-navy-700 sm:inline">|</span>
          <span className="font-semibold text-blue-300">{settings.complianceLevel}</span>
        </div>
      </div>
    </div>
  );
}
