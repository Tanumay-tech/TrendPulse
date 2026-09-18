import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Calendar,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  Printer,
  Compass,
  CheckCircle2,
  Table,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { ExecutiveReport, DetectedTrend, AnomalyAlert } from '../types';
import { TermTooltip } from './TermTooltip';

export type ReportSubTab = 'summary' | 'recommendations' | 'matrix' | 'diagnostic' | 'full';

interface ReportGeneratorViewProps {
  report: ExecutiveReport | null;
  onGenerateReport: (timeframe: string, focus: string) => Promise<void>;
  isGenerating: boolean;
  trends: DetectedTrend[];
  anomalies: AnomalyAlert[];
  initialSubTab?: ReportSubTab;
  onSubTabChange?: (tab: ReportSubTab) => void;
}

export const ReportGeneratorView: React.FC<ReportGeneratorViewProps> = ({
  report,
  onGenerateReport,
  isGenerating,
  trends,
  anomalies,
  initialSubTab = 'summary',
  onSubTabChange,
}) => {
  const [internalSubTab, setInternalSubTab] = useState<ReportSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setInternalSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const activeSubTab = internalSubTab;

  const handleSubTabChange = (tab: ReportSubTab) => {
    setInternalSubTab(tab);
    if (onSubTabChange) {
      onSubTabChange(tab);
    }
  };

  const [timeframe, setTimeframe] = useState<string>('Last 24 Hours');
  const [industryFocus, setIndustryFocus] = useState<string>('Emerging Technology & Autonomous Systems');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    onGenerateReport(timeframe, industryFocus);
  };

  const handleCopy = () => {
    if (!report) return;
    const text = `
# ${report.title}
Generated: ${new Date(report.generatedAt).toLocaleString()}
Timeframe: ${report.timeframe} | Analyzed Posts: ${report.analyzedPostCount.toLocaleString()} | Active Trends: ${report.activeTrendCount}

## Executive Summary
${report.executiveSummary}

## Emerging Signals
${report.emergingSignals.map((s) => `- **${s.signal}** (${s.growth}): ${s.impact} [Confidence: ${s.confidence}%]`).join('\n')}

## Anomaly Alert Diagnostic
${report.anomalyAnalysis}

## Strategic Recommendations
${report.strategicRecommendations.map((r) => `### [${r.priority}] ${r.action}\nRationale: ${r.rationale}`).join('\n\n')}

## Risk & Opportunity Matrix
${report.riskAndOpportunityMatrix.map((m) => `- **${m.theme}**:\n  - Opportunity: ${m.opportunity}\n  - Threat: ${m.threat}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!report) return;
    const text = `# ${report.title}\n\n${report.executiveSummary}`;
    const file = new Blob([text], { type: 'text/markdown' });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(file);
    element.download = `Executive-Trend-Report-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const subTabs = [
    {
      id: 'summary' as const,
      label: 'Executive Brief & Signals',
      badge: 'Overview',
      icon: Briefcase,
      description: 'High-level synthesis & emerging market signals',
    },
    {
      id: 'recommendations' as const,
      label: 'Strategic Directives',
      badge: `${report?.strategicRecommendations?.length || 3} Actions`,
      icon: TrendingUp,
      description: 'Prioritized actionable mandates & tactical plays',
    },
    {
      id: 'matrix' as const,
      label: 'Risk & Opportunity Matrix',
      badge: `${report?.riskAndOpportunityMatrix?.length || 3} Themes`,
      icon: Table,
      description: 'Comparative opportunities vs vulnerability threats',
    },
    {
      id: 'diagnostic' as const,
      label: 'Anomaly Diagnostic',
      badge: `${anomalies.length} Outliers`,
      badgeColor: 'bg-rose-950/60 text-rose-300 border-rose-800/60',
      icon: AlertTriangle,
      description: 'Statistical burst multipliers & outlier commentary',
    },
    {
      id: 'full' as const,
      label: 'Full Unrolled Briefing',
      badge: 'Print / Export',
      icon: FileText,
      description: 'Continuous reading view ready for markdown download',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Configuration & Generation Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#121824] p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0b0f19] border border-slate-800 text-[#38bdf8] shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#f1f5f9]">
                  <TermTooltip termKey="executiveReport">Executive AI Trend Intelligence Report Generator</TermTooltip>
                </h2>
                <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-[#94a3b8] border border-slate-700">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#94a3b8]">
                Synthesizes real-time keyword bursts, entity clustering, and anomaly scores into a decision-grade briefing.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="btn-generate-executive-report"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-[#38bdf8] hover:bg-[#7dd3fc] px-5 py-2.5 text-xs font-bold text-[#0b0f19] shadow-[0_0_12px_rgba(56,189,248,0.3)] transition-all disabled:opacity-50 shrink-0"
          >
            <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate New Briefing'}</span>
          </button>
        </div>

        {/* Configuration Filters */}
        <div className="mt-4 grid grid-cols-1 gap-3 pt-3 border-t border-slate-800 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-[#94a3b8] block mb-1">
              Time Horizon Observation Window
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#0b0f19] px-3 py-1.5 text-xs text-[#f1f5f9] focus:border-[#38bdf8] focus:outline-none"
            >
              <option value="Last 24 Hours">Last 24 Hours (High Sensitivity)</option>
              <option value="Last 7 Days">Last 7 Days (Tactical Momentum)</option>
              <option value="Last 30 Days">Last 30 Days (Macro Paradigm Shifts)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-medium text-[#94a3b8] block mb-1">
              Target Strategic Domain Focus
            </label>
            <select
              value={industryFocus}
              onChange={(e) => setIndustryFocus(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-[#0b0f19] px-3 py-1.5 text-xs text-[#f1f5f9] focus:border-[#38bdf8] focus:outline-none"
            >
              <option value="Emerging Technology & Autonomous Systems">
                Emerging Technology & Autonomous Systems
              </option>
              <option value="Deep Tech, Physics & Clean Mobility">
                Deep Tech, Physics & Clean Mobility
              </option>
              <option value="Consumer Hardware & XR Ecosystems">
                Consumer Hardware & XR Ecosystems
              </option>
              <option value="Cross-Platform Social Sentiment & Viral Media">
                Cross-Platform Social Sentiment & Viral Media
              </option>
            </select>
          </div>
        </div>
      </div>

      {report && (
        <>
          {/* Report Top Meta & Export Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1">
            <div className="flex items-center gap-2 text-xs text-[#94a3b8]">
              <span className="rounded bg-[#0b0f19] border border-slate-700 px-2 py-0.5 font-mono text-[10px] text-[#38bdf8]">
                REPORT #{report.id}
              </span>
              <span>•</span>
              <span className="font-mono text-[11px]">
                Sampled: {report.analyzedPostCount.toLocaleString()} posts
              </span>
              <span>•</span>
              <span className="text-[11px]">Timeframe: {report.timeframe}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121824] px-3 py-1.5 text-xs font-medium text-[#f1f5f9] hover:bg-[#1e293b] transition-colors"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Brief'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#121824] px-3 py-1.5 text-xs font-medium text-[#f1f5f9] hover:bg-[#1e293b] transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="rounded-xl border border-slate-800 bg-[#121824] p-1.5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {subTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      id={`report-subtab-${tab.id}`}
                      onClick={() => handleSubTabChange(tab.id)}
                      className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#0b0f19] text-[#f1f5f9] font-bold border border-slate-700 shadow-sm'
                          : 'text-[#94a3b8] hover:bg-[#0b0f19]/60 hover:text-[#f1f5f9]'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#38bdf8]' : 'text-[#64748b]'}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`rounded border px-1.5 py-0.2 text-[10px] font-mono ${
                          isActive
                            ? 'bg-[#121824] text-[#38bdf8] border-slate-700'
                            : tab.badgeColor || 'bg-[#0b0f19] text-[#94a3b8] border-slate-800'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs text-[#94a3b8] pr-2">
                <span className="text-[11px] font-mono">
                  {subTabs.find((t) => t.id === activeSubTab)?.description}
                </span>
              </div>
            </div>
          </div>

          {/* ================= SUB-TAB 1: EXECUTIVE BRIEF & SIGNALS ================= */}
          {activeSubTab === 'summary' && (
            <div className="space-y-6">
              {/* Executive Summary Card */}
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-6 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>Strategic Executive Summary</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Decision-Grade Synthesis</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200 bg-[#101724] p-4 rounded-xl border border-slate-800/80">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Emerging Trend Signals */}
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Key Emerging Signals & Acceleration</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Cross-Platform Verification</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {report.emergingSignals.map((signal, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/90 bg-[#101724] p-4 flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-100 text-xs">{signal.signal}</span>
                          <span className="rounded bg-emerald-950/80 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-300 border border-emerald-800/60">
                            {signal.growth}
                          </span>
                        </div>
                        <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                          {signal.impact}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2.5 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                        <span>
                          <TermTooltip termKey="confidenceIndex">Confidence Index</TermTooltip>
                        </span>
                        <span className="text-sky-400 font-bold">{signal.confidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  <TermTooltip termKey="confidenceIndex">Confidence scores derived from cross-platform consensus.</TermTooltip>
                </span>
                <button
                  onClick={() => handleSubTabChange('recommendations')}
                  className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Next: View Strategic Directives</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= SUB-TAB 2: STRATEGIC DIRECTIVES ================= */}
          {activeSubTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>Actionable Strategic Directives & Playbooks</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Tiered Execution Priority</span>
                </div>

                <div className="space-y-3">
                  {report.strategicRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/90 bg-[#101724] p-4 space-y-2 hover:border-slate-700/80 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                          <span>{rec.action}</span>
                        </h4>
                        <span
                          className={`rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0 border ${
                            rec.priority === 'Immediate Action'
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : rec.priority === 'High Opportunity'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                              : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                          }`}
                        >
                          {rec.priority}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed pl-6">
                        {rec.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => handleSubTabChange('summary')}
                  className="font-medium text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Executive Brief & Signals
                </button>
                <button
                  onClick={() => handleSubTabChange('matrix')}
                  className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Next: View Risk & Opportunity Matrix</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= SUB-TAB 3: RISK & OPPORTUNITY MATRIX ================= */}
          {activeSubTab === 'matrix' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Table className="h-4 w-4" />
                    <span>Market Dynamics: Opportunities vs Structural Vulnerabilities</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Domain Factorization</span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {report.riskAndOpportunityMatrix.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800/90 bg-[#101724] p-5 space-y-3 flex flex-col justify-between"
                    >
                      <h4 className="text-sm font-bold text-slate-100 border-b border-slate-800/80 pb-2">
                        {item.theme}
                      </h4>

                      <div className="space-y-2.5 text-xs">
                        <div className="rounded-lg bg-emerald-950/20 border border-emerald-800/30 p-3">
                          <span className="font-bold text-emerald-400 uppercase text-[10px] block mb-1">
                            Primary Market Opportunity
                          </span>
                          <p className="text-slate-300 leading-relaxed">{item.opportunity}</p>
                        </div>

                        <div className="rounded-lg bg-rose-950/20 border border-rose-800/30 p-3">
                          <span className="font-bold text-rose-400 uppercase text-[10px] block mb-1">
                            Structural Threat / Vulnerability
                          </span>
                          <p className="text-slate-300 leading-relaxed">{item.threat}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => handleSubTabChange('recommendations')}
                  className="font-medium text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Strategic Directives
                </button>
                <button
                  onClick={() => handleSubTabChange('diagnostic')}
                  className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Next: View Anomaly Diagnostic</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= SUB-TAB 4: ANOMALY DIAGNOSTIC ================= */}
          {activeSubTab === 'diagnostic' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-rose-900/30 bg-[#17131b] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      <TermTooltip termKey="anomalyAlert">Anomaly Alert</TermTooltip> & Outlier Diagnostic
                    </span>
                  </h3>
                  <span className="text-[10px] font-mono text-rose-300">
                    <TermTooltip termKey="zScore">z-score &gt; 3.0 Standard Variance</TermTooltip>
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-slate-200 bg-[#121824] p-4 rounded-xl border border-rose-900/30">
                  {report.anomalyAnalysis}
                </p>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                  {anomalies.map((anom) => (
                    <div
                      key={anom.id}
                      className="rounded-xl border border-rose-800/40 bg-[#131926] p-4 text-xs space-y-2 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-200">{anom.keyword}</span>
                        <span className="font-mono text-rose-400 font-bold">
                          <TermTooltip termKey="burstFrequency">+{anom.burstMultiplier}x</TermTooltip>
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{anom.summary}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
                        <span>
                          <TermTooltip termKey="zScore">z = {anom.zScore.toFixed(2)}</TermTooltip>
                        </span>
                        <span>{anom.detectedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
                <button
                  onClick={() => handleSubTabChange('matrix')}
                  className="font-medium text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Risk & Opportunity Matrix
                </button>
                <button
                  onClick={() => handleSubTabChange('full')}
                  className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>Next: View Full Unrolled Briefing</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= SUB-TAB 5: FULL UNROLLED BRIEFING ================= */}
          {activeSubTab === 'full' && (
            <div className="rounded-2xl border border-slate-800/90 bg-[#111723] p-6 sm:p-8 shadow-sm space-y-8">
              {/* Document Header */}
              <div className="border-b border-slate-800/80 pb-6">
                <span className="rounded bg-sky-950/80 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300 border border-sky-800/60">
                  COMPLETE EXECUTIVE DOSSIER
                </span>
                <h1 className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {report.title}
                </h1>
                <p className="mt-1 text-xs text-slate-400 font-mono">
                  Generated: {new Date(report.generatedAt).toLocaleString()} • ID: {report.id}
                </p>
              </div>

              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  1. Strategic Executive Summary
                </h3>
                <p className="text-sm leading-relaxed text-slate-200 bg-[#131926] p-4 rounded-xl border border-slate-800/80">
                  {report.executiveSummary}
                </p>
              </div>

              {/* 2. Emerging Signals */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  2. Key Emerging Signals
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {report.emergingSignals.map((s, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800/80 bg-[#131926] p-3.5 text-xs">
                      <div className="flex items-center justify-between font-bold text-white">
                        <span>{s.signal}</span>
                        <span className="text-emerald-400">{s.growth}</span>
                      </div>
                      <p className="mt-2 text-slate-300 leading-relaxed">{s.impact}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Anomaly Analysis */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  3. Anomaly Alert Diagnostic
                </h3>
                <p className="text-xs leading-relaxed text-slate-200 bg-rose-950/20 border border-rose-900/30 p-4 rounded-xl">
                  {report.anomalyAnalysis}
                </p>
              </div>

              {/* 4. Recommendations */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  4. Actionable Directives
                </h3>
                <div className="space-y-2">
                  {report.strategicRecommendations.map((r, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800/80 bg-[#131926] p-3.5 text-xs">
                      <span className="font-bold text-white block">[{r.priority}] {r.action}</span>
                      <p className="mt-1 text-slate-300 leading-relaxed">{r.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Matrix */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  5. Risk & Opportunity Matrix
                </h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {report.riskAndOpportunityMatrix.map((m, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-800/80 bg-[#131926] p-3.5 text-xs">
                      <span className="font-bold text-white block mb-2">{m.theme}</span>
                      <p className="text-emerald-300 mb-1.5"><strong className="text-emerald-400">Opp:</strong> {m.opportunity}</p>
                      <p className="text-rose-300"><strong className="text-rose-400">Threat:</strong> {m.threat}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
