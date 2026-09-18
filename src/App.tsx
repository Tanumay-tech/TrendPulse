import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView, DashboardSubTab } from './components/DashboardView';
import { SimulationEngineView, SimulationSubTab } from './components/SimulationEngineView';
import { ClusterAnalyticsView, ClusterSubTab } from './components/ClusterAnalyticsView';
import { ReportGeneratorView, ReportSubTab } from './components/ReportGeneratorView';
import { TrendDetailModal } from './components/TrendDetailModal';
import { AiChatbotWidget } from './components/AiChatbotWidget';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import {
  INITIAL_TRENDS,
  INITIAL_POSTS,
  INITIAL_ANOMALIES,
  INITIAL_CLUSTERS,
} from './data/mockData';
import {
  DetectedTrend,
  SocialPost,
  AnomalyAlert,
  TopicCluster,
  ExecutiveReport,
} from './types';
import { AlertTriangle, Flame, Sparkles, Keyboard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulation' | 'clusters' | 'report'>('dashboard');
  const [dashboardSubTab, setDashboardSubTab] = useState<DashboardSubTab>('trends');
  const [simulationSubTab, setSimulationSubTab] = useState<SimulationSubTab>('stream');
  const [clustersSubTab, setClustersSubTab] = useState<ClusterSubTab>('projection');
  const [reportSubTab, setReportSubTab] = useState<ReportSubTab>('summary');

  const [trends, setTrends] = useState<DetectedTrend[]>(INITIAL_TRENDS);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [anomalies, setAnomalies] = useState<AnomalyAlert[]>(INITIAL_ANOMALIES);
  const [clusters, setClusters] = useState<TopicCluster[]>(INITIAL_CLUSTERS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [selectedTrend, setSelectedTrend] = useState<DetectedTrend | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [shortcutHUD, setShortcutHUD] = useState<{ message: string; keyCombo: string } | null>(null);
  const hudTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerShortcutHUD = (message: string, keyCombo: string) => {
    if (hudTimeoutRef.current) {
      clearTimeout(hudTimeoutRef.current);
    }
    setShortcutHUD({ message, keyCombo });
    hudTimeoutRef.current = setTimeout(() => {
      setShortcutHUD(null);
    }, 1400);
  };

  const handleNavigate = (
    tab: 'dashboard' | 'simulation' | 'clusters' | 'report',
    rawSubTab?: string
  ) => {
    setActiveTab(tab);
    if (!rawSubTab) return;
    const st = rawSubTab.toLowerCase();
    if (tab === 'dashboard') {
      if (st === 'anomalies' || st === 'radar') setDashboardSubTab('radar');
      else if (st === 'volume' || st === 'history') setDashboardSubTab('volume');
      else if (st === 'sentiment' || st === 'breakdown') setDashboardSubTab('sentiment');
      else setDashboardSubTab('trends');
    } else if (tab === 'simulation') {
      if (st === 'manual' || st === 'inject') setSimulationSubTab('inject');
      else if (st === 'gemini' || st === 'nlp') setSimulationSubTab('gemini');
      else if (st === 'pipeline' || st === 'architecture') setSimulationSubTab('architecture');
      else setSimulationSubTab('stream');
    } else if (tab === 'clusters') {
      if (st === 'catalog' || st === 'list') setClustersSubTab('catalog');
      else if (st === 'tokens' || st === 'matrix' || st === 'comparison') setClustersSubTab('tokens');
      else setClustersSubTab('projection');
    } else if (tab === 'report') {
      if (st === 'recommendations' || st === 'directives') setReportSubTab('recommendations');
      else if (st === 'matrix' || st === 'risk') setReportSubTab('matrix');
      else if (st === 'diagnostic' || st === 'outlier') setReportSubTab('diagnostic');
      else if (st === 'full' || st === 'export') setReportSubTab('full');
      else setReportSubTab('summary');
    }
  };

  // Gemini stream analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Report generator state
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const [report, setReport] = useState<ExecutiveReport | null>({
    id: 'rep-init-902',
    title: 'Executive Trend Intelligence Brief: Cross-Platform Velocity & Anomaly Shifts',
    generatedAt: new Date().toISOString(),
    timeframe: 'Last 24 Hours',
    analyzedPostCount: 428000,
    activeTrendCount: 5,
    anomalyCount: 3,
    executiveSummary:
      'Real-time automated trend detection indicates explosive developer and consumer mobilization around autonomous agent runtime primitives and open-weight reasoning architectures. Anomaly detection pipelines flagged multi-platform burst multipliers exceeding 5.2x standard variance, signaling an irreversible shift toward localized, high-throughput autonomous systems.',
    emergingSignals: [
      {
        signal: 'Autonomous Multi-Agent Coordination',
        impact: 'Disruption to conventional developer tooling and workflow orchestration engines.',
        growth: '+342% Vol',
        confidence: 96,
      },
      {
        signal: 'Open-Weight Reasoning Parity',
        impact: 'Accelerated migration from centralized cloud APIs to localized, private enterprise inference.',
        growth: '+280% Vol',
        confidence: 92,
      },
      {
        signal: 'Spatial Computing Micro-OLED Waveguides',
        impact: 'Miniaturization breakthroughs driving consumer hardware interest under 50 grams.',
        growth: '+142% Vol',
        confidence: 84,
      },
    ],
    anomalyAnalysis:
      'Burst anomalies detected across the observation cycle exhibit acute statistical divergence: the keyword "Agentic Workflows" reached a z-score of 4.12, corroborated by high Reddit upvote velocity (>94%) and simultaneous open-source repository releases on X.',
    sentimentDistribution: { positive: 64, neutral: 24, negative: 12 },
    strategicRecommendations: [
      {
        priority: 'Immediate Action',
        action: 'Deploy internal benchmarking test suites for autonomous multi-agent reasoning frameworks.',
        rationale: 'Early metrics demonstrate up to a 74% reduction in engineering intervention latency.',
      },
      {
        priority: 'High Opportunity',
        action: 'Audit edge deployment feasibility for quantized open-weight reasoning models.',
        rationale: 'Provides substantial operational expenditure savings with zero data privacy leakage.',
      },
      {
        priority: 'Strategic Watchlist',
        action: 'Monitor ongoing replication preprints for room-temperature superconductor claims.',
        rationale: 'High velocity sentiment counterbalanced by pending peer-reviewed physical verification.',
      },
    ],
    riskAndOpportunityMatrix: [
      {
        theme: 'Autonomous Systems',
        opportunity: 'Exponential operational automation and developer leverage.',
        threat: 'Infinite loop hallucinations and unexpected cloud token consumption spikes.',
      },
      {
        theme: 'Open Weight AI',
        opportunity: 'Complete data sovereignty and zero third-party platform lock-in.',
        threat: 'Increased internal security audit surface for decentralized fine-tunes.',
      },
      {
        theme: 'Spatial Hardware',
        opportunity: 'Pioneering early application ecosystem presence on next-gen glass platforms.',
        threat: 'Hardware supply chain bottlenecks and prolonged consumer adoption cycles.',
      },
    ],
  });

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        setHasGeminiKey(data.hasGeminiKey);
      })
      .catch(() => {
        setHasGeminiKey(false);
      });
  }, []);

  // Periodic streaming simulation
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/simulate-batch');
        if (!res.ok) throw new Error('Simulation endpoint unreachable');
        const data = await res.json();
        if (data.post) {
          setPosts((prev) => [data.post, ...prev.slice(0, 49)]);

          // If post has a burst alert, trigger a toast and anomaly record
          if (data.post.burstAlert && Math.random() > 0.4) {
            const burstKw = data.post.keywords[0] || 'Viral Keyword';
            const multiplier = parseFloat((Math.random() * 2.5 + 3.0).toFixed(1));
            const newAnom: AnomalyAlert = {
              id: `anom-${Date.now()}`,
              trendName: data.post.topicTag || 'Emerging Signal',
              keyword: burstKw,
              detectedAt: new Date().toLocaleTimeString(),
              burstMultiplier: multiplier,
              zScore: parseFloat((multiplier * 0.8 + 0.6).toFixed(2)),
              severity: multiplier > 4.5 ? 'critical' : 'high',
              summary: `Frequency surge (+${Math.floor(multiplier * 100)}%) detected across live incoming stream.`,
              affectedPlatform: data.post.platform,
            };

            setAnomalies((prev) => [newAnom, ...prev.slice(0, 9)]);
            setToastAlert(`Burst Anomaly: ${burstKw} surged +${multiplier}x frequency!`);
            setTimeout(() => setToastAlert(null), 4500);

            // Increment volume on corresponding trend
            setTrends((prev) =>
              prev.map((t) => {
                if (t.name === data.post.topicTag || Math.random() > 0.6) {
                  return {
                    ...t,
                    volume: t.volume + Math.floor(Math.random() * 800) + 200,
                    growthRate: t.growthRate + 1,
                  };
                }
                return t;
              })
            );
          }
        }
      } catch (err) {
        // Fallback simulated injection if backend is offline
        const samplePost: SocialPost = {
          id: `post-${Date.now()}`,
          platform: 'twitter',
          author: 'Stream Ingest Bot',
          handle: '@stream_bot',
          content: 'Continuous ingestion cycle heartbeat: Processing high frequency keyword embeddings across edge clusters.',
          timestamp: 'Just now',
          likes: 45,
          shares: 12,
          comments: 4,
          sentiment: 'positive',
          sentimentScore: 0.5,
          keywords: ['Stream Ingest', 'Live Cluster'],
        };
        setPosts((prev) => [samplePost, ...prev.slice(0, 49)]);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Global Keyboard Shortcuts Listener for Power Users
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInputField =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;
      const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const modPrefix = isMac ? '⌘' : 'Ctrl+';

      // 1. Primary Section Navigation: Ctrl+1..4, Cmd+1..4, Alt+1..4, or plain 1..4 (when not in input)
      if (
        (hasModifier && ['1', '2', '3', '4'].includes(e.key)) ||
        (!isInputField && ['1', '2', '3', '4'].includes(e.key))
      ) {
        e.preventDefault();
        const key = e.key;
        if (key === '1') {
          handleNavigate('dashboard');
          triggerShortcutHUD('Trend Dashboard', `${modPrefix}1`);
        } else if (key === '2') {
          handleNavigate('simulation');
          triggerShortcutHUD('Stream Pipeline', `${modPrefix}2`);
        } else if (key === '3') {
          handleNavigate('clusters');
          triggerShortcutHUD('Semantic Clusters', `${modPrefix}3`);
        } else if (key === '4') {
          handleNavigate('report');
          triggerShortcutHUD('Executive Report', `${modPrefix}4`);
        }
        return;
      }

      // 2. Open / Toggle Shortcuts Modal (? or Ctrl+/)
      if (
        (!isInputField && e.key === '?') ||
        ((e.ctrlKey || e.metaKey) && e.key === '/')
      ) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 3. Escape to close open overlays
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (selectedTrend) {
          setSelectedTrend(null);
          return;
        }
      }

      // 4. Ingest Pause / Resume Toggle (Space or P when not typing)
      if (!isInputField && (e.key === ' ' || e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsStreaming((prev) => {
          const nextState = !prev;
          triggerShortcutHUD(nextState ? 'Stream Ingestion: Resumed' : 'Stream Ingestion: Paused', e.key === ' ' ? 'Space' : 'P');
          return nextState;
        });
        return;
      }

      // 5. Active Module Sub-Tab cycling with [ and ]
      if (!isInputField && (e.key === '[' || e.key === ']')) {
        e.preventDefault();
        const isNext = e.key === ']';

        if (activeTab === 'dashboard') {
          const tabs: DashboardSubTab[] = ['trends', 'radar', 'volume', 'sentiment'];
          const idx = tabs.indexOf(dashboardSubTab);
          const nextIdx = isNext ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          setDashboardSubTab(tabs[nextIdx]);
          triggerShortcutHUD(`Dashboard: ${tabs[nextIdx]}`, e.key);
        } else if (activeTab === 'simulation') {
          const tabs: SimulationSubTab[] = ['stream', 'inject', 'gemini', 'architecture'];
          const idx = tabs.indexOf(simulationSubTab);
          const nextIdx = isNext ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          setSimulationSubTab(tabs[nextIdx]);
          triggerShortcutHUD(`Stream: ${tabs[nextIdx]}`, e.key);
        } else if (activeTab === 'clusters') {
          const tabs: ClusterSubTab[] = ['projection', 'catalog', 'tokens'];
          const idx = tabs.indexOf(clustersSubTab);
          const nextIdx = isNext ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          setClustersSubTab(tabs[nextIdx]);
          triggerShortcutHUD(`Clusters: ${tabs[nextIdx]}`, e.key);
        } else if (activeTab === 'report') {
          const tabs: ReportSubTab[] = ['summary', 'recommendations', 'matrix', 'diagnostic', 'full'];
          const idx = tabs.indexOf(reportSubTab);
          const nextIdx = isNext ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
          setReportSubTab(tabs[nextIdx]);
          triggerShortcutHUD(`Report: ${tabs[nextIdx]}`, e.key);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    activeTab,
    dashboardSubTab,
    simulationSubTab,
    clustersSubTab,
    reportSubTab,
    isShortcutsOpen,
    selectedTrend,
    isStreaming,
  ]);

  // Handler for analyzing stream with Gemini API
  const handleAnalyzeStream = async (postsToAnalyze: any[]) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: postsToAnalyze }),
      });

      if (!res.ok) {
        throw new Error('Analysis failed');
      }

      const data = await res.json();
      setAnalysisResult(data);

      // Merge new extracted trends if provided
      if (data.extractedTrends && data.extractedTrends.length > 0) {
        setTrends((prev) => {
          const updated = [...prev];
          data.extractedTrends.forEach((nt: any) => {
            const existingIdx = updated.findIndex((t) => t.name.toLowerCase() === nt.name.toLowerCase());
            if (existingIdx >= 0) {
              updated[existingIdx] = {
                ...updated[existingIdx],
                volume: updated[existingIdx].volume + (nt.volume || 1000),
                growthRate: Math.max(updated[existingIdx].growthRate, nt.growthRate || 100),
                burstAnomaly: nt.burstAnomaly || updated[existingIdx].burstAnomaly,
              };
            } else {
              updated.unshift({
                id: `trend-${Date.now()}-${Math.floor(Math.random() * 100)}`,
                ...nt,
                platforms: ['twitter', 'reddit'],
                clusterId: 'cluster-ai',
                clusterX: Math.floor(Math.random() * 60) + 20,
                clusterY: Math.floor(Math.random() * 60) + 20,
                history: [
                  { time: '00:00', volume: 5000, positive: 60, neutral: 30, negative: 10 },
                  { time: '04:00', volume: 8000, positive: 62, neutral: 28, negative: 10 },
                  { time: '08:00', volume: 15000, positive: 65, neutral: 25, negative: 10 },
                  { time: '12:00', volume: 28000, positive: 67, neutral: 23, negative: 10 },
                  { time: '16:00', volume: 45000, positive: 68, neutral: 22, negative: 10 },
                  { time: '20:00', volume: nt.volume || 52000, positive: 70, neutral: 20, negative: 10 },
                ],
              });
            }
          });
          return updated.slice(0, 10);
        });
      }

      // Merge any new anomalies detected by Gemini
      if (data.anomalies && data.anomalies.length > 0) {
        setAnomalies((prev) => [
          ...data.anomalies.map((a: any, idx: number) => ({
            id: `anom-gemini-${Date.now()}-${idx}`,
            trendName: a.trendName || 'Gemini Detected Surge',
            keyword: a.keyword || 'Velocity Spike',
            detectedAt: new Date().toLocaleTimeString(),
            burstMultiplier: a.burstMultiplier || 4.2,
            zScore: a.zScore || 3.8,
            severity: (a.severity as any) || 'high',
            summary: a.summary || 'Sudden burst anomaly detected by Gemini 3.8 Flash.',
            affectedPlatform: (a.affectedPlatform as any) || 'multi',
          })),
          ...prev.slice(0, 8),
        ]);
      }

      return data;
    } catch (err: any) {
      console.error('Error analyzing stream:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handler for generating Executive Report with Gemini API
  const handleGenerateReport = async (timeframe: string, focus: string) => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trends,
          anomalies,
          timeframe,
          industryFocus: focus,
        }),
      });

      if (!res.ok) {
        throw new Error('Report generation failed');
      }

      const reportData = await res.json();
      setReport(reportData);
    } catch (err: any) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleInjectPost = (post: SocialPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F2EFEA] antialiased selection:bg-[#00F2FE] selection:text-[#111111]">
      {/* Toast Alert for Sudden Anomaly Spikes */}
      {toastAlert && (
        <div className="fixed bottom-6 right-20 z-50 flex items-center gap-3 rounded-xl border border-[#FF4500]/60 bg-[#1A1412] px-4 py-3 text-xs font-bold text-[#F2EFEA] shadow-[0_0_20px_rgba(255,69,0,0.35)] backdrop-blur-md animate-in slide-in-from-bottom-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF4500]/20 text-[#FF4500] shadow-[0_0_10px_rgba(255,69,0,0.5)]">
            <Flame className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <span className="block uppercase text-[10px] text-[#FF4500] font-mono tracking-wider text-glow-orange">
              CRITICAL BURST ALERT
            </span>
            <span className="text-[#F2EFEA]">{toastAlert}</span>
          </div>
        </div>
      )}

      {/* Global Shortcut HUD Feedback */}
      {shortcutHUD && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-full border border-[#00F2FE]/60 bg-[#161616]/95 px-4 py-2 text-xs font-semibold text-[#F2EFEA] shadow-[0_0_20px_rgba(0,242,254,0.35)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
        >
          <Keyboard className="h-4 w-4 text-[#00F2FE] shrink-0 drop-shadow-[0_0_6px_#00F2FE]" />
          <span className="text-[#F2EFEA]">{shortcutHUD.message}</span>
          <kbd className="rounded bg-[#8A7F73]/30 px-1.5 py-0.5 font-mono text-[10px] text-[#00F2FE] border border-[#00F2FE]/40">
            {shortcutHUD.keyCombo}
          </kbd>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        anomalyCount={anomalies.length}
        hasGeminiKey={hasGeminiKey}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenHelp={() => setIsShortcutsOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            trends={trends}
            anomalies={anomalies}
            onSelectTrend={(t) => setSelectedTrend(t)}
            onOpenSimulation={() => handleNavigate('simulation', 'stream')}
            initialSubTab={dashboardSubTab}
            onSubTabChange={(st) => setDashboardSubTab(st)}
          />
        )}

        {activeTab === 'simulation' && (
          <SimulationEngineView
            posts={posts}
            isStreaming={isStreaming}
            setIsStreaming={setIsStreaming}
            onInjectPost={handleInjectPost}
            onAnalyzeStream={handleAnalyzeStream}
            isAnalyzing={isAnalyzing}
            analysisResult={analysisResult}
            initialSubTab={simulationSubTab}
            onSubTabChange={(st) => setSimulationSubTab(st)}
          />
        )}

        {activeTab === 'clusters' && (
          <ClusterAnalyticsView
            clusters={clusters}
            initialSubTab={clustersSubTab}
            onSubTabChange={(st) => setClustersSubTab(st)}
          />
        )}

        {activeTab === 'report' && (
          <ReportGeneratorView
            report={report}
            onGenerateReport={handleGenerateReport}
            isGenerating={isGeneratingReport}
            trends={trends}
            anomalies={anomalies}
            initialSubTab={reportSubTab}
            onSubTabChange={(st) => setReportSubTab(st)}
          />
        )}
      </main>

      {/* Detail Drilldown Modal */}
      <TrendDetailModal
        trend={selectedTrend}
        onClose={() => setSelectedTrend(null)}
        onOpenSimulation={() => {
          setSelectedTrend(null);
          handleNavigate('simulation', 'stream');
        }}
      />

      {/* AI Chatbot Assistant Navigation Widget */}
      <AiChatbotWidget
        currentTab={activeTab}
        onNavigate={handleNavigate}
        activeSubTabs={{
          dashboard: dashboardSubTab,
          simulation: simulationSubTab,
          clusters: clustersSubTab,
          report: reportSubTab,
        }}
      />

      {/* Power User Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={(t) => handleNavigate(t)}
      />
    </div>
  );
}
