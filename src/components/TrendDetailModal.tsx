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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#F2EFEA]/20 bg-[#8A7F73] p-6 shadow-2xl text-[#F2EFEA]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-[#F2EFEA]/70 hover:bg-[#111111]/30 hover:text-[#00F2FE] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#111111]/50 px-2 py-0.5 text-xs font-mono font-semibold text-[#00F2FE] border border-[#00F2FE]/40">
              {trend.category}
            </span>
            {trend.burstAnomaly && (
              <span className="flex items-center gap-1 rounded bg-[#111111]/60 border border-[#FF4500]/60 px-2 py-0.5 text-xs font-bold text-[#FF4500] text-glow-orange shadow-[0_0_8px_rgba(255,69,0,0.3)]">
                <Flame className="h-3.5 w-3.5 animate-pulse" />
                <span>
                  <TermTooltip termKey="burstMultiplier" underline={false}>Burst Anomaly</TermTooltip> (
                  <TermTooltip termKey="zScore">z={trend.zScore}</TermTooltip>)
                </span>
              </span>
            )}
          </div>
          <h2 className="mt-2 text-xl font-bold text-[#F2EFEA]">{trend.name}</h2>
          <p className="mt-1 text-xs text-[#F2EFEA]/90 leading-relaxed">{trend.summary}</p>
        </div>

        {/* Metrics Grid */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[#F2EFEA]/20 bg-[#111111]/50 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#AFA69D] block">
              <TermTooltip termKey="volume">Total Volume</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#00F2FE] text-glow-aqua">{trend.volume.toLocaleString()}</span>
          </div>
          <div className="rounded-xl border border-[#F2EFEA]/20 bg-[#111111]/50 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#AFA69D] block">
              <TermTooltip termKey="growthRate">Growth Rate</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#2FFF73] text-glow-lime">+{trend.growthRate}%</span>
          </div>
          <div className="rounded-xl border border-[#F2EFEA]/20 bg-[#111111]/50 p-3 shadow-sm">
            <span className="text-[10px] font-mono uppercase text-[#AFA69D] block">
              <TermTooltip termKey="burstMultiplier">Burst Factor</TermTooltip>
            </span>
            <span className="text-lg font-mono font-bold text-[#FF4500] text-glow-orange">+{trend.burstMultiplier}x</span>
          </div>
        </div>

        {/* Hourly Volume Sparkline */}
        <div className="mt-5 rounded-xl border border-[#F2EFEA]/20 bg-[#111111]/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-[#F2EFEA] flex items-center gap-1.5 mb-2">
            <BarChart2 className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>
              <TermTooltip termKey="velocityScore">Hourly Volume Velocity</TermTooltip> & Acceleration
            </span>
          </h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.history}>
                <defs>
                  <linearGradient id="modalGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00F2FE" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#2FFF73" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(242, 239, 234, 0.1)" />
                <XAxis dataKey="time" stroke="#AFA69D" tick={{ fontSize: 10, fill: '#AFA69D' }} />
                <YAxis stroke="#AFA69D" tick={{ fontSize: 10, fill: '#AFA69D' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111111',
                    borderColor: '#00F2FE',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F2EFEA',
                    boxShadow: '0 0 15px rgba(0, 242, 254, 0.45)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#00F2FE"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#modalGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="mt-5 rounded-xl border border-[#F2EFEA]/20 bg-[#111111]/50 p-4 shadow-sm">
          <h4 className="text-xs font-bold text-[#F2EFEA] flex items-center gap-1.5 mb-2">
            <PieIcon className="h-3.5 w-3.5 text-[#00F2FE]" />
            <span>
              <TermTooltip termKey="sentimentDistribution">Sentiment Distribution</TermTooltip>
            </span>
          </h4>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#111111]">
            <div style={{ width: `${trend.sentimentBreakdown.positive}%` }} className="bg-[#2FFF73]" />
            <div style={{ width: `${trend.sentimentBreakdown.neutral}%` }} className="bg-[#00F2FE]" />
            <div style={{ width: `${trend.sentimentBreakdown.negative}%` }} className="bg-[#FF4500]" />
          </div>
          <div className="mt-2 flex justify-between text-xs font-mono">
            <span className="text-[#2FFF73]">Positive: {trend.sentimentBreakdown.positive}%</span>
            <span className="text-[#00F2FE]">Neutral: {trend.sentimentBreakdown.neutral}%</span>
            <span className="text-[#FF4500]">Negative: {trend.sentimentBreakdown.negative}%</span>
          </div>
        </div>

        {/* Related Keyword Vector Pills */}
        <div className="mt-5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#AFA69D] block mb-2">
            <TermTooltip termKey="entityToken">Associated Entity Tokens</TermTooltip>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {trend.relatedKeywords.map((kw, i) => (
              <span
                key={i}
                className="rounded-lg bg-[#111111]/60 px-2.5 py-1 text-xs font-mono text-[#00F2FE] border border-[#00F2FE]/40 shadow-[0_0_6px_rgba(0,242,254,0.2)]"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#F2EFEA]/20">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-[#AFA69D] hover:text-[#F2EFEA] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenSimulation();
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#00F2FE] hover:bg-[#52f8ff] px-4 py-2 text-xs font-bold text-[#111111] transition-colors shadow-[0_0_15px_rgba(0,242,254,0.45)]"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Test Ingestion in Stream Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
