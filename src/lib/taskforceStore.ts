import type { Coin, OrganizationSettings } from '../config';
import { DEFAULT_COINS, DEFAULT_ORG_SETTINGS } from '../config';

const COINS_STORAGE_KEY = 'tatf-coins-registry-v2';
const ORG_STORAGE_KEY = 'tatf-org-settings-v2';
const LOGS_STORAGE_KEY = 'tatf-audit-logs-v2';
const AUTH_KEY = 'tatf-admin-authenticated';
const LINK_KEY = 'tatf-admin-link-cleared';

/**
 * The dispatch console is invisible to ordinary visitors. It only appears
 * once the owner has opened the page through the private command link
 * (e.g. https://site.com/#admin). Access then persists on that device.
 */
export function hasAdminLinkAccess(): boolean {
  try {
    return localStorage.getItem(LINK_KEY) === 'true';
  } catch {
    return false;
  }
}

export function grantAdminLinkAccess(): void {
  try {
    localStorage.setItem(LINK_KEY, 'true');
    recordAuditLog('COMMAND_LINK_USED', 'Private dispatch link presented — console revealed');
  } catch {
    /* noop */
  }
}

export function revokeAdminLinkAccess(): void {
  try {
    localStorage.removeItem(LINK_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    recordAuditLog('COMMAND_LINK_REVOKED', 'Console concealment re-armed on this device');
  } catch {
    /* noop */
  }
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  operator: string;
}

export interface VerificationLog {
  id: string;
  timestamp: string;
  caseReference: string;
  coinSymbol: string;
  network: string;
  amount: number;
  fiatValue: number;
  txid: string;
  recipientAddress: string;
  status: 'PENDING' | 'CONFIRMING' | 'VERIFIED' | 'FLAGGED';
}

/** Load fully editable coin registry */
export function loadCoinRegistry(): Coin[] {
  try {
    const raw = localStorage.getItem(COINS_STORAGE_KEY);
    if (!raw) return DEFAULT_COINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Re-hydrate regex pattern from source definition
      return parsed.map((c) => {
        const def = DEFAULT_COINS.find((d) => d.id === c.id);
        return {
          ...c,
          txidPattern: def ? def.txidPattern : /^[0-9a-zA-Z]{32,128}$/,
        };
      });
    }
  } catch {
    /* fallback */
  }
  return DEFAULT_COINS;
}

export function saveCoinRegistry(coins: Coin[]): void {
  try {
    // Exclude regex from JSON serialization
    const clean = coins.map((c) => ({
      ...c,
      txidPattern: undefined,
    }));
    localStorage.setItem(COINS_STORAGE_KEY, JSON.stringify(clean));
    recordAuditLog('COIN_REGISTRY_UPDATED', `Updated ${coins.length} clearing rails and addresses`);
  } catch {
    /* noop */
  }
}

/** Load Organization / Directive settings */
export function loadOrgSettings(): OrganizationSettings {
  try {
    const raw = localStorage.getItem(ORG_STORAGE_KEY);
    if (!raw) return DEFAULT_ORG_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_ORG_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_ORG_SETTINGS;
  }
}

export function saveOrgSettings(settings: OrganizationSettings): void {
  try {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(settings));
    recordAuditLog('DIRECTIVE_SETTINGS_SAVED', `Updated case ref: ${settings.caseReference}, amount: $${settings.fiatAmount}`);
  } catch {
    /* noop */
  }
}

/** Reset all configuration to official defaults */
export function resetToDefaults(): void {
  try {
    localStorage.removeItem(COINS_STORAGE_KEY);
    localStorage.removeItem(ORG_STORAGE_KEY);
    recordAuditLog('SYSTEM_RESET', 'Restored master transatlantic defaults');
  } catch {
    /* noop */
  }
}

/** Audit Logging for the Task Force record */
export function getAuditLogs(): AuditRecord[] {
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      return [
        {
          id: 'log-init',
          timestamp: new Date().toISOString(),
          action: 'GATEWAY_INITIALIZED',
          details: 'Transatlantic Task Force clearing rail active',
          operator: 'System Daemon / Sentinel',
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordAuditLog(action: string, details: string): void {
  try {
    const logs = getAuditLogs();
    const newLog: AuditRecord = {
      id: `tatf-log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      operator: 'Duty Comptroller / Authorized Admin',
    };
    const updated = [newLog, ...logs].slice(0, 50); // keep last 50
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* noop */
  }
}

/** Admin Session Tracking */
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(auth: boolean): void {
  try {
    if (auth) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      recordAuditLog('ADMIN_SESSION_START', 'Administrative terminal unlocked');
    } else {
      sessionStorage.removeItem(AUTH_KEY);
      recordAuditLog('ADMIN_SESSION_END', 'Administrative terminal locked');
    }
  } catch {
    /* noop */
  }
}
