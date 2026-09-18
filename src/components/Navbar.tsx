import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Network,
  FileText,
  Zap,
  HelpCircle,
  Keyboard,
  Settings,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { TermTooltip } from './TermTooltip';

interface NavbarProps {
  activeTab: 'dashboard' | 'simulation' | 'clusters' | 'report';
  setActiveTab: (tab: 'dashboard' | 'simulation' | 'clusters' | 'report') => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  anomalyCount: number;
  trendsCount?: number;
  clusterCount?: number;
  hasGeminiKey?: boolean;
  onOpenHelp?: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  anomalyCount,
  trendsCount = 10,
  clusterCount = 4,
  hasGeminiKey = true,
  onOpenHelp,
  onOpenShortcuts,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Trend Dashboard',
      shortLabel: 'Dashboard',
      badge: anomalyCount > 0 ? `${anomalyCount} alerts` : `${trendsCount}`,
      badgeColor:
        anomalyCount > 0
          ? 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
          : 'bg-[#0D1117] text-[#94A3B8] border-[#334155]',
      icon: Activity,
    },
    {
      id: 'simulation' as const,
      label: 'Stream Pipeline',
      shortLabel: 'Pipeline',
      badge: isStreaming ? 'Live' : 'Paused',
      badgeColor: isStreaming
        ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40'
        : 'bg-[#0D1117] text-[#94A3B8] border-[#334155]',
      icon: Radio,
    },
    {
      id: 'clusters' as const,
      label: 'Semantic Clusters',
      shortLabel: 'Clusters',
      badge: `${clusterCount}`,
      badgeColor: 'bg-[#0D1117] text-[#0EA5E9] border-[#0EA5E9]/30',
      icon: Network,
    },
    {
      id: 'report' as const,
      label: 'Executive Report',
      shortLabel: 'Report',
      badge: 'AI',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30',
      icon: FileText,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#334155]/80 bg-[#0D1117]/95 backdrop-blur-md">
      {/* 3-Zone Flex Layout - Full Width with light side padding */}
      <div className="w-full flex items-center justify-between px-6 py-2.5 sm:px-8">
        
        {/* ================= ZONE 1: BRANDING & SYSTEM STATUS ================= */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E293B] border border-[#334155] text-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.25)]">
            <Activity className="h-4 w-4 drop-shadow-[0_0_6px_#0EA5E9]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-[#F8FAFC]">
              Trend<span className="text-[#0EA5E9] text-glow-cyan">Pulse</span>-AI
            </span>
            {/* Single compact glowing status dot & LIVE badge */}
            <div className="flex items-center gap-1.5 rounded-full bg-[#1E293B] border border-[#334155] px-2 py-0.5 text-[10px] font-mono font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
              </span>
              <TermTooltip termKey="streamIngestion" underline={false}>
                <span className="text-[#10B981] font-bold tracking-wider text-[9px]">LIVE</span>
              </TermTooltip>
            </div>
          </div>
        </div>

        {/* ================= ZONE 2: MAIN VIEW SWITCHER ================= */}
        <nav
          aria-label="Main Navigation Tabs"
          className="flex items-center gap-1 rounded-xl border border-[#334155] bg-[#1E293B] p-1 shadow-inner"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0EA5E9] text-[#0D1117] font-bold shadow-[0_0_14px_rgba(14,165,233,0.35)]'
                    : 'text-[#94A3B8] hover:bg-[#243247] hover:text-[#F8FAFC]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0D1117]' : 'text-[#94A3B8]'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {/* Inline Badge */}
                <span
                  className={`rounded border px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                    isActive
                      ? 'bg-[#0D1117]/20 text-[#0D1117] border-[#0D1117]/30'
                      : tab.badgeColor
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ================= ZONE 3: SYSTEM CONTROLS & INGESTION TRIGGER ================= */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Combined Stream Status & Toggle Button */}
          <button
            id="btn-toggle-streaming"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
              isStreaming
                ? 'border-[#10B981]/50 bg-[#10B981] text-[#0D1117] shadow-[0_0_14px_rgba(16,185,129,0.35)] hover:bg-[#34d399]'
                : 'border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:bg-[#243247] hover:text-[#F8FAFC]'
            }`}
            title={isStreaming ? 'Click to Pause Stream Ingestion' : 'Click to Resume Stream Ingestion'}
          >
            <Zap className={`h-3.5 w-3.5 ${isStreaming ? 'text-[#0D1117]' : 'text-[#94A3B8]'}`} />
            <span className="text-[11px] font-mono font-bold">
              {isStreaming ? 'Ingest: ACTIVE' : 'Ingest: PAUSED'}
            </span>
          </button>

          {/* Collapsed Auxiliary Controls: Clean Icon-Only Button Bar */}
          <div className="flex items-center gap-1 rounded-lg border border-[#334155] bg-[#1E293B] p-1">
            {onOpenShortcuts && (
              <button
                id="btn-keyboard-shortcuts"
                onClick={onOpenShortcuts}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#243247] hover:text-[#0EA5E9] transition-all"
                title="Keyboard Shortcuts (?)"
              >
                <Keyboard className="h-4 w-4" />
              </button>
            )}

            {onOpenHelp && (
              <button
                id="btn-help-guide"
                onClick={onOpenHelp}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#243247] hover:text-[#0EA5E9] transition-all"
                title="AI Copilot & Technical Guide"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            )}

            {/* Quick Settings Popover */}
            <div className="relative">
              <button
                id="btn-settings-dropdown"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[#94A3B8] hover:bg-[#243247] hover:text-[#0EA5E9] transition-all ${
                  isSettingsOpen ? 'bg-[#243247] text-[#0EA5E9]' : ''
                }`}
                title="System Settings & Engine Status"
              >
                <Settings className="h-4 w-4" />
              </button>

              {isSettingsOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-[#334155] bg-[#1E293B] p-3 shadow-2xl z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setIsSettingsOpen(false)}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
                    <span className="text-xs font-bold text-[#F8FAFC]">System Configuration</span>
                    <span className="text-[10px] font-mono text-[#0EA5E9]">v3.8 Production</span>
                  </div>

                  <div className="mt-2 space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 text-[#94A3B8]">
                      <span>Theme System</span>
                      <span className="flex items-center gap-1 font-mono text-[11px] text-[#F8FAFC]">
                        <span className="h-2 w-2 rounded-full bg-[#0EA5E9]"></span>
                        Midnight Slate
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-[#94A3B8]">
                      <span>Gemini 3.8 Flash</span>
                      <span className="flex items-center gap-1 font-mono text-[10px] text-[#10B981]">
                        <ShieldCheck className="h-3 w-3" />
                        Connected
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-[#94A3B8]">
                      <span>Telemetry Engine</span>
                      <span className="font-mono text-[10px] text-[#0EA5E9]">Active (150 ms)</span>
                    </div>

                    <div className="flex items-center justify-between py-1 text-[#94A3B8]">
                      <span>Math Explainability</span>
                      <span className="font-mono text-[10px] text-[#10B981]">Enabled</span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#334155] flex justify-end">
                    <button
                      onClick={() => setIsSettingsOpen(false)}
                      className="rounded bg-[#0D1117] border border-[#334155] px-2.5 py-1 text-[10px] font-semibold text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
