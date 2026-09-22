import { useEffect, useState } from 'react';
import { ShieldCheck, Globe, Building2, Lock } from 'lucide-react';
import TransatlanticSeal from './TransatlanticSeal';
import type { OrganizationSettings } from '../config';

type Props = {
  settings: OrganizationSettings;
  onAdminClick: () => void;
  adminActive?: boolean;
  /** console is revealed ONLY after the private command link is used */
  consoleRevealed: boolean;
};

export default function OfficialHeader({
  settings,
  onAdminClick,
  adminActive,
  consoleRevealed,
}: Props) {
  const [utc, setUtc] = useState(() => new Date());

  useEffect(() => {
    const t = window.setInterval(() => setUtc(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-navy-800 bg-navy-950/90 text-white backdrop-blur-md">
      {/* Protocol status rail */}
      <div className="border-b border-navy-800/80 bg-navy-900/90 px-4 py-1.5 text-[11px]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold tracking-wider text-slate-200">
                SETTLEMENT RAIL: ONLINE
              </span>
            </span>
            <span className="hidden text-navy-700 sm:inline">|</span>
            <span className="hidden items-center gap-1 font-mono text-[10.5px] text-slate-400 sm:flex">
              <Globe className="size-3 text-blue-400" />
              <span>EU–US BILATERAL PROTOCOL 2026-X</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10.5px] text-slate-400">
            <span className="hidden rounded border border-navy-700 bg-navy-800/80 px-2 py-0.5 text-slate-300 md:inline">
              CLASS: RESTRICTED OFFICIAL
            </span>
            <span className="hidden tabular-nums sm:inline">{utc.toISOString().slice(11, 19)} UTC</span>

            {/* Only rendered once the private command link has been presented */}
            {consoleRevealed && (
              <button
                type="button"
                onClick={onAdminClick}
                className={`flex cursor-pointer items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[11px] transition ${
                  adminActive
                    ? 'border border-blue-500/40 bg-blue-600/30 text-blue-300 hover:bg-blue-600/50'
                    : 'text-slate-400 hover:bg-navy-800 hover:text-slate-200'
                }`}
                title="Duty Officer Terminal"
              >
                <Lock className="size-3 text-amber-400" />
                <span className="font-semibold">
                  {adminActive ? 'CONSOLE UNLOCKED' : 'DISPATCH CONSOLE'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animated gradient accent line */}
      <div className="header-accent-line" />

      {/* Agency banner */}
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3.5 sm:gap-4.5">
          <TransatlanticSeal size="lg" className="shrink-0 shadow-lg ring-2 ring-gold-500/40" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif-official text-base font-bold tracking-wider text-white uppercase drop-shadow-sm sm:text-xl">
                {settings.taskForceName}
              </span>
              <span className="hidden items-center gap-1 rounded border border-blue-700/60 bg-blue-900/60 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-200 uppercase sm:inline-flex">
                <Building2 className="size-2.5" />
                Intergovernmental Bureau
              </span>
            </div>

            <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-300">
              {settings.subAgency}
            </p>

            <div className="mt-1 flex items-center gap-3 font-mono text-[11px] text-slate-400">
              <span className="font-semibold text-amber-400/90">
                DIRECTIVE: {settings.operationCode}
              </span>
              <span className="hidden text-navy-700 sm:inline">•</span>
              <span className="hidden sm:inline">REF: {settings.caseReference}</span>
            </div>
          </div>
        </div>

        <div className="hidden flex-col items-end border-l border-navy-800 pl-6 text-right lg:flex">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="size-4" />
            <span>AUTHENTICATED DIPLOMATIC CLEARING</span>
          </div>
          <p className="mt-0.5 font-mono text-[11px] text-slate-400">
            Peer-to-Peer Verified On-Chain
          </p>
          <span className="mt-1 inline-block rounded border border-navy-800 bg-navy-900 px-2 py-0.5 font-mono text-[9.5px] text-slate-500">
            NON-CUSTODIAL ESCROW REGISTRY
          </span>
        </div>
      </div>
    </header>
  );
}
