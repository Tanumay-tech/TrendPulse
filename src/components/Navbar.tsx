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
  Menu,
  X,
  RotateCcw,
  ChevronRight,
  SlidersHorizontal,
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
  onLogoClick?: () => void;
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
  onLogoClick,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Trend Dashboard',
      shortLabel: 'Dashboard',
      description: 'Viral entities, velocity charts, sentiment, & burst radar',
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
      description: 'Real-time multi-platform firehose & post ingestion',
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
      description: '2D vector projection canvas & TF-IDF token matrices',
      badge: `${clusterCount}`,
      badgeColor: 'bg-[#0D1117] text-[#0EA5E9] border-[#0EA5E9]/30',
      icon: Network,
    },
    {
      id: 'report' as const,
      label: 'Executive Report',
      shortLabel: 'Report',
      description: 'AI-synthesized research briefs & strategic matrices',
      badge: 'AI',
      badgeColor: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/30',
      icon: FileText,
    },
  ];

  const handleHomeLogoClick = () => {
    onLogoClick?.();
    setIsMobileMenuOpen(false);
  };

  const handleSelectTab = (tabId: 'dashboard' | 'simulation' | 'clusters' | 'report') => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#334155]/80 bg-[#0D1117]/95 backdrop-blur-md">
        {/* Full Width Layout with light side padding */}
        <div className="w-full max-w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-2.5">
          
          {/* ================= ZONE 1: BRANDING & SYSTEM STATUS (Acts as Home Button) ================= */}
          <button
            id="btn-nav-home-logo"
            onClick={handleHomeLogoClick}
            className="group flex items-center gap-2.5 sm:gap-3 shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0EA5E9] rounded-xl p-1 -m-1 transition-all"
            aria-label="TrendPulse-AI Home - Return to Trend Dashboard & Reset Filters"
            title="TrendPulse-AI Home - Return to Trend Dashboard & Reset Filters"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E293B] border border-[#334155] text-[#0EA5E9] shadow-[0_0_12px_rgba(14,165,233,0.25)] group-hover:border-[#0EA5E9]/60 group-hover:shadow-[0_0_16px_rgba(14,165,233,0.4)] transition-all">
              <Activity className="h-4 w-4 drop-shadow-[0_0_6px_#0EA5E9] group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#F8FAFC] group-hover:text-white transition-colors">
                Trend<span className="text-[#0EA5E9] text-glow-cyan">Pulse</span>-AI
              </span>
              {/* Single compact glowing status dot & LIVE badge */}
              <div className="hidden xs:flex items-center gap-1.5 rounded-full bg-[#1E293B] border border-[#334155] px-2 py-0.5 text-[10px] font-mono font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
                </span>
                <TermTooltip termKey="streamIngestion" underline={false}>
                  <span className="text-[#10B981] font-bold tracking-wider text-[9px]">LIVE</span>
                </TermTooltip>
              </div>
            </div>
          </button>

          {/* ================= ZONE 2: MAIN VIEW SWITCHER (Desktop `lg:` and up) ================= */}
          <nav
            aria-label="Main Navigation Tabs"
            className="hidden lg:flex items-center gap-1 rounded-xl border border-[#334155] bg-[#1E293B] p-1 shadow-inner"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0EA5E9] text-[#0D1117] font-bold shadow-[0_0_14px_rgba(14,165,233,0.35)]'
                      : 'text-[#94A3B8] hover:bg-[#243247] hover:text-[#F8FAFC]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0D1117]' : 'text-[#94A3B8]'}`} />
                  <span>{tab.label}</span>

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
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Streaming Status & Toggle Button - Always visible on mobile & desktop */}
            <button
              id="btn-toggle-streaming"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
                isStreaming
                  ? 'border-[#10B981]/50 bg-[#10B981] text-[#0D1117] shadow-[0_0_14px_rgba(16,185,129,0.35)] hover:bg-[#34d399]'
                  : 'border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:bg-[#243247] hover:text-[#F8FAFC]'
              }`}
              title={isStreaming ? 'Click to Pause Stream Ingestion' : 'Click to Resume Stream Ingestion'}
            >
              <Zap className={`h-3.5 w-3.5 ${isStreaming ? 'text-[#0D1117]' : 'text-[#94A3B8]'}`} />
              <span className="text-[11px] font-mono font-bold whitespace-nowrap">
                <span className="hidden sm:inline">Ingest: </span>
                {isStreaming ? 'ACTIVE' : 'PAUSED'}
              </span>
            </button>

            {/* Desktop-Only Auxiliary Controls */}
            <div className="hidden lg:flex items-center gap-1 rounded-lg border border-[#334155] bg-[#1E293B] p-1">
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

            {/* Mobile Hamburger Menu Toggle Button (< lg) */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg border border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:text-[#0EA5E9] hover:border-[#0EA5E9]/50 transition-all focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 text-[#0EA5E9]" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SLIDE-OUT DRAWER / MODAL (< lg) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto flex h-full w-4/5 max-w-sm flex-col border-l border-[#334155] bg-[#0D1117] p-5 shadow-2xl z-10 animate-in slide-in-from-right duration-250">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#334155]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E293B] border border-[#334155] text-[#0EA5E9]">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold text-[#F8FAFC]">
                  Navigation &amp; Controls
                </span>
              </div>
              <button
                id="btn-close-mobile-menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#334155] bg-[#1E293B] text-[#94A3B8] hover:text-[#F8FAFC]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Home / Reset Action */}
            <div className="mt-4">
              <button
                onClick={handleHomeLogoClick}
                className="flex w-full items-center justify-between rounded-xl border border-[#0EA5E9]/30 bg-[#0EA5E9]/10 px-3.5 py-2.5 text-xs font-bold text-[#0EA5E9] hover:bg-[#0EA5E9]/20 transition-all"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Return to Main Dashboard</span>
                </span>
                <span className="rounded bg-[#0EA5E9]/20 px-1.5 py-0.5 text-[10px] font-mono">
                  Reset Filters
                </span>
              </button>
            </div>

            {/* Navigation Tab Links */}
            <div className="mt-5 space-y-2 flex-1 overflow-y-auto">
              <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider block px-1">
                Platform Views
              </span>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={`mobile-drawer-${tab.id}`}
                    onClick={() => handleSelectTab(tab.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? 'border-[#0EA5E9]/50 bg-[#1E293B] text-[#F8FAFC] shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                        : 'border-[#334155]/60 bg-[#1E293B]/40 text-[#94A3B8] hover:border-[#334155] hover:text-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isActive
                            ? 'bg-[#0EA5E9] text-[#0D1117]'
                            : 'bg-[#0D1117] text-[#94A3B8] border border-[#334155]'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isActive ? 'text-[#0EA5E9]' : 'text-[#F8FAFC]'
                            }`}
                          >
                            {tab.label}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#94A3B8] line-clamp-1">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold ${tab.badgeColor}`}
                    >
                      {tab.badge}
                    </span>
                  </button>
                );
              })}

              {/* Mobile Auxiliary Tools */}
              <div className="mt-6 pt-4 border-t border-[#334155] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#94A3B8] tracking-wider block px-1">
                  Diagnostics &amp; System
                </span>

                {onOpenShortcuts && (
                  <button
                    onClick={() => {
                      onOpenShortcuts();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-[#334155] bg-[#1E293B]/60 px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <span className="flex items-center gap-2">
                      <Keyboard className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      Keyboard Shortcuts
                    </span>
                    <span className="font-mono text-[10px] text-[#0EA5E9]">?</span>
                  </button>
                )}

                {onOpenHelp && (
                  <button
                    onClick={() => {
                      onOpenHelp();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-[#334155] bg-[#1E293B]/60 px-3 py-2 text-xs text-[#94A3B8] hover:text-[#F8FAFC]"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-3.5 w-3.5 text-[#0EA5E9]" />
                      Technical Reference &amp; AI Guide
                    </span>
                    <ChevronRight className="h-3 w-3 text-[#94A3B8]" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer System Status */}
            <div className="mt-4 pt-3 border-t border-[#334155] text-[11px] text-[#94A3B8] flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono">
                <span className="h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]"></span>
                Gemini 3.8 Flash
              </span>
              <span className="font-mono text-[10px] text-[#0EA5E9]">v3.8 Prod</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= COMPACT BOTTOM NAVIGATION BAR (< lg) ================= */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[#334155] bg-[#0D1117]/95 backdrop-blur-md px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-4 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={`mobile-bottom-${tab.id}`}
                id={`btn-bottom-nav-${tab.id}`}
                onClick={() => handleSelectTab(tab.id)}
                className={`min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl py-1 px-1 transition-all ${
                  isActive
                    ? 'bg-[#1E293B] text-[#0EA5E9] font-bold shadow-[0_0_12px_rgba(14,165,233,0.25)] border border-[#0EA5E9]/40'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/40 border border-transparent'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-[#0EA5E9] drop-shadow-[0_0_4px_#0EA5E9]' : 'text-[#94A3B8]'
                    }`}
                  />
                  {tab.id === 'dashboard' && anomalyCount > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-2 w-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]" />
                  )}
                  {tab.id === 'simulation' && isStreaming && (
                    <span className="absolute -top-1 -right-2 flex h-2 w-2 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                  )}
                </div>
                <span className="text-[10px] font-semibold tracking-tight truncate max-w-full">
                  {tab.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
