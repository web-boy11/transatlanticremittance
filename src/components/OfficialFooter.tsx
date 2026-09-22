import { Shield, Award, Lock, FileText } from 'lucide-react';
import type { OrganizationSettings } from '../config';

type Props = {
  settings: OrganizationSettings;
  onAdminOpen: () => void;
  consoleRevealed: boolean;
};

export default function OfficialFooter({ settings, onAdminOpen, consoleRevealed }: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 w-full border-t border-navy-800 bg-navy-950 pt-10 pb-8 text-xs text-slate-400">
      <div className="mx-auto max-w-6xl space-y-8 px-4">
        {/* Four pillars of transatlantic clearance */}
        <div className="grid grid-cols-1 gap-6 border-b border-navy-850 pb-8 md:grid-cols-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Shield className="size-4 text-blue-400" />
              <span>Immutable On-Chain Ledger</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-400">
              No middle-tier custodial risk. Settlements proceed directly to designated Task Force
              vault addresses verified across public decentralized networks.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Award className="size-4 text-amber-400" />
              <span>FATF &amp; ISO Standards</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-400">
              Compliant with {settings.complianceLevel}. Strict validation of transaction hashes and
              non-repudiation logging.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Lock className="size-4 text-emerald-400" />
              <span>Cryptographic Integrity</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-400">
              Client-side QR generation and direct wallet communication. Zero third-party telemetry
              or payment processor intermediation.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileText className="size-4 text-indigo-400" />
              <span>Bilateral Audit Record</span>
            </div>
            <p className="text-[11.5px] leading-relaxed text-slate-400">
              Case identification{' '}
              <span className="font-mono text-slate-200">{settings.caseReference}</span> is
              permanently registered alongside broadcast proofs.
            </p>
          </div>
        </div>

        {/* Registry line */}
        <div className="flex flex-col items-start justify-between gap-4 font-mono text-[11.5px] text-slate-400 md:flex-row md:items-center">
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">CLEARING REGISTRY</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400">
              <span>
                Directive <span className="text-slate-200">{settings.operationCode}</span>
              </span>
              <span className="text-navy-700">|</span>
              <span>
                Case <span className="text-slate-200">{settings.caseReference}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1 text-left md:text-right">
            <p className="text-slate-500">© {currentYear} {settings.taskForceName}.</p>
            <p className="text-[10px] text-slate-500">
              All Rights Reserved · Joint Maritime Clearing Command
            </p>
          </div>
        </div>

        {/* Watermark disclaimer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-900 pt-4 font-mono text-[10px] text-slate-500">
          <p className="max-w-2xl">{settings.disclaimerNote}</p>

          {/* Hidden unless the private command link has been presented */}
          {consoleRevealed && (
            <button
              type="button"
              onClick={onAdminOpen}
              className="cursor-pointer text-slate-500 transition-colors hover:text-slate-300"
            >
              Authorized Terminal Console
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}
