import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Settings,
  ShieldCheck,
  TriangleAlert,
  FileCheck2,
  KeyRound,
} from 'lucide-react';
import { ADMIN_LINK_KEY, type Coin, type OrganizationSettings } from './config';
import {
  loadCoinRegistry,
  loadOrgSettings,
  recordAuditLog,
  isAdminAuthenticated,
  hasAdminLinkAccess,
  grantAdminLinkAccess,
} from './lib/taskforceStore';
import AuthenticAdminModal from './components/AuthenticAdminModal';
import OfficialHeader from './components/OfficialHeader';
import OfficialFooter from './components/OfficialFooter';
import SecurityCertificateStrip from './components/SecurityCertificateStrip';
import LiveMarketTicker from './components/LiveMarketTicker';
import LiveNetworkPulse from './components/LiveNetworkPulse';
import ParticleField from './components/ParticleField';
import GlowOrb from './components/GlowOrb';
import {
  buildPaymentUri,
  fetchRates,
  formatAmount,
  lookupTx,
  type CheckResult,
  type Phase,
  type RateResult,
} from './lib/crypto';
import StatusPill from './components/StatusPill';
import TimerBar from './components/TimerBar';
import Steps from './components/Steps';
import CoinSelector from './components/CoinSelector';
import AmountPanel from './components/AmountPanel';
import QrPanel from './components/QrPanel';
import TxidForm from './components/TxidForm';
import VerifyPanel from './components/VerifyPanel';
import ExpiredPanel from './components/ExpiredPanel';
import CoinBadge from './components/CoinBadge';

const EXPIRE_KEY = 'tatf-checkout-expires-at';

function phaseFromCheck(txid: string, check: CheckResult): Phase {
  if (!check.found) return { kind: 'notfound', txid };
  if (!check.matchedAddress) return { kind: 'review', txid, reason: 'wrong-address' };
  if (check.confirmed) return { kind: 'confirmed', txid, check };
  return { kind: 'verifying', txid, check };
}

export default function App() {
  /* ── Master Task Force State ─── */
  const [coins, setCoins] = useState<Coin[]>(() => loadCoinRegistry());
  const [orgSettings, setOrgSettings] = useState<OrganizationSettings>(() => loadOrgSettings());
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState<boolean>(() => isAdminAuthenticated());

  /* ── Dispatch console visibility ──────────────────────────────
     Hidden from all visitors. Only revealed once the private
     command link (#admin / ?admin=tatf-command) has been used.  */
  const [consoleRevealed, setConsoleRevealed] = useState<boolean>(() => hasAdminLinkAccess());

  // Filter only active rails
  const activeCoins = useMemo(() => {
    const enabled = coins.filter((c) => c.enabled);
    return enabled.length > 0 ? enabled : coins;
  }, [coins]);

  // Selected coin
  const [coinId, setCoinId] = useState<string>(() => activeCoins[0]?.id || 'btc');
  const coin: Coin = useMemo(
    () => activeCoins.find((c) => c.id === coinId) ?? activeCoins[0] ?? coins[0],
    [activeCoins, coinId, coins]
  );

  /* ── Simple Admin Link Detection (/admin, #admin, ?admin) ─── */
  useEffect(() => {
    const checkAdminTrigger = () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
        const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');
        const queryAdmin = searchParams.get('admin');
        const expected = ADMIN_LINK_KEY.trim().toLowerCase();

        const matched =
          pathname === '/admin' ||
          pathname.endsWith('/admin') ||
          hash === 'admin' ||
          hash === expected ||
          searchParams.has('admin') ||
          (queryAdmin !== null && (queryAdmin.trim().toLowerCase() === expected || queryAdmin === ''));

        if (matched) {
          grantAdminLinkAccess();
          setConsoleRevealed(true);
          setAdminOpen(true);
        }
      } catch {
        /* ignore */
      }
    };

    checkAdminTrigger();
    window.addEventListener('hashchange', checkAdminTrigger);
    window.addEventListener('popstate', checkAdminTrigger);
    return () => {
      window.removeEventListener('hashchange', checkAdminTrigger);
      window.removeEventListener('popstate', checkAdminTrigger);
    };
  }, []);

  /* ── Exchange Rates ─── */
  const [rates, setRates] = useState<Record<string, RateResult>>(() => {
    const initial: Record<string, RateResult> = {};
    for (const c of coins) initial[c.id] = { value: c.fallbackRate, live: false };
    return initial;
  });
  const [rateLoading, setRateLoading] = useState(true);

  const loadRates = useCallback(async () => {
    setRateLoading(true);
    const r = await fetchRates(coins);
    setRates(r);
    setRateLoading(false);
  }, [coins]);

  useEffect(() => {
    void loadRates();
  }, [loadRates]);

  /* ── Payment Window Countdown ─── */
  const windowMs = (orgSettings.windowMinutes || 30) * 60_000;
  const [expiresAt, setExpiresAt] = useState<number>(() => {
    try {
      const saved = Number(localStorage.getItem(EXPIRE_KEY));
      if (Number.isFinite(saved) && saved > Date.now() + 5_000) return saved;
    } catch {
      /* noop */
    }
    return Date.now() + windowMs;
  });
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(EXPIRE_KEY, String(expiresAt));
    } catch {
      /* noop */
    }
  }, [expiresAt]);

  /* ── Verification State Machine ─── */
  const [phase, setPhase] = useState<Phase>({ kind: 'form' });

  const runLookup = useCallback(async (targetCoin: Coin, txid: string) => {
    if (targetCoin.verify === 'manual') {
      setPhase({ kind: 'review', txid, reason: 'manual' });
      recordAuditLog('MANUAL_SUBMISSION', `TXID ${txid.slice(0, 16)}... submitted for ${targetCoin.symbol}`);
      return;
    }
    try {
      const check = await lookupTx(targetCoin, txid);
      if (check) {
        setPhase(phaseFromCheck(txid, check));
        if (check.confirmed) {
          recordAuditLog('ONCHAIN_VERIFIED', `Payment for ${targetCoin.symbol} verified on-chain: ${txid}`);
        }
      } else {
        setPhase({ kind: 'review', txid, reason: 'unreachable' });
      }
    } catch {
      setPhase({ kind: 'review', txid, reason: 'unreachable' });
    }
  }, []);

  const submitTxid = useCallback(
    async (txid: string) => {
      if (coin.verify !== 'manual') setPhase({ kind: 'checking', txid });
      await runLookup(coin, txid);
    },
    [coin, runLookup]
  );

  const recheck = useCallback(
    async (txid: string) => {
      await runLookup(coin, txid);
    },
    [coin, runLookup]
  );

  useEffect(() => {
    let interval: number | undefined;
    if (phase.kind === 'verifying') {
      interval = window.setInterval(() => void recheck(phase.txid), 15_000);
    } else if (phase.kind === 'notfound') {
      interval = window.setInterval(() => void recheck(phase.txid), 30_000);
    }
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [phase, recheck]);

  const handleSelectCoin = useCallback((id: string) => {
    setCoinId(id);
    setPhase({ kind: 'form' });
  }, []);

  const expired = now >= expiresAt;
  const remaining = Math.max(0, expiresAt - now);

  const rate = rates[coin.id] ?? { value: coin.fallbackRate, live: false };
  const cryptoAmount = orgSettings.fiatAmount / (rate.value > 0 ? rate.value : coin.fallbackRate);
  const amountDisplay = useMemo(
    () => formatAmount(cryptoAmount, coin.displayDecimals),
    [cryptoAmount, coin.displayDecimals]
  );
  const uri = useMemo(() => buildPaymentUri(coin, cryptoAmount), [coin, cryptoAmount]);

  const hasSubmitted = phase.kind !== 'form';
  const showExpired = expired && phase.kind !== 'confirmed';
  const step = phase.kind === 'form' ? 2 : 3;

  const restart = useCallback(async () => {
    setPhase({ kind: 'form' });
    setExpiresAt(Date.now() + windowMs);
    setNow(Date.now());
    await loadRates();
  }, [windowMs, loadRates]);

  const handleAdminCoinsUpdate = (newCoins: Coin[]) => {
    setCoins(newCoins);
  };

  const handleAdminOrgUpdate = (newOrg: OrganizationSettings) => {
    setOrgSettings(newOrg);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transatlantic-grid text-slate-800">
      {/* ── Live Particle Network Background ─── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <ParticleField />
      </div>

      {/* ── Official Institutional Transatlantic Header ─── */}
      <OfficialHeader
        settings={orgSettings}
        onAdminClick={() => setAdminOpen(true)}
        adminActive={adminAuthed}
        consoleRevealed={consoleRevealed}
      />

      {/* ── Live market tape ─── */}
      <LiveMarketTicker
        coins={activeCoins}
        rates={rates}
        selectedId={coin.id}
        onSelect={handleSelectCoin}
      />

      {/* ── Main Layout Body ─── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
        {/* Top Banner Notice */}
        <div className="w-full max-w-xl mb-6 space-y-4">
          <SecurityCertificateStrip
            settings={orgSettings}
            activeCoin={coin}
            amountDisplay={amountDisplay}
          />
        </div>

        {/* ── The Official Settlement Form Card ─── */}
        <div className="relative w-full max-w-xl">
          {/* Ambient Glow Orbs behind the card */}
          <GlowOrb color={coin.color} className="-top-20 -left-20" size="lg" />
          <GlowOrb color="#2563eb" className="-bottom-16 -right-16" size="md" />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full overflow-hidden rounded-3xl animated-border glass-card shadow-2xl official-card-shadow"
          >
            {/* Header Accent Bar with Navy & Gold Pinstripe */}
            <div className="h-2 w-full bg-linear-to-r from-navy-900 via-blue-700 to-navy-900 border-b border-gold-500/40" />

            <div className="space-y-6 p-6 sm:p-8">
              {/* Card Header */}
              <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <CoinBadge coin={coin} size="lg" glow />
                    <span className="absolute -bottom-1 -right-1 grid size-4.5 place-items-center rounded-full bg-navy-900 text-[9px] font-black text-white ring-2 ring-white shadow-2xs">
                      ✓
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif-official text-lg sm:text-xl font-bold text-navy-950 uppercase tracking-wide">
                        Cryptographic Clearance
                      </h2>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Case {orgSettings.caseReference} · Peer-to-Peer
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusPill kind={showExpired ? 'expired' : phase.kind} />
                  {consoleRevealed && (
                  <button
                    type="button"
                    onClick={() => setAdminOpen(true)}
                    title="Open Task Force Admin Console"
                    className="grid size-8 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition cursor-pointer shadow-2xs"
                  >
                    <Settings className="size-4" />
                  </button>
                  )}
                </div>
              </div>

              {/* Countdown Timer */}
              {!showExpired && <TimerBar remainingMs={remaining} totalMs={windowMs} />}

              {/* Protocol Steps Bar */}
              {!showExpired && <Steps current={step} done={phase.kind === 'confirmed'} />}

              {/* Cryptocurrency Selector */}
              {!showExpired && (
                <CoinSelector
                  coins={activeCoins}
                  selectedId={coin.id}
                  onSelect={handleSelectCoin}
                  disabled={expired}
                />
              )}

              {/* Amount Calculation Panel + Dynamic QR */}
              {!showExpired && (
                <>
                  <AmountPanel
                    coin={coin}
                    amountDisplay={amountDisplay}
                    fiat={orgSettings.fiatAmount}
                    rate={rate.value}
                    live={rate.live}
                    loading={rateLoading}
                    onRefresh={() => void loadRates()}
                  />

                  <QrPanel coin={coin} uri={uri} />

                  {/* Live network monitor */}
                  <LiveNetworkPulse coin={coin} />

                  {/* Directive Alert Box */}
                  <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs">
                    <TriangleAlert className="mt-0.5 size-4 shrink-0 text-blue-700" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-blue-900 font-mono uppercase">
                        Mandatory Routing Instructions:
                      </p>
                      <p className="text-slate-700 leading-relaxed text-[11.5px]">
                        Transfer exactly <span className="font-bold">{amountDisplay} {coin.symbol}</span> on the{' '}
                        <span className="font-bold text-navy-900">{coin.networkLabel}</span>. Do not send on cross-chain bridges or unverified L2 testnets.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* TXID Verification Section Header */}
              {!showExpired && (
                <div className="flex items-center gap-3 text-[11px] font-bold font-mono tracking-wider text-slate-400 uppercase pt-2">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <FileCheck2 className="size-3.5 text-blue-600" />
                    <span>Proof of Broadcast (TXID Verification)</span>
                  </span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
              )}

              {/* Dynamic Stage Action */}
              <AnimatePresence mode="wait" initial={false}>
                {showExpired ? (
                  <ExpiredPanel
                    key="expired"
                    submitted={hasSubmitted}
                    windowMinutes={orgSettings.windowMinutes}
                    onRestart={() => void restart()}
                  />
                ) : phase.kind === 'form' ? (
                  <motion.div
                    key={`form-${coin.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    <TxidForm coin={coin} onSubmit={(txid) => void submitTxid(txid)} disabled={expired} />
                  </motion.div>
                ) : (
                  <VerifyPanel
                    key={phase.kind}
                    coin={coin}
                    phase={phase}
                    expectedAmount={cryptoAmount}
                    caseReference={orgSettings.caseReference}
                    onRetry={() => void recheck(phase.txid)}
                    onNewTxid={() => setPhase({ kind: 'form' })}
                  />
                )}
              </AnimatePresence>

              {/* Official Security Stamp Footer inside the Card */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Intergovernmental Direct Settle</span>
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Settlement rail live</span>
                </span>

                {/* Revealed only via the private command link */}
                {consoleRevealed && (
                  <button
                    type="button"
                    onClick={() => setAdminOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 font-bold text-blue-700 hover:text-navy-900 hover:underline"
                  >
                    <KeyRound className="size-3" />
                    <span>Officer Dispatch Terminal</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* ── Official Institutional Footer ─── */}
      <OfficialFooter
        settings={orgSettings}
        onAdminOpen={() => setAdminOpen(true)}
        consoleRevealed={consoleRevealed}
      />

      {/* ── Authentic Admin Terminal Modal ─── */}
      <AuthenticAdminModal
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        coins={coins}
        orgSettings={orgSettings}
        onCoinsUpdated={handleAdminCoinsUpdate}
        onOrgSettingsUpdated={handleAdminOrgUpdate}
        onSignOut={() => setAdminAuthed(false)}
      />
    </div>
  );
}
