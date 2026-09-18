import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  Radio,
  BarChart3,
  Layers,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  PieChart as PieIcon,
  ChevronRight,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { DetectedTrend, AnomalyAlert } from '../types';
import { TermTooltip } from './TermTooltip';

export type DashboardSubTab = 'trends' | 'volume' | 'sentiment' | 'radar';

interface DashboardViewProps {
  trends: DetectedTrend[];
  anomalies: AnomalyAlert[];
  onSelectTrend: (trend: DetectedTrend) => void;
  onOpenSimulation: () => void;
  initialSubTab?: DashboardSubTab;
  onSubTabChange?: (tab: DashboardSubTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trends,
  anomalies,
  onSelectTrend,
  onOpenSimulation,
  initialSubTab = 'trends',
  onSubTabChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<DashboardSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab && initialSubTab !== activeSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabChange = (tab: DashboardSubTab) => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'growth' | 'volume' | 'sentiment' | 'burst'>('growth');
  const [anomalyFilter, setAnomalyFilter] = useState<'all' | 'critical' | 'high'>('all');

  const categories = ['all', ...Array.from(new Set(trends.map((t) => t.category)))];

  const filteredTrends = trends
    .filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.relatedKeywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'growth') return b.growthRate - a.growthRate;
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'sentiment') return b.sentimentScore - a.sentimentScore;
      if (sortBy === 'burst') return (b.burstMultiplier || 0) - (a.burstMultiplier || 0);
      return 0;
    });

  const totalVolume = trends.reduce((acc, t) => acc + t.volume, 0);
  const avgGrowth = Math.round(
    trends.reduce((acc, t) => acc + t.growthRate, 0) / (trends.length || 1)
  );
  const activeAnomalyCount = anomalies.length;

  // Aggregate hourly volume chart data
  const hourlyData = [
    {
      time: '00:00',
      'Autonomous Agent': 12400,
      'Superconductors': 8200,
      'Spatial Glass': 14200,
      'Reasoning Models': 18000,
      'Solid-State Battery': 12000,
    },
    {
      time: '04:00',
      'Autonomous Agent': 18900,
      'Superconductors': 11500,
      'Spatial Glass': 18600,
      'Reasoning Models': 26000,
      'Solid-State Battery': 15400,
    },
    {
      time: '08:00',
      'Autonomous Agent': 34200,
      'Superconductors': 22400,
      'Spatial Glass': 28900,
      'Reasoning Models': 48000,
      'Solid-State Battery': 22800,
    },
    {
      time: '12:00',
      'Autonomous Agent': 68100,
      'Superconductors': 49100,
      'Spatial Glass': 41200,
      'Reasoning Models': 92000,
      'Solid-State Battery': 32500,
    },
    {
      time: '16:00',
      'Autonomous Agent': 142000,
      'Superconductors': 76000,
      'Spatial Glass': 55800,
      'Reasoning Models': 129000,
      'Solid-State Battery': 41900,
    },
    {
      time: '20:00',
      'Autonomous Agent': 184500,
      'Superconductors': 92400,
      'Spatial Glass': 64800,
      'Reasoning Models': 152000,
      'Solid-State Battery': 48200,
    },
  ];

  // Overall sentiment pie breakdown
  const avgPositive = Math.round(
    trends.reduce((acc, t) => acc + t.sentimentBreakdown.positive, 0) / (trends.length || 1)
  );
  const avgNeutral = Math.round(
    trends.reduce((acc, t) => acc + t.sentimentBreakdown.neutral, 0) / (trends.length || 1)
  );
  const avgNegative = Math.round(
    trends.reduce((acc, t) => acc + t.sentimentBreakdown.negative, 0) / (trends.length || 1)
  );

  const pieData = [
    { name: 'Positive Sentiment', value: avgPositive, color: '#10B981' },
    { name: 'Neutral / Informational', value: avgNeutral, color: '#0EA5E9' },
    { name: 'Skeptical / Critical', value: avgNegative, color: '#EF4444' },
  ];

  const filteredAnomalies = anomalies.filter((a) => {
    if (anomalyFilter === 'all') return true;
    return a.severity === anomalyFilter;
  });

  const renderPlatformBadge = (p: 'twitter' | 'reddit' | 'youtube') => {
    switch (p) {
      case 'twitter':
        return (
          <span
            key={p}
            className="rounded bg-[#0D1117] border border-[#0EA5E9]/30 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#0EA5E9]"
          >
            X / Twitter
          </span>
        );
      case 'reddit':
        return (
          <span
            key={p}
            className="rounded bg-[#0D1117] border border-[#EF4444]/30 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#EF4444]"
          >
            Reddit
          </span>
        );
      case 'youtube':
        return (
          <span
            key={p}
            className="rounded bg-[#0D1117] border border-[#10B981]/30 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#10B981]"
          >
            YouTube
          </span>
        );
    }
  };

  const subTabs = [
    {
      id: 'trends' as const,
      label: 'Viral Topic Feed',
      badge: `${trends.length} Active`,
      icon: TrendingUp,
      description: 'Explore detected viral entities & signals',
    },
    {
      id: 'volume' as const,
      label: 'Velocity & Volume Charts',
      badge: '24h Trajectory',
      icon: BarChart3,
      description: 'Multi-entity time-series & acceleration',
    },
    {
      id: 'sentiment' as const,
      label: 'Sentiment Breakdown',
      badge: '+0.64 Bullish',
      icon: PieIcon,
      description: 'Tone analysis & public discourse distribution',
    },
    {
      id: 'radar' as const,
      label: 'Burst Anomaly Radar',
      badge: `${activeAnomalyCount} Spikes`,
      badgeColor: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]',
      icon: AlertTriangle,
      description: 'Statistical outliers & frequency surges',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top High-Level Metrics Summary Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Total Ingested Volume */}
        <div
          onClick={() => handleSubTabChange('volume')}
          className="cursor-pointer rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg transition-all hover:border-[#0EA5E9]/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        >
          <div className="flex items-center justify-between text-xs text-[#F8FAFC]">
            <span className="font-bold uppercase tracking-wider text-xs text-[#F8FAFC]">
              <TermTooltip termKey="volume">Aggregated Volume</TermTooltip>
            </span>
            <BarChart3 className="h-4 w-4 text-[#0EA5E9]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#F8FAFC]">
              {totalVolume.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-[#10B981] text-glow-emerald">+24.8%</span>
          </div>
        </div>

        {/* Growth Velocity */}
        <div
          onClick={() => handleSubTabChange('trends')}
          className="cursor-pointer rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg transition-all hover:border-[#0EA5E9]/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        >
          <div className="flex items-center justify-between text-xs text-[#F8FAFC]">
            <span className="font-bold uppercase tracking-wider text-xs text-[#F8FAFC]">
              <TermTooltip termKey="growthRate">Avg Acceleration</TermTooltip>
            </span>
            <TrendingUp className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#10B981] text-glow-emerald">
              +{avgGrowth}%
            </span>
            <span className="text-[11px] font-mono font-semibold text-[#F8FAFC]">
              <TermTooltip termKey="velocityScore">Velocity</TermTooltip>
            </span>
          </div>
        </div>

        {/* Anomaly Spikes */}
        <div
          onClick={() => handleSubTabChange('radar')}
          className="cursor-pointer rounded-xl border border-[#EF4444]/40 bg-[#1E293B] p-4 shadow-[0_0_20px_rgba(239,68,68,0.15)] transition-all hover:border-[#EF4444] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]"
        >
          <div className="flex items-center justify-between text-xs text-[#F8FAFC]">
            <span className="font-bold uppercase tracking-wider text-xs text-[#F8FAFC]">
              <TermTooltip termKey="zScore">Anomaly Outliers</TermTooltip>
            </span>
            <AlertTriangle className="h-4 w-4 text-[#EF4444] drop-shadow-[0_0_6px_#EF4444]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#EF4444] text-glow-crimson">
              {activeAnomalyCount}
            </span>
            <span className="text-[10px] font-bold text-[#EF4444] rounded bg-[#0D1117] px-1.5 py-0.5 border border-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
              <TermTooltip termKey="zScore">z &gt; 3.5 Spikes</TermTooltip>
            </span>
          </div>
        </div>

        {/* Net Sentiment */}
        <div
          onClick={() => handleSubTabChange('sentiment')}
          className="cursor-pointer rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg transition-all hover:border-[#0EA5E9]/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]"
        >
          <div className="flex items-center justify-between text-xs text-[#F8FAFC]">
            <span className="font-bold uppercase tracking-wider text-xs text-[#F8FAFC]">
              <TermTooltip termKey="sentimentPolarity">Sentiment Bias</TermTooltip>
            </span>
            <Sparkles className="h-4 w-4 text-[#0EA5E9]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold text-[#0EA5E9] text-glow-cyan">+0.64</span>
            <span className="rounded bg-[#10B981]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#10B981] border border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              BULLISH
            </span>
          </div>
        </div>
      </div>

      {/* Primary Sub-Navigation Tab Bar */}
      <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-1.5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`dashboard-subtab-${tab.id}`}
                  onClick={() => handleSubTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0EA5E9] text-[#0D1117] font-bold shadow-[0_0_14px_rgba(14,165,233,0.35)]'
                      : 'text-[#94A3B8] hover:bg-[#243247] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0D1117]' : 'text-[#94A3B8]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`rounded border px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? 'bg-[#0D1117]/20 text-[#0D1117] border-[#0D1117]/30'
                        : tab.badgeColor || 'bg-[#0D1117]/60 text-[#94A3B8] border-[#334155]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#94A3B8]">
            <span className="text-[11px] font-mono">
              {subTabs.find((t) => t.id === activeSubTab)?.description}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SUB-TAB 1: VIRAL TOPIC FEED ================= */}
      {activeSubTab === 'trends' && (
        <div className="space-y-4">
          {/* Controls Bar: Search, Category, Sort */}
          <div className="flex flex-col gap-3 rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#F8FAFC]">Detected Viral Entities</span>
              <span className="rounded-full bg-[#0D1117]/60 px-2 py-0.5 text-xs font-mono font-bold text-[#0EA5E9] border border-[#0EA5E9]/30 shadow-[0_0_8px_rgba(14,165,233,0.2)]">
                {filteredTrends.length} Showing
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#0EA5E9]" />
                <input
                  id="input-trend-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter keywords or entities..."
                  className="rounded-lg border border-[#334155] bg-[#0D1117]/70 py-1.5 pl-8 pr-3 text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#0EA5E9] focus:bg-[#0D1117] focus:shadow-[0_0_12px_rgba(14,165,233,0.2)] focus:outline-none w-52 sm:w-60 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1 rounded-lg border border-[#334155] bg-[#0D1117]/70 px-2 py-1">
                <Filter className="h-3 w-3 text-[#0EA5E9]" />
                <select
                  id="select-trend-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-[#0D1117] text-[#F8FAFC]">
                      {c === 'all' ? 'All Categories' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1 rounded-lg border border-[#334155] bg-[#0D1117]/70 px-2 py-1">
                <SlidersHorizontal className="h-3 w-3 text-[#0EA5E9]" />
                <select
                  id="select-trend-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs text-[#F8FAFC] focus:outline-none"
                >
                  <option value="growth" className="bg-[#0D1117] text-[#F8FAFC]">Sort by Growth</option>
                  <option value="volume" className="bg-[#0D1117] text-[#F8FAFC]">Sort by Volume</option>
                  <option value="sentiment" className="bg-[#0D1117] text-[#F8FAFC]">Sort by Sentiment</option>
                  <option value="burst" className="bg-[#0D1117] text-[#F8FAFC]">Sort by Burst Multiplier</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trend Cards Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTrends.map((trend) => (
              <div
                key={trend.id}
                onClick={() => onSelectTrend(trend)}
                className="group relative flex cursor-pointer flex-col justify-between rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg transition-all hover:border-[#0EA5E9]/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
              >
                <div>
                  {/* Header: Category & Burst Status */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded bg-[#0D1117]/60 px-2 py-0.5 text-[10px] font-semibold text-[#94A3B8] border border-[#334155]">
                      {trend.category}
                    </span>
                    {trend.burstAnomaly ? (
                      <div className="flex items-center gap-1 rounded bg-[#EF4444]/15 border border-[#EF4444]/40 px-2 py-0.5 text-[10px] font-bold text-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                        <Flame className="h-3 w-3 text-[#EF4444] drop-shadow-[0_0_4px_#EF4444]" />
                        <TermTooltip termKey="burstMultiplier" underline={false}>
                          <span className="text-glow-crimson">+{trend.burstMultiplier}x BURST</span>
                        </TermTooltip>
                      </div>
                    ) : (
                      <span className="text-[10px] font-mono text-[#94A3B8]">Steady Growth</span>
                    )}
                  </div>

                  {/* Trend Title */}
                  <h3 className="mt-3 text-base font-bold text-[#F8FAFC] group-hover:text-[#0EA5E9] group-hover:text-glow-cyan transition-colors">
                    {trend.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {trend.summary}
                  </p>

                  {/* Keyword Pills */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {trend.relatedKeywords.slice(0, 3).map((kw, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-[#0D1117]/60 px-2 py-0.5 text-[11px] font-medium text-[#94A3B8] border border-[#334155]"
                      >
                        #{kw}
                      </span>
                    ))}
                    {trend.relatedKeywords.length > 3 && (
                      <span className="text-[11px] text-[#94A3B8] self-center">
                        +{trend.relatedKeywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#334155]">
                  {/* Metrics Bar */}
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#94A3B8] text-[10px] uppercase font-mono block">
                        <TermTooltip termKey="volume">Volume</TermTooltip>
                      </span>
                      <span className="font-mono font-bold text-[#F8FAFC]">
                        {trend.volume.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] uppercase font-mono block">
                        <TermTooltip termKey="growthRate">Growth</TermTooltip>
                      </span>
                      <span className="font-mono font-bold text-[#10B981] text-glow-emerald">
                        +{trend.growthRate}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] uppercase font-mono block">
                        <TermTooltip termKey="sentimentPolarity">Sentiment</TermTooltip>
                      </span>
                      <span
                        className={`font-mono font-bold ${
                          trend.sentimentScore > 0.3
                            ? 'text-[#10B981] text-glow-emerald'
                            : trend.sentimentScore < -0.2
                            ? 'text-[#EF4444] text-glow-crimson'
                            : 'text-[#0EA5E9]'
                        }`}
                      >
                        {trend.sentimentScore > 0 ? '+' : ''}
                        {trend.sentimentScore.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Footer Platforms & Inspect CTA */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {trend.platforms.map((p) => renderPlatformBadge(p))}
                    </div>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#0EA5E9] group-hover:text-glow-cyan transition-all">
                      Inspect
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Navigation Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155] text-xs text-[#94A3B8]">
            <span>Click any card to inspect the interactive trajectory modal.</span>
            <button
              onClick={() => handleSubTabChange('volume')}
              className="flex items-center gap-1 font-bold text-[#0EA5E9] hover:text-glow-cyan transition-all"
            >
              <span>View Volume &amp; Velocity Charts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: VOLUME & VELOCITY CHARTS ================= */}
      {activeSubTab === 'volume' && (
        <div className="space-y-6">
          {/* Main Time Series Chart */}
          <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#334155]">
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#0EA5E9]" />
                  Keyword Volume Trajectory (24h Observation Window)
                </h3>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Continuous multi-platform volume monitoring with dynamic velocity curves
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_8px_#0EA5E9]"></span>
                  Autonomous Agent
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]"></span>
                  Superconductors
                </span>
                <span className="flex items-center gap-1.5 text-xs font-mono text-[#F8FAFC]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]"></span>
                  Reasoning Models
                </span>
              </div>
            </div>

            <div className="mt-5 h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="techGothStrokeGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0EA5E9" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="colorAgent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorPhysics" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorModels" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                  <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderColor: '#0EA5E9',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#F8FAFC',
                      boxShadow: '0 0 15px rgba(14, 165, 233, 0.25)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Autonomous Agent"
                    stroke="url(#techGothStrokeGradient)"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAgent)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Superconductors"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorPhysics)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Reasoning Models"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorModels)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#F8FAFC] font-mono pt-3 border-t border-[#334155]">
              <span className="flex items-center gap-1 text-[#EF4444] text-glow-crimson">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>
                  Inflection surge triggered at 16:00 UTC (
                  <TermTooltip termKey="burstMultiplier">Burst Multiplier</TermTooltip> &gt; 3.8x)
                </span>
              </span>
              <span className="text-[#94A3B8]">
                <TermTooltip termKey="slidingWindow">Sliding Window</TermTooltip>: 4-hour granularity
              </span>
            </div>
          </div>

          {/* Velocity Breakdown Matrix */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg text-[#F8FAFC]">
              <span className="text-[10px] font-mono uppercase text-[#0EA5E9] block font-bold text-glow-cyan">
                Autonomous Multi-Agent Systems
              </span>
              <span className="mt-1 text-lg font-mono font-bold text-[#F8FAFC]">184,500 Vol</span>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Grew from 12.4k to 184.5k over 24 hours (+1,380% absolute growth) driven by GitHub repo releases and social demos.
              </p>
            </div>

            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg text-[#F8FAFC]">
              <span className="text-[10px] font-mono uppercase text-[#10B981] block font-bold text-glow-emerald">
                Room-Temp Superconductors
              </span>
              <span className="mt-1 text-lg font-mono font-bold text-[#F8FAFC]">92,400 Vol</span>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Volumetric surge following pre-print replication claims. High initial velocity now entering secondary verification phase.
              </p>
            </div>

            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg text-[#F8FAFC]">
              <span className="text-[10px] font-mono uppercase text-[#8B5CF6] block font-bold">
                Open-Weight Reasoning Models
              </span>
              <span className="mt-1 text-lg font-mono font-bold text-[#F8FAFC]">152,000 Vol</span>
              <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
                Steady quadratic acceleration with sustained developer engagement across Twitter and Reddit developer forums.
              </p>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155] text-xs">
            <button
              onClick={() => handleSubTabChange('trends')}
              className="font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              ← Back to Viral Topics
            </button>
            <button
              onClick={() => handleSubTabChange('sentiment')}
              className="flex items-center gap-1 font-bold text-[#0EA5E9] hover:text-glow-cyan"
            >
              <span>Next: Inspect Sentiment Analysis</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: SENTIMENT BREAKDOWN ================= */}
      {activeSubTab === 'sentiment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Overall Pie Breakdown (5 cols) */}
            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg lg:col-span-5 text-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <PieIcon className="h-4 w-4 text-[#0EA5E9]" />
                <span>
                  <TermTooltip termKey="sentimentDistribution">Aggregated Sentiment Proportions</TermTooltip>
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Sentiment polarity extracted across all monitored social media packets
              </p>

              <div className="mt-4 h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1E293B',
                        borderColor: '#0EA5E9',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#F8FAFC',
                        boxShadow: '0 0 15px rgba(14, 165, 233, 0.25)',
                      }}
                      formatter={(val: any) => [`${val}%`, 'Share']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="space-y-2 pt-3 border-t border-[#334155] text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]/60 border border-[#10B981]/30">
                  <span className="flex items-center gap-2 text-[#10B981] font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
                    <TermTooltip termKey="sentimentPolarity">Positive &amp; Optimistic</TermTooltip>
                  </span>
                  <span className="font-mono font-bold text-[#10B981] text-glow-emerald">{avgPositive}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]/60 border border-[#0EA5E9]/30">
                  <span className="flex items-center gap-2 text-[#0EA5E9] font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0EA5E9] shadow-[0_0_6px_#0EA5E9]"></span>
                    <TermTooltip termKey="sentimentPolarity">Neutral &amp; Informational</TermTooltip>
                  </span>
                  <span className="font-mono font-bold text-[#0EA5E9] text-glow-cyan">{avgNeutral}%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D1117]/60 border border-[#EF4444]/30">
                  <span className="flex items-center gap-2 text-[#EF4444] font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]"></span>
                    <TermTooltip termKey="sentimentPolarity">Skeptical &amp; Critical</TermTooltip>
                  </span>
                  <span className="font-mono font-bold text-[#EF4444] text-glow-crimson">{avgNegative}%</span>
                </div>
              </div>
            </div>

            {/* Right: Per-Trend Sentiment Score Leaderboard (7 cols) */}
            <div className="rounded-xl border border-[#334155] bg-[#1E293B] p-5 shadow-lg lg:col-span-7 text-[#F8FAFC]">
              <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0EA5E9]" />
                <span>
                  <TermTooltip termKey="sentimentPolarity">Sentiment Polarity by Topic Entity</TermTooltip>
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1">
                Comparative sentiment distribution and net score (-1.00 skeptical to +1.00 optimistic)
              </p>

              <div className="mt-4 space-y-3">
                {trends.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-[#334155] bg-[#0D1117]/60 p-3.5 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F8FAFC]">{t.name}</span>
                        <span className="text-[10px] font-mono text-[#94A3B8]">
                          {t.category}
                        </span>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                          t.sentimentScore > 0.3
                            ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                            : t.sentimentScore < -0.2
                            ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                            : 'bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30'
                        }`}
                      >
                        Net: {t.sentimentScore > 0 ? '+' : ''}
                        {t.sentimentScore.toFixed(2)}
                      </span>
                    </div>

                    {/* Proportional Sentiment Bar */}
                    <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#0D1117]">
                      <div
                        style={{ width: `${t.sentimentBreakdown.positive}%` }}
                        className="bg-[#10B981]"
                        title={`Positive: ${t.sentimentBreakdown.positive}%`}
                      />
                      <div
                        style={{ width: `${t.sentimentBreakdown.neutral}%` }}
                        className="bg-[#0EA5E9]"
                        title={`Neutral: ${t.sentimentBreakdown.neutral}%`}
                      />
                      <div
                        style={{ width: `${t.sentimentBreakdown.negative}%` }}
                        className="bg-[#EF4444]"
                        title={`Negative: ${t.sentimentBreakdown.negative}%`}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#10B981]">+{t.sentimentBreakdown.positive}% Pos</span>
                      <span className="text-[#0EA5E9]">{t.sentimentBreakdown.neutral}% Neu</span>
                      <span className="text-[#EF4444]">-{t.sentimentBreakdown.negative}% Neg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155] text-xs">
            <button
              onClick={() => handleSubTabChange('volume')}
              className="font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              ← Back to Velocity Charts
            </button>
            <button
              onClick={() => handleSubTabChange('radar')}
              className="flex items-center gap-1 font-bold text-[#0EA5E9] hover:text-glow-cyan"
            >
              <span>Next: Inspect Burst Anomaly Radar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: BURST ANOMALY RADAR ================= */}
      {activeSubTab === 'radar' && (
        <div className="space-y-5">
          {/* Radar Header & Outlier Filter */}
          <div className="rounded-xl border border-[#EF4444]/40 bg-[#1E293B] p-5 shadow-[0_0_20px_rgba(239,68,68,0.15)] text-[#F8FAFC]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0D1117] text-[#EF4444] border border-[#EF4444]/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
                  <Flame className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      Burst Frequency Outlier Diagnostic
                    </h3>
                    <span className="rounded-full bg-[#0D1117]/70 border border-[#EF4444]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#EF4444] text-glow-crimson">
                      <TermTooltip termKey="poissonDivergence">Poisson Divergence (z &gt; 3.0)</TermTooltip>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#94A3B8]">
                    Flagged when real-time volumetric token velocity surpasses 3 standard deviations from baseline rolling window.
                  </p>
                </div>
              </div>

              {/* Action Button to Open Stream Engine */}
              <button
                id="btn-inspect-stream-engine"
                onClick={onOpenSimulation}
                className="flex items-center gap-2 rounded-lg bg-[#0EA5E9] hover:bg-[#38BDF8] px-4 py-2 text-xs font-bold text-[#0D1117] transition-all shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.3)]"
              >
                <Radio className="h-4 w-4" />
                <span>Test Ingestion in Stream Engine</span>
              </button>
            </div>

            {/* Severity Filter Tabs */}
            <div className="mt-4 flex items-center gap-2 pt-3 border-t border-[#334155]">
              <span className="text-[11px] font-mono text-[#F8FAFC] uppercase">Filter Severity:</span>
              <button
                onClick={() => setAnomalyFilter('all')}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                  anomalyFilter === 'all'
                    ? 'bg-[#0EA5E9] text-[#0D1117] font-bold shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                    : 'bg-[#0D1117]/60 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]'
                }`}
              >
                All Outliers ({anomalies.length})
              </button>
              <button
                onClick={() => setAnomalyFilter('critical')}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                  anomalyFilter === 'critical'
                    ? 'bg-[#EF4444] text-[#F8FAFC] font-bold shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                    : 'bg-[#0D1117]/60 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]'
                }`}
              >
                Critical (Burst &gt; 4.5x)
              </button>
              <button
                onClick={() => setAnomalyFilter('high')}
                className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
                  anomalyFilter === 'high'
                    ? 'bg-[#0EA5E9] text-[#0D1117] font-bold shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                    : 'bg-[#0D1117]/60 text-[#94A3B8] hover:text-[#F8FAFC] border border-[#334155]'
                }`}
              >
                High Velocity (Burst &gt; 3.0x)
              </button>
            </div>
          </div>

          {/* Anomaly Outlier Cards List */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAnomalies.map((anom) => (
              <div
                key={anom.id}
                className="rounded-xl border border-[#334155] bg-[#1E293B] p-4 shadow-lg transition-all hover:border-[#EF4444]/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] text-[#F8FAFC]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                        anom.severity === 'critical'
                          ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/40 shadow-[0_0_8px_rgba(239,68,68,0.2)] text-glow-crimson'
                          : 'bg-[#0EA5E9]/15 text-[#0EA5E9] border border-[#0EA5E9]/30'
                      }`}
                    >
                      {anom.severity} anomaly
                    </span>
                    <h4 className="mt-2 text-sm font-bold text-[#F8FAFC]">{anom.keyword}</h4>
                    <span className="text-[11px] font-mono text-[#94A3B8]">{anom.trendName}</span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-[#EF4444] text-glow-crimson block">
                      <TermTooltip termKey="burstMultiplier" underline={false}>
                        +{anom.burstMultiplier}x
                      </TermTooltip>
                    </span>
                    <span className="text-[10px] font-mono text-[#94A3B8]">
                      <TermTooltip termKey="zScore">z = {anom.zScore.toFixed(2)}</TermTooltip>
                    </span>
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-[#94A3B8] leading-relaxed">
                  {anom.summary}
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#334155] text-[10px] font-mono text-[#94A3B8]">
                  <span>Detected: {anom.detectedAt}</span>
                  <span className="uppercase text-[#0EA5E9] font-semibold">
                    Source: {anom.affectedPlatform || 'Multi-platform'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155] text-xs">
            <button
              onClick={() => handleSubTabChange('sentiment')}
              className="font-medium text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              ← Back to Sentiment Breakdown
            </button>
            <button
              onClick={onOpenSimulation}
              className="flex items-center gap-1 font-bold text-[#0EA5E9] hover:text-glow-cyan"
            >
              <span>Jump to Live Stream Engine Ingest</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
