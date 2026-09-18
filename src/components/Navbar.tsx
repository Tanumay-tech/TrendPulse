import React from 'react';
import { Activity, Flame, Network, FileText, Radio, Zap, Sparkles, ChevronRight, HelpCircle, Keyboard } from 'lucide-react';
import { TermTooltip } from './TermTooltip';

interface NavbarProps {
  activeTab: 'dashboard' | 'simulation' | 'clusters' | 'report';
  setActiveTab: (tab: 'dashboard' | 'simulation' | 'clusters' | 'report') => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  anomalyCount: number;
  hasGeminiKey: boolean;
  onOpenHelp?: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  anomalyCount,
  hasGeminiKey,
  onOpenHelp,
  onOpenShortcuts,
}) => {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modLabel = isMac ? '⌘' : 'Ctrl+';

  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Trend Dashboard',
      shortLabel: 'Dashboard',
      icon: Activity,
      badge: anomalyCount > 0 ? `${anomalyCount} alerts` : null,
      badgeColor: 'bg-[#FF4500]/20 text-[#FF4500] border-[#FF4500]/50 shadow-[0_0_8px_rgba(255,69,0,0.3)]',
      description: 'Overview, charts & anomaly radar',
      shortcutNumber: '1',
    },
    {
      id: 'simulation' as const,
      label: 'Stream Pipeline',
      shortLabel: 'Stream Engine',
      icon: Radio,
      badge: isStreaming ? 'Live' : 'Paused',
      badgeColor: isStreaming
        ? 'bg-[#2FFF73]/20 text-[#2FFF73] border-[#2FFF73]/50 shadow-[0_0_8px_rgba(47,255,115,0.3)]'
        : 'bg-[#8A7F73]/30 text-[#AFA69D] border-[#F2EFEA]/20',
      description: 'Firehose ingest & Gemini NLP',
      shortcutNumber: '2',
    },
    {
      id: 'clusters' as const,
      label: 'Semantic Clusters',
      shortLabel: 'Clustering',
      icon: Network,
      badge: '4 Clusters',
      badgeColor: 'bg-[#00F2FE]/20 text-[#00F2FE] border-[#00F2FE]/50 shadow-[0_0_8px_rgba(0,242,254,0.25)]',
      description: '2D vector topology & entities',
      shortcutNumber: '3',
    },
    {
      id: 'report' as const,
      label: 'Executive Report',
      shortLabel: 'AI Report',
      icon: FileText,
      badge: 'Gemini AI',
      badgeColor: 'bg-[#8A7F73]/40 text-[#F2EFEA] border-[#F2EFEA]/20',
      description: 'Strategic intelligence briefing',
      shortcutNumber: '4',
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#F2EFEA]/20 bg-[#161616]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand & Engine Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8A7F73] border border-[#F2EFEA]/20 text-[#00F2FE] shadow-[0_0_12px_rgba(0,242,254,0.3)]">
            <Activity className="h-4 w-4 drop-shadow-[0_0_6px_#00F2FE]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-[#F2EFEA]">
                Trend<span className="text-[#00F2FE] text-glow-aqua">Pulse</span>
              </span>
              <span className="hidden rounded bg-[#8A7F73]/30 px-1.5 py-0.5 text-[9px] font-mono font-semibold tracking-wider text-[#AFA69D] border border-[#F2EFEA]/20 sm:inline-block">
                TECH-GOTH v2.5
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#AFA69D]">
              <span className="flex items-center gap-1 font-mono text-[10px] text-[#2FFF73]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2FFF73] opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#2FFF73] shadow-[0_0_6px_#2FFF73]"></span>
                </span>
                <TermTooltip termKey="streamIngestion" underline={false}>
                  <span className="text-glow-lime font-bold">LIVE INGESTION</span>
                </TermTooltip>
              </span>
              <span className="text-[#8A7F73]">•</span>
              <span className="hidden items-center gap-1 font-mono text-[10px] text-[#AFA69D] md:flex">
                <Sparkles className="h-2.5 w-2.5 text-[#00F2FE]" />
                Gemini 3.8 Flash
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav
          aria-label="Main Module Navigation"
          className="flex items-center gap-1 rounded-xl border border-[#F2EFEA]/20 bg-[#1E1E1E] p-1 shadow-inner"
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
                    ? 'bg-[#00F2FE] text-[#111111] font-bold shadow-[0_0_15px_rgba(0,242,254,0.45)]'
                    : 'text-[#AFA69D] hover:bg-[#8A7F73]/30 hover:text-[#F2EFEA]'
                }`}
                title={tab.description}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#111111]' : 'text-[#AFA69D]'}`} />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="md:hidden">{tab.shortLabel}</span>

                {tab.badge && (
                  <span
                    className={`hidden rounded border px-1.5 py-0.2 text-[9px] font-mono font-bold xl:inline-block ${
                      isActive ? 'bg-[#111111]/30 text-[#111111] border-[#111111]/40' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Streaming & Assistant Shortcuts */}
        <div className="flex items-center gap-2">
          {/* Tech-Goth Palette Indicator Badge */}
          <div
            className="hidden xl:flex items-center gap-1.5 rounded-lg border border-[#F2EFEA]/20 bg-[#1E1E1E] px-2.5 py-1 text-[10px] font-mono text-[#F2EFEA]"
            title="Active Warm Tech-Goth Data Theme"
          >
            <span className="h-2 w-2 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]"></span>
            <span className="text-[#AFA69D]">Warm Tech-Goth</span>
          </div>

          {onOpenShortcuts && (
            <button
              id="btn-keyboard-shortcuts"
              onClick={onOpenShortcuts}
              className="flex items-center gap-1.5 rounded-lg border border-[#F2EFEA]/20 bg-[#8A7F73]/30 px-2.5 py-1.5 text-xs text-[#F2EFEA] hover:border-[#00F2FE] hover:text-[#00F2FE] hover:shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all"
              title="View Keyboard Shortcuts (?)"
            >
              <Keyboard className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span className="hidden sm:inline text-[11px]">Shortcuts</span>
              <kbd className="hidden md:inline-block rounded bg-[#111111] px-1 py-0.2 text-[9px] font-mono text-[#AFA69D] border border-[#F2EFEA]/20">
                ?
              </kbd>
            </button>
          )}

          {onOpenHelp && (
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-1 rounded-lg border border-[#F2EFEA]/20 bg-[#8A7F73]/30 px-2.5 py-1.5 text-xs text-[#F2EFEA] hover:border-[#00F2FE] hover:text-[#00F2FE] hover:shadow-[0_0_12px_rgba(0,242,254,0.3)] transition-all"
              title="Open AI Guide / Navigator"
            >
              <HelpCircle className="h-3.5 w-3.5 text-[#00F2FE]" />
              <span className="hidden sm:inline text-[11px]">Help</span>
            </button>
          )}

          <button
            id="btn-toggle-streaming"
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
              isStreaming
                ? 'border-transparent bg-[#2FFF73] text-[#111111] shadow-[0_0_15px_rgba(47,255,115,0.45)] hover:bg-[#52ff8c]'
                : 'border-[#F2EFEA]/20 bg-[#8A7F73]/30 text-[#AFA69D] hover:bg-[#8A7F73]/50 hover:text-[#F2EFEA]'
            }`}
            title={isStreaming ? 'Pause streaming ingestion' : 'Resume streaming ingestion'}
          >
            <Zap className={`h-3.5 w-3.5 ${isStreaming ? 'text-[#111111]' : 'text-[#AFA69D]'}`} />
            <span className="hidden sm:inline text-[11px]">
              {isStreaming ? 'Ingest: ON' : 'Ingest: PAUSED'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

