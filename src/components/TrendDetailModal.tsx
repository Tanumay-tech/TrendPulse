import React from 'react';
import {
  X,
  TrendingUp,
  AlertTriangle,
  Flame,
  BarChart2,
  PieChart as PieIcon,
  Tag,
  Radio,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { DetectedTrend } from '../types';
import { TermTooltip } from './TermTooltip';

interface TrendDetailModalProps {
  trend: DetectedTrend | null;
  onClose: () => void;
  onOpenSimulation: () => void;
}

export const TrendDetailModal: React.FC<TrendDetailModalProps> = ({
  trend,
  onClose,
  onOpenSimulation,
}) => {
  if (!trend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b0f19]/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-[#121824] p-6 shadow-2xl text-[#f1f5f9]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#94a3b8] hover:bg-slate-800/60 hover:text-[#fb7185] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#38bdf8]/15 px-2 py-0.5 text-xs font-mono font-semibold text-[#38bdf8] border border-[#38bdf8]/30">
              {trend.category}
            </span>
            {trend.burstAnomaly && (
              <span className="flex items-center gap-1 rounded bg-[#f43f5e]/15 border border-[#f43f5e]/40 px-2 py-0.5 text-xs font-bold text-[#fb7185] text-glow-rose shadow-[0_0_8px_rgba(244,63,94,0.2)]">
                <Flame className="h-3.5 w-3.5 animate-pulse" />
                <span>
                  <TermTooltip termKey="burstMultiplier" underline={false}>Burst Anomaly</TermTooltip> (
                  <TermTooltip termKey="zScore">z={trend.zScore}</TermTooltip>)
                </span>
              </span>
            )}
          </div>
          <h2 className="mt-2 text-xl font-bold text-[#f1f5f9]">{trend.name}</h2>
          <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">{trend.summary}</p>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-800 bg-[#0b0f19]/60 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">
              <TermTooltip termKey="volume">Total Volume</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#38bdf8] text-glow-sky">{trend.volume.toLocaleString()}</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0b0f19]/60 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">
              <TermTooltip termKey="growthRate">Growth Rate</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#34d399] text-glow-emerald">+{trend.growthRate}%</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-[#0b0f19]/60 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#94a3b8] block">
              <TermTooltip termKey="burstMultiplier">Burst Factor</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#fb7185] text-glow-rose">+{trend.burstMultiplier}x</span>
          </div>
        </div>

        {/* Hourly Volume Sparkline */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b0f19]/60 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-[#f1f5f9] flex items-center gap-1.5 mb-2">
            <BarChart2 className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span>
              <TermTooltip termKey="velocityScore">Hourly Volume Velocity</TermTooltip> & Acceleration
            </span>
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.history}>
                <defs>
                  <linearGradient id="modalGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b0f19',
                    borderColor: '#38bdf8',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f1f5f9',
                    boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#modalGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b0f19]/60 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-[#f1f5f9] flex items-center gap-1.5 mb-2">
            <PieIcon className="h-3.5 w-3.5 text-[#38bdf8]" />
            <span>
              <TermTooltip termKey="sentimentDistribution">Sentiment Distribution</TermTooltip>
            </span>
          </h4>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#0b0f19]">
            <div style={{ width: `${trend.sentimentBreakdown.positive}%` }} className="bg-[#34d399]" />
            <div style={{ width: `${trend.sentimentBreakdown.neutral}%` }} className="bg-[#38bdf8]" />
            <div style={{ width: `${trend.sentimentBreakdown.negative}%` }} className="bg-[#fb7185]" />
          </div>
          <div className="mt-2 flex justify-between text-xs font-mono">
            <span className="text-[#34d399]">Positive: {trend.sentimentBreakdown.positive}%</span>
            <span className="text-[#38bdf8]">Neutral: {trend.sentimentBreakdown.neutral}%</span>
            <span className="text-[#fb7185]">Negative: {trend.sentimentBreakdown.negative}%</span>
          </div>
        </div>

        {/* Related Keyword Vector Pills */}
        <div className="mt-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] block mb-2">
            <TermTooltip termKey="entityToken">Associated Entity Tokens</TermTooltip>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {trend.relatedKeywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#0b0f19] px-2.5 py-1 text-xs font-mono text-[#38bdf8] border border-[#38bdf8]/30 shadow-sm"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSimulation();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#38bdf8] hover:bg-[#7dd3fc] px-4 py-2 text-xs font-bold text-[#0b0f19] transition-colors shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Test Ingestion in Stream Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
