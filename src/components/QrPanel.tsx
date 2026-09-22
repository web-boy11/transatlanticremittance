import { QRCodeSVG } from 'qrcode.react';
import { ScanLine, Wallet } from 'lucide-react';
import CopyButton from './CopyButton';
import type { Coin } from '../config';

type Props = { coin: Coin; uri: string };

export default function QrPanel({ coin, uri }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
      {/* QR Code Container with animated scan-frame corners */}
      <div className="relative flex flex-col items-center justify-center shrink-0 self-center rounded-2xl border-2 border-slate-100 bg-white p-3.5 shadow-sm group">
        <div className="relative scan-frame scan-frame-tr scan-frame-bl">
          <QRCodeSVG
            value={uri}
            size={144}
            level="M"
            marginSize={0}
            bgColor="#FFFFFF"
            fgColor="#0f172a"
          />
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <ScanLine className="size-3 text-blue-600" />
          <span>Scan with wallet</span>
        </div>
      </div>

      {/* Address & Actions */}
      <div className="flex w-full min-w-0 flex-1 flex-col justify-between gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold tracking-[0.14em] text-slate-500 uppercase">
              Recipient {coin.symbol} Address
            </span>
            <span className="text-[11px] font-semibold text-blue-600">
              {coin.networkLabel}
            </span>
          </div>

          <div className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-3 pr-10 transition-colors hover:border-slate-300">
            <p className="break-all font-mono text-[12.5px] font-medium leading-relaxed text-slate-800 selection:bg-blue-100">
              {coin.address}
            </p>
            <div className="absolute top-2 right-1.5">
              <CopyButton value={coin.address} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <a
            href={uri}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50/60 py-2.5 px-3 text-xs font-bold text-blue-700 transition hover:bg-blue-100/70 hover:border-blue-300 shadow-2xs"
          >
            <Wallet className="size-3.5 text-blue-600" />
            <span>Open in Wallet</span>
          </a>
          <CopyButton
            value={coin.address}
            label="Copy Address"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
}
