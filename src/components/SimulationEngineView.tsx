import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  Sparkles,
  AlertTriangle,
  Flame,
  Zap,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  Clock,
  ThumbsUp,
  Share2,
  MessageSquare,
  Search,
  Filter,
  Sliders,
  Workflow,
  Terminal,
  Activity,
} from 'lucide-react';
import { SocialPost, DetectedTrend, AnomalyAlert } from '../types';
import { TermTooltip } from './TermTooltip';

export type SimulationSubTab = 'stream' | 'inject' | 'gemini' | 'architecture';

interface SimulationEngineViewProps {
  posts: SocialPost[];
  isStreaming: boolean;
  setIsStreaming: (val: boolean) => void;
  onInjectPost: (post: SocialPost) => void;
  onAnalyzeStream: (postsToAnalyze: any[]) => Promise<any>;
  isAnalyzing: boolean;
  analysisResult: any | null;
  initialSubTab?: SimulationSubTab;
  onSubTabChange?: (tab: SimulationSubTab) => void;
}

export const SimulationEngineView: React.FC<SimulationEngineViewProps> = ({
  posts,
  isStreaming,
  setIsStreaming,
  onInjectPost,
  onAnalyzeStream,
  isAnalyzing,
  analysisResult,
  initialSubTab = 'stream',
  onSubTabChange,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<SimulationSubTab>(initialSubTab);

  useEffect(() => {
    if (initialSubTab && initialSubTab !== activeSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabChange = (tab: SimulationSubTab) => {
    setActiveSubTab(tab);
    onSubTabChange?.(tab);
  };

  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'reddit' | 'youtube'>('twitter');
  const [customContent, setCustomContent] = useState('');
  const [customAuthor, setCustomAuthor] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'twitter' | 'reddit' | 'youtube'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [streamFilter, setStreamFilter] = useState<'all' | 'burst' | 'positive' | 'negative'>('all');

  const sampleTemplates = [
    {
      title: 'AI Multi-Agent Swarm',
      platform: 'twitter' as const,
      author: 'Elena Torres (@elena_agents)',
      content:
        'Massive benchmark leap: 50 autonomous agent instances coordinated zero-shot debugging over 100k lines of code. Error resolution time dropped 82%. Burst volume spiking!',
    },
    {
      title: 'Room-Temp Superconductor',
      platform: 'reddit' as const,
      author: 'dr_quantum_phys',
      content:
        'Second peer lab just reproduced diamagnetic levitation hysteresis at ambient temperature (295K). Pre-print uploaded to arXiv. The Meissner curve is pristine.',
    },
    {
      title: 'Solid-State Battery EV',
      platform: 'youtube' as const,
      author: 'EV Battery DeepDive',
      content:
        'Testing 500Wh/kg solid-state pouch cells: 1200km range on 7-minute flash charge with 0% dendrite formation over 2000 thermal cycles!',
    },
    {
      title: 'Spatial Computing Eyewear',
      platform: 'twitter' as const,
      author: 'Silicon Horizon (@silicon_xr)',
      content:
        'Developer kits for 38g holographic waveguide glasses are shipping. Instant neural hand gesture recognition replaces mouse & keyboard entirely.',
    },
  ];

  const handleApplyTemplate = (t: typeof sampleTemplates[0]) => {
    setSelectedPlatform(t.platform);
    setCustomAuthor(t.author);
    setCustomContent(t.content);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customContent.trim()) return;

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      platform: selectedPlatform,
      author:
        customAuthor.trim() ||
        (selectedPlatform === 'twitter'
          ? '@tech_pulse'
          : selectedPlatform === 'reddit'
          ? 'u/social_analyst'
          : 'CreatorLab'),
      handle: selectedPlatform === 'twitter' ? '@tech_pulse' : `r/${selectedPlatform}`,
      content: customContent.trim(),
      timestamp: 'Just now',
      likes: Math.floor(Math.random() * 2000) + 150,
      shares: Math.floor(Math.random() * 600) + 50,
      comments: Math.floor(Math.random() * 120) + 10,
      sentiment:
        customContent.toLowerCase().includes('breakthrough') ||
        customContent.toLowerCase().includes('leap')
          ? 'positive'
          : 'neutral',
      sentimentScore: 0.75,
      keywords: ['Manual Ingest', 'Stream Data', selectedPlatform.toUpperCase()],
      burstAlert:
        customContent.toLowerCase().includes('spik') ||
        customContent.toLowerCase().includes('leap') ||
        customContent.toLowerCase().includes('massive'),
    };

    onInjectPost(newPost);
    setCustomContent('');
    setActiveSubTab('stream');

    // Trigger Gemini analysis on the latest batch
    await onAnalyzeStream([newPost, ...posts.slice(0, 4)]);
  };

  const handleAnalyzeRecent = () => {
    onAnalyzeStream(posts.slice(0, 6));
    setActiveSubTab('gemini');
  };

  const filteredPosts = posts.filter((p) => {
    const matchesPlatform = filterPlatform === 'all' || p.platform === filterPlatform;
    const matchesSearch =
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter =
      streamFilter === 'all' ||
      (streamFilter === 'burst' && p.burstAlert) ||
      (streamFilter === 'positive' && p.sentiment === 'positive') ||
      (streamFilter === 'negative' && p.sentiment === 'negative');
    return matchesPlatform && matchesSearch && matchesFilter;
  });

  const burstCountInStream = posts.filter((p) => p.burstAlert).length;

  const subTabs = [
    {
      id: 'stream' as const,
      label: 'Live Firehose Feed',
      badge: `${posts.length} Packets`,
      icon: Radio,
      description: 'Incoming multi-platform stream & real-time monitoring',
    },
    {
      id: 'inject' as const,
      label: 'Post Injection Console',
      badge: 'Manual Ingest',
      icon: Send,
      description: 'Inject custom posts & test anomaly detector',
    },
    {
      id: 'gemini' as const,
      label: 'Gemini Stream Intelligence',
      badge: analysisResult ? 'Analysis Ready' : 'AI Powered',
      badgeColor: analysisResult
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
        : 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Sparkles,
      description: 'NLP topic extraction & semantic anomaly clustering',
    },
    {
      id: 'architecture' as const,
      label: 'Pipeline Architecture',
      badge: '4 Stages',
      icon: Workflow,
      description: 'Sliding window, z-score normalizer & system specs',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Stream Status & Action Header */}
      <div className="rounded-xl border border-[#DDD7CE] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ECE7DF] border border-[#DDD7CE] text-[#8A7F73]">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#24201D]">
                  <TermTooltip termKey="streamIngestion">Real-Time Streaming Pipeline</TermTooltip>
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${
                    isStreaming
                      ? 'bg-[#E7F2EA] text-[#266337] border-[#BCDABE]'
                      : 'bg-[#ECE7DF] text-[#786E64] border-[#DDD7CE]'
                  }`}
                >
                  {isStreaming ? 'Streaming: Active' : 'Streaming: Paused'}
                </span>
              </div>
              <p className="text-xs text-[#786E64] mt-0.5">
                Simulated multi-platform feed with <TermTooltip termKey="slidingWindow">sliding window</TermTooltip> token velocity scoring.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Analyze Stream CTA */}
            <button
              id="btn-analyze-recent-gemini"
              onClick={handleAnalyzeRecent}
              disabled={isAnalyzing}
              className="flex items-center gap-2 rounded-lg bg-[#8A7F73] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#776D62] disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Gemini Analyzing...' : 'Analyze Stream with Gemini'}</span>
            </button>

            {/* Toggle Streaming Ingest */}
            <button
              id="btn-toggle-engine"
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                isStreaming
                  ? 'border-[#BCDABE] bg-[#E7F2EA] text-[#266337] hover:bg-[#D9EADE]'
                  : 'border-[#DDD7CE] bg-white text-[#5A524A] hover:bg-[#FAF8F5]'
              }`}
            >
              <Zap className={`h-3.5 w-3.5 ${isStreaming ? 'text-[#417351]' : 'text-[#8A7F73]'}`} />
              <span>{isStreaming ? 'Pause Ingest' : 'Resume Ingest'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="rounded-xl border border-[#DDD7CE] bg-[#ECE7DF] p-1.5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {subTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`sim-subtab-${tab.id}`}
                  onClick={() => handleSubTabChange(tab.id)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white text-[#24201D] font-bold border border-[#DDD7CE] shadow-sm'
                      : 'text-[#5A524A] hover:bg-white/60 hover:text-[#24201D]'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#8A7F73]' : 'text-[#786E64]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`rounded border px-1.5 py-0.2 text-[10px] font-mono ${
                      isActive
                        ? 'bg-[#ECE7DF] text-[#5A524A] border-[#DDD7CE]'
                        : 'bg-white/70 text-[#786E64] border-[#DDD7CE]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-[#786E64] pr-2">
            <span className="text-[11px] font-mono text-[#786E64]">
              {subTabs.find((t) => t.id === activeSubTab)?.description}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SUB-TAB 1: LIVE FIREHOSE FEED ================= */}
      {activeSubTab === 'stream' && (
        <div className="space-y-4">
          {/* Stream Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800/90 bg-[#131926] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Platform Selector */}
              <div className="flex items-center gap-1 rounded-lg bg-slate-800/80 p-1 border border-slate-700/60">
                {(['all', 'twitter', 'reddit', 'youtube'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPlatform(p)}
                    className={`rounded px-2.5 py-1 text-[11px] font-semibold uppercase transition-all ${
                      filterPlatform === p
                        ? 'bg-slate-700 text-sky-300 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p === 'all' ? 'All Platforms' : p === 'twitter' ? 'X / Twitter' : p}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 rounded-lg border border-slate-700/80 bg-slate-800/60 px-2 py-1">
                <Filter className="h-3 w-3 text-slate-400" />
                <select
                  value={streamFilter}
                  onChange={(e) => setStreamFilter(e.target.value as any)}
                  className="bg-transparent text-xs text-slate-200 focus:outline-none"
                >
                  <option value="all" className="bg-[#131926] text-slate-200">All Posts</option>
                  <option value="burst" className="bg-[#131926] text-slate-200">Burst Anomalies Only</option>
                  <option value="positive" className="bg-[#131926] text-slate-200">Positive Sentiment</option>
                  <option value="negative" className="bg-[#131926] text-slate-200">Negative Sentiment</option>
                </select>
              </div>
            </div>

            {/* Post Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search raw social text or handles..."
                className="w-full sm:w-64 rounded-lg border border-slate-700/80 bg-slate-800/60 py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Feed List */}
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`rounded-xl border p-4 transition-all ${
                  post.burstAlert
                    ? 'border-rose-800/60 bg-[#171622] shadow-sm'
                    : 'border-slate-800/80 bg-[#131926] hover:border-slate-700/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        post.platform === 'twitter'
                          ? 'bg-sky-950/80 text-sky-300 border border-sky-800/60'
                          : post.platform === 'reddit'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                          : 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {post.platform}
                    </span>
                    <span className="text-xs font-bold text-slate-100">{post.author}</span>
                    <span className="text-[11px] font-mono text-slate-400">{post.handle}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.burstAlert && (
                      <span className="flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                        <Flame className="h-3 w-3" />
                        <span>
                          <TermTooltip termKey="burstMultiplier" underline={false}>Burst Spike Flagged</TermTooltip>
                        </span>
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-400">{post.timestamp}</span>
                  </div>
                </div>

                <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                  {post.content}
                </p>

                {/* Keywords & Stats Bar */}
                <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-slate-800/80 text-[11px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {post.keywords.map((kw, i) => (
                      <span
                        key={i}
                        className="rounded bg-slate-800/70 px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700/50"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3.5 w-3.5 text-slate-400" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3.5 w-3.5 text-slate-400" />
                      {post.shares}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        post.sentiment === 'positive'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                          : post.sentiment === 'negative'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      <TermTooltip termKey="sentimentPolarity" underline={false}>
                        {post.sentiment.toUpperCase()}
                      </TermTooltip>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <span>Viewing live streaming pipeline buffer. Ingest frequency: ~3s interval.</span>
            <button
              onClick={() => handleSubTabChange('inject')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Test Injecting a Custom Post</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 2: POST INJECTION CONSOLE ================= */}
      {activeSubTab === 'inject' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Presets & Form (7 cols) */}
            <div className="space-y-4 lg:col-span-7">
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-sky-400" />
                  <span>Manual Post Injection & Pipeline Trigger</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Inject custom social posts or select quick scenario templates to trigger the anomaly detector and test Gemini NLP extraction.
                </p>

                {/* Quick Presets */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Select a Pre-Configured Scenario
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {sampleTemplates.map((t, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyTemplate(t)}
                        className="flex flex-col items-start rounded-lg border border-slate-800/80 bg-slate-800/30 p-2.5 text-left transition-colors hover:border-sky-500/50 hover:bg-slate-800/60"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold text-slate-200">{t.title}</span>
                          <span className="text-[10px] text-sky-400 uppercase font-mono">{t.platform}</span>
                        </div>
                        <span className="mt-1 text-[11px] text-slate-400 line-clamp-1">{t.content}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleManualSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Target Social Media Platform
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPlatform('twitter')}
                        className={`rounded-lg py-2 text-xs font-medium border transition-all ${
                          selectedPlatform === 'twitter'
                            ? 'border-sky-700 bg-sky-950/60 text-sky-300 font-bold'
                            : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        X / Twitter
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlatform('reddit')}
                        className={`rounded-lg py-2 text-xs font-medium border transition-all ${
                          selectedPlatform === 'reddit'
                            ? 'border-amber-700 bg-amber-950/60 text-amber-300 font-bold'
                            : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        Reddit
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlatform('youtube')}
                        className={`rounded-lg py-2 text-xs font-medium border transition-all ${
                          selectedPlatform === 'youtube'
                            ? 'border-rose-700 bg-rose-950/60 text-rose-300 font-bold'
                            : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        YouTube
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Author / Channel Identifier
                    </label>
                    <input
                      type="text"
                      value={customAuthor}
                      onChange={(e) => setCustomAuthor(e.target.value)}
                      placeholder="@handle or u/username"
                      className="w-full rounded-lg border border-slate-700/80 bg-slate-800/60 px-3 py-2 text-xs text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Raw Social Post Text (Keywords, Claims, Metrics)
                    </label>
                    <textarea
                      rows={4}
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="Type or paste post text with hashtags, commentary, or news links..."
                      className="w-full rounded-lg border border-slate-700/80 bg-slate-800/60 p-3 text-xs text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  <button
                    id="btn-submit-post-stream"
                    type="submit"
                    disabled={!customContent.trim() || isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>Inject to Pipeline & Trigger Gemini Extraction</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Preview Card & Pipeline Indicator (5 cols) */}
            <div className="space-y-4 lg:col-span-5">
              <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5">
                <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold block">
                  Ingestion Preview
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-1">Live Packet Simulation</h4>

                <div className="mt-4 rounded-xl border border-slate-800/80 bg-[#162030] p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase bg-sky-950/80 text-sky-300 border border-sky-800/60">
                      {selectedPlatform}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Live Preview</span>
                  </div>
                  <span className="mt-2 block text-xs font-bold text-slate-200">
                    {customAuthor || '@custom_author'}
                  </span>
                  <p className="mt-1 text-xs text-slate-300 italic">
                    {customContent || 'Enter post text on the left to see live preview rendering...'}
                  </p>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><TermTooltip termKey="slidingWindow">Sliding window</TermTooltip> token velocity automatically refreshed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Calculates <TermTooltip termKey="poissonDivergence">Poisson divergence</TermTooltip> against historical baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Passes extracted <TermTooltip termKey="entityToken">entity tokens</TermTooltip> to Gemini NLP engine</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => handleSubTabChange('stream')}
              className="font-medium text-slate-400 hover:text-white"
            >
              ← Back to Live Firehose Feed
            </button>
            <button
              onClick={() => handleSubTabChange('gemini')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Next: View Gemini Stream Intelligence</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 3: GEMINI STREAM INTELLIGENCE ================= */}
      {activeSubTab === 'gemini' && (
        <div className="space-y-6">
          {analysisResult ? (
            <div className="rounded-xl border border-sky-800/60 bg-[#131d2e] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-sky-800/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      Gemini Stream Intelligence Report
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Model: {analysisResult.model || 'gemini-3.8-flash'} • Engine: {analysisResult.source}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded bg-sky-950/80 border border-sky-800/60 px-2.5 py-1 text-xs font-mono font-bold text-sky-300">
                    <TermTooltip termKey="sentimentPolarity" underline={false}>Net Sentiment</TermTooltip>: {analysisResult.overallSentiment?.score > 0 ? '+' : ''}
                    {analysisResult.overallSentiment?.score?.toFixed(2) || '+0.65'}
                  </span>
                  <button
                    onClick={handleAnalyzeRecent}
                    disabled={isAnalyzing}
                    className="rounded-lg bg-sky-600 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
                  >
                    Re-Analyze
                  </button>
                </div>
              </div>

              {/* Stream Summary */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block mb-1">
                  Executive Stream Synthesis
                </span>
                <p className="text-xs leading-relaxed text-slate-200 bg-[#101724] p-4 rounded-xl border border-slate-800/80">
                  {analysisResult.streamSummary}
                </p>
              </div>

              {/* Extracted Anomaly Alerts */}
              {analysisResult.anomalies && analysisResult.anomalies.length > 0 && (
                <div className="mt-6 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>
                      <TermTooltip termKey="burstMultiplier">Detected Anomaly Spikes in Stream</TermTooltip>:
                    </span>
                  </span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {analysisResult.anomalies.map((anom: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-rose-900/50 bg-[#181522] p-3.5 text-xs shadow-sm"
                      >
                        <span className="relative flex h-2 w-2 mt-1 shrink-0">
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100 text-sm">{anom.keyword}</span>
                            <span className="rounded bg-rose-950/80 border border-rose-800/80 px-1.5 py-0.5 text-[10px] font-bold text-rose-300">
                              +{anom.burstMultiplier}x Burst
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 leading-relaxed">{anom.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Topic Clusters */}
              {analysisResult.clusters && analysisResult.clusters.length > 0 && (
                <div className="mt-6 pt-4 border-t border-sky-900/30">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>
                      <TermTooltip termKey="unsupervisedClustering">Discovered Topic Clusters & Entities</TermTooltip>:
                    </span>
                  </span>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {analysisResult.clusters.map((cl: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-800/90 bg-[#141d2c] p-3.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 text-sm">{cl.name}</span>
                          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-sky-300 border border-slate-700/60">
                            <TermTooltip termKey="cohesionScore">Cohesion {cl.cohesionScore}%</TermTooltip>
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{cl.summary}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {cl.keywords?.map((k: string, kidx: number) => (
                            <span
                              key={kidx}
                              className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                            >
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Sparkles className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-100">
                No Stream Intelligence Analysis Run Yet
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-md mx-auto">
                Gemini 3.8 Flash can analyze the live multi-platform text firehose to extract emerging topics, calculate sentiment scores, and detect burst anomalies.
              </p>
              <button
                onClick={handleAnalyzeRecent}
                disabled={isAnalyzing}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                <span>Run Gemini Intelligence Analysis Now</span>
              </button>
            </div>
          )}

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => handleSubTabChange('inject')}
              className="font-medium text-slate-400 hover:text-white"
            >
              ← Back to Injection Console
            </button>
            <button
              onClick={() => handleSubTabChange('architecture')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Next: View Pipeline Architecture</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ================= SUB-TAB 4: PIPELINE ARCHITECTURE ================= */}
      {activeSubTab === 'architecture' && (
        <div className="space-y-6">
          {/* Architecture Visual Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Radio className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold block">Stage 1</span>
              <h4 className="text-sm font-bold text-slate-100">Multi-Source Ingest</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects to social firehoses (Twitter stream, Reddit subreddits, YouTube video metadata). Normalizes encoding and timestamps.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-semibold block">Stage 2</span>
              <h4 className="text-sm font-bold text-slate-100">Frequency Normalizer</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computes 15-minute <TermTooltip termKey="slidingWindow">sliding token velocity</TermTooltip> windows to filter background noise and identify non-linear accelerations.
              </p>
            </div>

            <div className="rounded-xl border border-rose-900/40 bg-[#171622] p-5 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Flame className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold block">Stage 3</span>
              <h4 className="text-sm font-bold text-slate-100">Burst Anomaly Detector</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluates statistical <TermTooltip termKey="zScore">z-scores</TermTooltip> (threshold &gt; 3.0) and <TermTooltip termKey="poissonDivergence">Poisson divergence</TermTooltip> to flag viral breakout moments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5 space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block">Stage 4</span>
              <h4 className="text-sm font-bold text-slate-100">Gemini 3.8 Flash NLP</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Performs unsupervised <TermTooltip termKey="unsupervisedClustering">semantic clustering</TermTooltip>, tone polarity scoring, and generates real-time executive summaries.
              </p>
            </div>
          </div>

          {/* Telemetry Specifications Table */}
          <div className="rounded-xl border border-slate-800/90 bg-[#131926] p-5">
            <h4 className="text-sm font-bold text-slate-100">Pipeline Telemetry & Performance Targets</h4>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4 font-mono text-xs">
              <div className="rounded-lg bg-[#101622] p-3 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">THROUGHPUT</span>
                <span className="text-sm font-bold text-sky-400">428,000 / sec</span>
              </div>
              <div className="rounded-lg bg-[#101622] p-3 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">MEDIAN LATENCY</span>
                <span className="text-sm font-bold text-emerald-400">240 ms</span>
              </div>
              <div className="rounded-lg bg-[#101622] p-3 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">
                  <TermTooltip termKey="slidingWindow">SLIDING WINDOW</TermTooltip>
                </span>
                <span className="text-sm font-bold text-indigo-300">15 min rolling</span>
              </div>
              <div className="rounded-lg bg-[#101622] p-3 border border-slate-800/80">
                <span className="text-slate-400 text-[10px] block">
                  <TermTooltip termKey="zScore">ANOMALY THRESHOLD</TermTooltip>
                </span>
                <span className="text-sm font-bold text-rose-300">z-score &gt; 3.0</span>
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => handleSubTabChange('gemini')}
              className="font-medium text-slate-400 hover:text-white"
            >
              ← Back to Gemini Stream Intelligence
            </button>
            <button
              onClick={() => handleSubTabChange('stream')}
              className="flex items-center gap-1 font-medium text-sky-400 hover:text-sky-300"
            >
              <span>Back to Firehose Stream Feed</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
