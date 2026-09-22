import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Shield,
  Lock,
  KeyRound,
  Sliders,
  DollarSign,
  History,
  Save,
  RotateCcw,
  CheckCircle2,
  X,
  LogOut,
  Building2,
  AlertTriangle,
  ClipboardCopy,
  HelpCircle,
  Clock,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import type { Coin, OrganizationSettings } from '../config';
import { ADMIN_PASSCODE } from '../config';
import {
  saveCoinRegistry,
  saveOrgSettings,
  resetToDefaults,
  getAuditLogs,
  recordAuditLog,
  setAdminAuthenticated,
  isAdminAuthenticated,
  type AuditRecord,
} from '../lib/taskforceStore';
import CoinBadge from './CoinBadge';

type Props = {
  open: boolean;
  onClose: () => void;
  coins: Coin[];
  orgSettings: OrganizationSettings;
  onCoinsUpdated: (coins: Coin[]) => void;
  onOrgSettingsUpdated: (settings: OrganizationSettings) => void;
  onSignOut: () => void;
};

type Tab = 'DIRECTIVE' | 'WALLETS' | 'AUDIT' | 'CODE_EXPORT';

export default function AuthenticAdminModal({
  open,
  onClose,
  coins,
  orgSettings,
  onCoinsUpdated,
  onOrgSettingsUpdated,
  onSignOut,
}: Props) {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('DIRECTIVE');

  // Working drafts
  const [draftOrg, setDraftOrg] = useState<OrganizationSettings>(orgSettings);
  const [draftCoins, setDraftCoins] = useState<Coin[]>(coins);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);

  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (open) {
      setAuthed(isAdminAuthenticated());
      setPasscode('');
      setAuthError(false);
      setDraftOrg(orgSettings);
      setDraftCoins(coins);
      setAuditLogs(getAuditLogs());
    }
  }, [open, orgSettings, coins]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE.trim()) {
      setAuthed(true);
      setAdminAuthenticated(true);
      setAuthError(false);
      setAuditLogs(getAuditLogs());
    } else {
      setAuthError(true);
    }
  };

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    saveOrgSettings(draftOrg);
    onOrgSettingsUpdated(draftOrg);
    setSavedBanner('Task Force Directive & Operational Parameters Successfully Updated');
    setAuditLogs(getAuditLogs());
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleSaveCoins = () => {
    saveCoinRegistry(draftCoins);
    onCoinsUpdated(draftCoins);
    setSavedBanner('Cryptocurrency Clearing Rails & Custodial Addresses Saved');
    setAuditLogs(getAuditLogs());
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleToggleCoin = (id: string) => {
    setDraftCoins((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleUpdateCoinAddress = (id: string, address: string) => {
    setDraftCoins((prev) =>
      prev.map((c) => (c.id === id ? { ...c, address: address.trim() } : c))
    );
  };

  const handleUpdateCoinConfirmations = (id: string, req: number) => {
    setDraftCoins((prev) =>
      prev.map((c) => (c.id === id ? { ...c, requiredConfirmations: Math.max(1, req) } : c))
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset all Task Force directive parameters and crypto addresses to official defaults?')) {
      resetToDefaults();
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setAuthed(false);
    onSignOut();
    onClose();
  };

  // Generate clean source config code export
  const generatedConfigCode = `// Generated for src/config.ts
export const DEFAULT_ORG_SETTINGS: OrganizationSettings = ${JSON.stringify(draftOrg, null, 2)};

export const DEFAULT_COINS: Coin[] = ${JSON.stringify(
    draftCoins.map((c) => ({ ...c, txidPattern: undefined })),
    null,
    2
  )};
`;

  const copyConfigCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedConfigCode);
      setCopiedCode(true);
      recordAuditLog('CONFIG_CODE_COPIED', 'Administrator copied master deploy code snippet');
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      /* clipboard error */
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 backdrop-blur-md p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border-2 border-navy-700 bg-white shadow-2xl overflow-hidden text-slate-800"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-navy-800 bg-navy-900 px-6 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-blue-700 text-gold-400 border border-blue-500/50 shadow-sm">
                <Shield className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif-official text-sm font-bold tracking-wider uppercase">
                    Comptroller & Clearance Terminal
                  </span>
                  <span className="bg-blue-950 text-blue-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-800">
                    TATF LEVEL-4 AUTH
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Transatlantic Clearing Task Force · Operational Administrative Console
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {authed && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Lock Terminal"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-800 text-xs font-mono text-slate-300 hover:text-white hover:border-red-500 hover:bg-red-950/40 transition cursor-pointer"
                >
                  <LogOut className="size-3.5 text-red-400" />
                  <span>LOCK CONSOLE</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* If NOT Authenticated, show strict authentication gateway */}
          {!authed ? (
            <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
              <div className="grid size-16 place-items-center rounded-2xl border-2 border-navy-200 bg-navy-50 text-navy-900 shadow-md">
                <Lock className="size-8 text-blue-700" />
              </div>

              <div>
                <h3 className="font-serif-official text-xl font-bold text-navy-950 tracking-wide uppercase">
                  Restricted Access Terminal
                </h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  This console manages destination settlement vaults, invoice case numbers, and financial clearing rules for the Transatlantic Task Force.
                </p>
              </div>

              <form onSubmit={handleLogin} className="w-full space-y-4">
                <div className="relative text-left">
                  <label htmlFor="adminPass" className="block text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase mb-1">
                    Enter Task Force Command Passcode
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="adminPass"
                      type="password"
                      autoFocus
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        setAuthError(false);
                      }}
                      placeholder="Enter administrative credentials"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50/80 py-3 pr-4 pl-10 text-sm font-mono text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:outline-none"
                    />
                  </div>
                </div>

                {authError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 font-medium">
                    <AlertTriangle className="size-4 shrink-0 text-red-600" />
                    <span>Access Denied: Invalid cryptographic credentials provided.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-navy-900 py-3.5 font-display text-sm font-bold text-white shadow-md hover:bg-navy-800 transition cursor-pointer"
                >
                  Authenticate Terminal Access
                </button>

                <p className="text-[11px] text-slate-400 font-mono">
                  Default credentials configured in <code className="text-slate-700 font-bold">src/config.ts</code> (ADMIN_PASSCODE)
                </p>
              </form>
            </div>
          ) : (
            /* Full Multi-Tab Admin Terminal */
            <div className="flex flex-col flex-1 min-h-0">
              {/* Terminal Navigation Tabs */}
              <div className="flex items-center border-b border-slate-200 bg-slate-100/80 px-6 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => setActiveTab('DIRECTIVE')}
                  className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold font-mono uppercase transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'DIRECTIVE'
                      ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="size-3.5 text-blue-600" />
                  <span>1. Directive & Invoicing Parameters</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('WALLETS')}
                  className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold font-mono uppercase transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'WALLETS'
                      ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <DollarSign className="size-3.5 text-blue-600" />
                  <span>2. Cryptographic Clearing Vaults</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('AUDIT')}
                  className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold font-mono uppercase transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'AUDIT'
                      ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="size-3.5 text-blue-600" />
                  <span>3. Bilateral Audit Log</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('CODE_EXPORT')}
                  className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs font-bold font-mono uppercase transition cursor-pointer whitespace-nowrap ${
                    activeTab === 'CODE_EXPORT'
                      ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="size-3.5 text-blue-600" />
                  <span>4. Permanent Code Export</span>
                </button>
              </div>

              {/* Status Banner */}
              {savedBanner && (
                <div className="bg-emerald-600 text-white text-xs font-semibold font-mono py-2 px-6 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    <span>{savedBanner}</span>
                  </span>
                  <span className="text-[10px] opacity-80">ACTIVE IMMEDIATELY</span>
                </div>
              )}

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* ── TAB 1: DIRECTIVE & INVOICE PARAMETERS ── */}
                {activeTab === 'DIRECTIVE' && (
                  <form onSubmit={handleSaveOrg} className="space-y-6">
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <Sliders className="size-4 text-blue-600" />
                        <span>Command Directive Settings</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Control the organization banner, invoice case identification, target fiat settlement amount, and compliance statements shown to paying entities.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Task Force / Organization Title
                        </label>
                        <input
                          type="text"
                          value={draftOrg.taskForceName}
                          onChange={(e) => setDraftOrg({ ...draftOrg, taskForceName: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 p-2.5 font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Sub-Agency / Directorate
                        </label>
                        <input
                          type="text"
                          value={draftOrg.subAgency}
                          onChange={(e) => setDraftOrg({ ...draftOrg, subAgency: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 p-2.5 font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Invoice / Case Reference
                        </label>
                        <input
                          type="text"
                          value={draftOrg.caseReference}
                          onChange={(e) => setDraftOrg({ ...draftOrg, caseReference: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 p-2.5 font-mono font-bold text-blue-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Operation / Directive Code
                        </label>
                        <input
                          type="text"
                          value={draftOrg.operationCode}
                          onChange={(e) => setDraftOrg({ ...draftOrg, operationCode: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 p-2.5 font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Total Due (USD Fiat Equivalent)
                        </label>
                        <div className="relative">
                          <span className="absolute top-1/2 left-3 -translate-y-1/2 font-bold text-slate-400">$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={draftOrg.fiatAmount}
                            onChange={(e) => setDraftOrg({ ...draftOrg, fiatAmount: parseFloat(e.target.value) || 0 })}
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-8 pr-3 font-mono font-bold text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                          Payment Clearing Window (Minutes)
                        </label>
                        <div className="relative">
                          <Clock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="number"
                            min="5"
                            max="180"
                            value={draftOrg.windowMinutes}
                            onChange={(e) => setDraftOrg({ ...draftOrg, windowMinutes: parseInt(e.target.value, 10) || 15 })}
                            className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="text-xs">
                      <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                        Compliance / Regulatory Statement
                      </label>
                      <input
                        type="text"
                        value={draftOrg.complianceLevel}
                        onChange={(e) => setDraftOrg({ ...draftOrg, complianceLevel: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="text-xs">
                      <label className="block font-bold text-slate-700 uppercase font-mono mb-1">
                        Legal / Audit Disclaimer (Shown in Footer)
                      </label>
                      <textarea
                        rows={2}
                        value={draftOrg.disclaimerNote}
                        onChange={(e) => setDraftOrg({ ...draftOrg, disclaimerNote: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-red-300 text-red-700 bg-red-50 text-xs font-mono font-bold hover:bg-red-100 cursor-pointer"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Factory Reset</span>
                      </button>

                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs uppercase font-mono hover:bg-blue-800 shadow-md cursor-pointer"
                      >
                        <Save className="size-4" />
                        <span>Apply Directive Changes</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ── TAB 2: CRYPTOGRAPHIC CLEARING VAULTS ── */}
                {activeTab === 'WALLETS' && (
                  <div className="space-y-6">
                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 text-xs text-blue-900 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 font-bold mb-1">
                          <Radio className="size-4 text-blue-600" />
                          <span>Active Clearing Currencies & Receiving Addresses</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Each cryptocurrency below generates a unique, scannable QR code matching the exact address provided. You can toggle coins on/off and specify exact network confirmation thresholds.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleSaveCoins}
                        className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-mono font-bold hover:bg-blue-800 shadow-sm cursor-pointer"
                      >
                        <Save className="size-3.5" />
                        <span>Save All Vaults</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {draftCoins.map((c) => (
                        <div
                          key={c.id}
                          className={`rounded-xl border p-4 transition ${
                            c.enabled
                              ? 'border-slate-200 bg-slate-50/60 shadow-2xs'
                              : 'border-slate-200 bg-slate-100/50 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <CoinBadge coin={c} size="sm" />
                              <div>
                                <span className="text-sm font-bold text-slate-900">{c.name}</span>
                                <span className="ml-2 font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                  {c.symbol}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500 font-mono">({c.networkLabel})</span>
                            </div>

                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-600">
                                <span>Req. Blocks:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={c.requiredConfirmations}
                                  onChange={(e) => handleUpdateCoinConfirmations(c.id, parseInt(e.target.value, 10) || 1)}
                                  className="w-14 rounded border border-slate-300 p-1 text-center font-mono font-bold text-slate-900"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => handleToggleCoin(c.id)}
                                className={`px-2.5 py-1 rounded text-xs font-mono font-bold cursor-pointer ${
                                  c.enabled
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-200 text-slate-600 border border-slate-300'
                                }`}
                              >
                                {c.enabled ? 'RAIL: ACTIVE' : 'RAIL: DISABLED'}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold font-mono tracking-wider text-slate-500 uppercase mb-1">
                              Destination Receiving Address (Generates Custom QR)
                            </label>
                            <input
                              type="text"
                              value={c.address}
                              onChange={(e) => handleUpdateCoinAddress(c.id, e.target.value)}
                              placeholder={`Enter receiving address for ${c.symbol}`}
                              className="w-full rounded-lg border border-slate-300 bg-white p-2.5 font-mono text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleSaveCoins}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs uppercase font-mono hover:bg-blue-800 shadow-md cursor-pointer"
                      >
                        <Save className="size-4" />
                        <span>Save & Apply All Addresses</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: BILATERAL AUDIT LOGS ── */}
                {activeTab === 'AUDIT' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs">
                      <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                        <History className="size-4 text-blue-600" />
                        <span>Security & Financial Audit Trail</span>
                      </div>
                      <p className="text-slate-600">
                        Every terminal session, address change, and directive modification is recorded locally with cryptographic timestamps for accountability.
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-100/80 font-mono text-slate-600 uppercase text-[10.5px]">
                            <th className="p-3">Timestamp (UTC)</th>
                            <th className="p-3">Action Code</th>
                            <th className="p-3">Details</th>
                            <th className="p-3">Operator</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                          {auditLogs.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-slate-400">
                                No audit records logged yet.
                              </td>
                            </tr>
                          ) : (
                            auditLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-slate-50/80">
                                <td className="p-3 text-slate-500 whitespace-nowrap">
                                  {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="p-3 font-bold text-blue-700 whitespace-nowrap">
                                  {log.action}
                                </td>
                                <td className="p-3 text-slate-700">{log.details}</td>
                                <td className="p-3 text-slate-500 whitespace-nowrap">{log.operator}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: PERMANENT CODE EXPORT ── */}
                {activeTab === 'CODE_EXPORT' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-900">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold">
                          <HelpCircle className="size-4 text-blue-600" />
                          <span>Code Export for Static Deployments</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => void copyConfigCode()}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-700 text-white font-mono text-xs font-bold hover:bg-blue-800 cursor-pointer shadow-xs"
                        >
                          <ClipboardCopy className="size-3.5" />
                          <span>{copiedCode ? 'COPIED TO CLIPBOARD' : 'COPY ALL CONFIG'}</span>
                        </button>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">
                        To permanently bake these exact addresses and parameters into the production build so every visitor on any computer sees them without using browser storage, paste this code into <code className="font-mono font-bold text-slate-800">src/config.ts</code>.
                      </p>
                    </div>

                    <pre className="max-h-96 overflow-auto rounded-xl border border-slate-300 bg-slate-900 p-4 font-mono text-[11px] leading-relaxed text-emerald-400 selection:bg-blue-600 selection:text-white">
                      {generatedConfigCode}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
