import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowRight,
  Compass,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ExternalLink,
  Layers,
  Activity,
  Radio,
  Network,
  FileText,
  Bot,
  User,
  Check,
} from 'lucide-react';

export interface NavigationTarget {
  tab: 'dashboard' | 'simulation' | 'clusters' | 'report';
  subTab?: string;
  label: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  navigationTarget?: NavigationTarget | null;
  suggestedFollowUps?: string[];
}

interface AiChatbotWidgetProps {
  currentTab: 'dashboard' | 'simulation' | 'clusters' | 'report';
  onNavigate: (tab: 'dashboard' | 'simulation' | 'clusters' | 'report', subTab?: string) => void;
  activeSubTabs?: {
    dashboard?: string;
    simulation?: string;
    clusters?: string;
    report?: string;
  };
}

export const AiChatbotWidget: React.FC<AiChatbotWidgetProps> = ({
  currentTab,
  onNavigate,
  activeSubTabs,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDirectory, setShowDirectory] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [navigatedNotice, setNavigatedNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: "Hello! I'm your TrendPulse Navigator & AI Assistant. Can't find a specific section or want to know what a metric like 'z-score' means? Ask me anything, or pick one of the quick prompts below!",
      timestamp: 'Just now',
      suggestedFollowUps: [
        'What are the keyboard shortcuts?',
        'Where is the Volume Over Time chart?',
        'How do I test a custom social post?',
        'Show me the 2D Latent Vector Projection',
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.text,
          history: messages.slice(-5).map((m) => ({
            role: m.sender,
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Assistant API request failed');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've analyzed your question and identified the best view for you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        navigationTarget: data.navigationTarget || null,
        suggestedFollowUps: data.suggestedFollowUps || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Local fallback in case network has a blip
      const fallbackTarget = inferNavigation(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-fallback-${Date.now()}`,
          sender: 'assistant',
          text: `You can find that in the **${fallbackTarget.tab.toUpperCase()}** module! Click the action button below to go straight there.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          navigationTarget: fallbackTarget,
          suggestedFollowUps: [
            'Where is the Volume Over Time chart?',
            'What does z-score mean?',
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const inferNavigation = (query: string): NavigationTarget => {
    const q = query.toLowerCase();
    if (q.includes('shortcut') || q.includes('hotkey') || q.includes('keyboard')) {
      return { tab: 'dashboard', subTab: 'trends', label: 'View Keyboard Shortcuts via top right' };
    }
    if (q.includes('volume') || q.includes('time') || q.includes('graph')) {
      return { tab: 'dashboard', subTab: 'volume', label: 'Go to Volume Over Time Chart' };
    }
    if (q.includes('sentiment') || q.includes('polarity')) {
      return { tab: 'dashboard', subTab: 'sentiment', label: 'Go to Sentiment Breakdown' };
    }
    if (q.includes('anomal') || q.includes('burst') || q.includes('z-score')) {
      return { tab: 'dashboard', subTab: 'anomalies', label: 'Go to Anomaly Detection Radar' };
    }
    if (q.includes('inject') || q.includes('post') || q.includes('manual')) {
      return { tab: 'simulation', subTab: 'manual', label: 'Go to Manual Post Ingestion' };
    }
    if (q.includes('cluster') || q.includes('vector') || q.includes('map') || q.includes('2d')) {
      return { tab: 'clusters', subTab: 'projection', label: 'Go to 2D Vector Projection' };
    }
    if (q.includes('recommend') || q.includes('directive') || q.includes('action')) {
      return { tab: 'report', subTab: 'recommendations', label: 'Go to Strategic Directives' };
    }
    if (q.includes('report') || q.includes('brief') || q.includes('summary')) {
      return { tab: 'report', subTab: 'summary', label: 'Go to Executive Briefing' };
    }
    return { tab: 'dashboard', subTab: 'feed', label: 'Go to Live Trend Feed' };
  };

  const handleExecuteNavigation = (target: NavigationTarget) => {
    onNavigate(target.tab, target.subTab);
    setNavigatedNotice(`Navigated to: ${target.label}`);
    setTimeout(() => setNavigatedNotice(null), 3000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you navigate or understand TrendPulse Radar?',
        timestamp: 'Just now',
        suggestedFollowUps: [
          'Where is the Volume Over Time chart?',
          'How do I test a custom social post?',
          'Show me the 2D Latent Vector Projection',
        ],
      },
    ]);
  };

  const directorySections = [
    {
      tab: 'dashboard' as const,
      name: 'Trend Dashboard',
      icon: Activity,
      views: [
        { id: 'feed', label: 'Live Trend Feed', desc: 'Real-time trending topics & metrics' },
        { id: 'volume', label: 'Volume Over Time', desc: 'Historical search trajectories' },
        { id: 'sentiment', label: 'Sentiment Distribution', desc: 'Positive, neutral & negative splits' },
        { id: 'anomalies', label: 'Anomaly Radar', desc: 'Z-score outliers & burst spikes' },
      ],
    },
    {
      tab: 'simulation' as const,
      name: 'Stream Pipeline',
      icon: Radio,
      views: [
        { id: 'stream', label: 'Live Stream Feed', desc: 'Cross-platform post firehose' },
        { id: 'manual', label: 'Manual Post Ingestion', desc: 'Inject custom posts & test keywords' },
        { id: 'gemini', label: 'Gemini NLP Analysis', desc: 'Live AI entity extraction' },
        { id: 'pipeline', label: 'Pipeline Blueprint', desc: '4-stage ingestion architecture' },
      ],
    },
    {
      tab: 'clusters' as const,
      name: 'Semantic Clusters',
      icon: Network,
      views: [
        { id: 'projection', label: '2D Latent Vector Map', desc: 'Interactive coordinate space' },
        { id: 'catalog', label: 'Clusters Catalog', desc: 'Cohesion scores & centroids' },
        { id: 'tokens', label: 'Entity Token Matrix', desc: 'Searchable token database' },
      ],
    },
    {
      tab: 'report' as const,
      name: 'Executive Report',
      icon: FileText,
      views: [
        { id: 'summary', label: 'Executive Brief & Signals', desc: 'High-level synthesis' },
        { id: 'recommendations', label: 'Strategic Directives', desc: 'Prioritized action mandates' },
        { id: 'matrix', label: 'Risk & Opportunity Matrix', desc: 'Vulnerability vs opportunity' },
        { id: 'diagnostic', label: 'Anomaly Diagnostic', desc: 'Statistical outlier breakdown' },
        { id: 'full', label: 'Full Dossier Export', desc: 'Continuous Markdown view' },
      ],
    },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
          {navigatedNotice && (
            <div className="rounded-lg border border-[#34d399]/40 bg-[#121824] px-3 py-1.5 text-xs text-[#34d399] shadow-md animate-in fade-in slide-in-from-right-3 font-semibold font-mono">
              <Check className="h-3 w-3 inline mr-1" />
              {navigatedNotice}
            </div>
          )}

          <button
            id="btn-open-ai-chatbot"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 rounded-full border border-[#38bdf8]/40 bg-[#121824] px-4 py-2.5 text-xs font-semibold text-[#f1f5f9] shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:border-[#38bdf8] hover:shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all duration-200"
            title="Open AI Navigator & Help Assistant"
          >
            <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-[#0b0f19] text-[#38bdf8] border border-[#38bdf8]/30">
              <Compass className="h-3.5 w-3.5 animate-spin-slow group-hover:rotate-45 transition-transform text-[#38bdf8] drop-shadow-[0_0_4px_#38bdf8]" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#34d399] ring-2 ring-[#121824] shadow-[0_0_6px_#34d399]"></span>
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-bold text-[#f1f5f9]">AI Assistant</span>
              <span className="block text-[9px] text-[#38bdf8]">Ask / Navigate</span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          id="ai-chatbot-widget-panel"
          className="fixed bottom-5 right-5 z-50 flex h-[540px] w-96 max-w-[calc(100vw-24px)] flex-col rounded-2xl border border-slate-800 bg-[#121824]/95 text-[#f1f5f9] shadow-[0_0_35px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#0b0f19] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#121824] text-[#38bdf8] border border-[#38bdf8]/30 shadow-[0_0_8px_rgba(56,189,248,0.2)]">
                <Bot className="h-4 w-4 text-[#38bdf8]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-[#f1f5f9]">TrendPulse AI Navigator</h3>
                  <span className="rounded bg-[#10b981]/15 px-1.5 py-0.2 text-[9px] font-mono text-[#34d399] border border-[#10b981]/30 shadow-sm">
                    Online
                  </span>
                </div>
                <p className="text-[10px] text-[#94a3b8]">Ask navigation questions or search any view</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowDirectory(!showDirectory)}
                className={`rounded-lg p-1.5 text-xs transition-colors ${
                  showDirectory ? 'bg-[#38bdf8]/20 text-[#38bdf8]' : 'text-[#94a3b8] hover:text-[#38bdf8]'
                }`}
                title="Direct Jump Menu: browse all app views"
              >
                <Layers className="h-4 w-4" />
              </button>
              <button
                onClick={handleClearHistory}
                className="rounded-lg p-1.5 text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-[#94a3b8] hover:text-[#fb7185] transition-colors"
                title="Close Assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Direct Jump Menu Overlay */}
          {showDirectory && (
            <div className="absolute inset-x-0 top-14 bottom-14 z-20 overflow-y-auto bg-[#0b0f19]/98 p-4 backdrop-blur-md animate-in fade-in duration-150 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-[#f1f5f9] flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#38bdf8]" />
                  Direct Navigation Directory
                </span>
                <button
                  onClick={() => setShowDirectory(false)}
                  className="text-[10px] text-[#38bdf8] hover:underline"
                >
                  Back to Chat
                </button>
              </div>

              <div className="space-y-3">
                {directorySections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <div key={sec.tab} className="rounded-xl border border-slate-800 bg-[#121824] p-3 shadow-md text-[#f1f5f9]">
                      <div className="flex items-center gap-2 mb-2 font-bold text-xs text-[#f1f5f9]">
                        <Icon className="h-3.5 w-3.5 text-[#38bdf8]" />
                        <span>{sec.name}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1.5">
                        {sec.views.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => {
                              onNavigate(sec.tab, v.id);
                              setShowDirectory(false);
                              setNavigatedNotice(`Navigated to: ${sec.name} > ${v.label}`);
                              setTimeout(() => setNavigatedNotice(null), 3000);
                            }}
                            className="flex items-center justify-between rounded-lg bg-[#0b0f19]/70 px-2.5 py-1.5 text-left text-xs hover:bg-[#0b0f19] hover:border-[#38bdf8]/50 transition-colors border border-slate-800 text-[#f1f5f9]"
                          >
                            <div>
                              <span className="font-semibold text-[#f1f5f9] block text-[11px]">
                                {v.label}
                              </span>
                              <span className="text-[10px] text-[#94a3b8]">{v.desc}</span>
                            </div>
                            <ArrowRight className="h-3 w-3 text-[#38bdf8] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#0b0f19]/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#121824] text-[#38bdf8] border border-[#38bdf8]/30 text-[10px] font-bold shadow-sm">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 space-y-2 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#38bdf8] text-[#0b0f19] font-semibold rounded-tr-none shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                      : 'bg-[#121824] text-[#f1f5f9] border border-slate-800 rounded-tl-none shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Interactive Jump Action Button */}
                  {msg.navigationTarget && (
                    <div className="pt-1.5">
                      <button
                        onClick={() => handleExecuteNavigation(msg.navigationTarget!)}
                        className="flex w-full items-center justify-between rounded-xl bg-[#0b0f19] border border-[#38bdf8]/40 px-3 py-2 text-[11px] font-bold text-[#38bdf8] hover:border-[#38bdf8] hover:shadow-[0_0_10px_rgba(56,189,248,0.25)] transition-all shadow-sm"
                      >
                        <span className="flex items-center gap-1.5">
                          <Compass className="h-3.5 w-3.5 text-[#38bdf8]" />
                          <span>{msg.navigationTarget.label}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-[#38bdf8]" />
                      </button>
                    </div>
                  )}

                  {/* Follow-up question chips */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-800 flex flex-wrap gap-1">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt)}
                          className="rounded-full bg-[#0b0f19] px-2 py-0.5 text-[10px] text-[#94a3b8] border border-slate-800 hover:text-[#38bdf8] hover:border-[#38bdf8]/40 transition-colors text-left"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`block text-[9px] text-right opacity-80 ${msg.sender === 'user' ? 'text-[#0b0f19]/80' : 'text-[#94a3b8]'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#38bdf8] text-[#0b0f19] text-[10px] font-bold shadow-sm">
                    <User className="h-3 w-3" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-[#38bdf8] text-xs italic">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#121824] text-[#38bdf8] border border-[#38bdf8]/30 animate-pulse">
                  <Sparkles className="h-3 w-3" />
                </div>
                <span>Finding navigation path...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="border-t border-slate-800 bg-[#0b0f19] p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask e.g. 'Where is the volume chart?'..."
                className="flex-1 rounded-xl border border-slate-800 bg-[#121824] px-3.5 py-2 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:border-[#38bdf8] focus:shadow-[0_0_12px_rgba(56,189,248,0.2)] focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#38bdf8] text-[#0b0f19] hover:bg-[#7dd3fc] disabled:opacity-40 transition-colors shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)] font-bold"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-[#94a3b8]">
              <span className="flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 text-[#38bdf8]" />
                Gemini 3.8 Flash Engine
              </span>
              <button
                onClick={() => setShowDirectory(true)}
                className="text-[#38bdf8] hover:underline font-semibold"
              >
                View all 16 sections
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
