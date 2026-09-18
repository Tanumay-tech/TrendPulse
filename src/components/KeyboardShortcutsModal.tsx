import React, { useEffect } from 'react';
import { X, Keyboard, Command, ArrowRight, ArrowLeft, Play, Pause, Compass, Zap } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'dashboard' | 'simulation' | 'clusters' | 'report') => void;
}

interface ShortcutItem {
  keys: string[];
  altKeys?: string[];
  action: string;
  description: string;
  target?: 'dashboard' | 'simulation' | 'clusters' | 'report';
}

interface ShortcutGroup {
  title: string;
  description: string;
  items: ShortcutItem[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? '⌘' : 'Ctrl';

  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Global Section Navigation',
      description: 'Switch between primary modules instantly from anywhere',
      items: [
        {
          keys: [`${modKey}`, '1'],
          altKeys: ['1'],
          action: 'Trend Dashboard',
          description: 'Live trend matrix, anomaly radar, and volume velocity',
          target: 'dashboard',
        },
        {
          keys: [`${modKey}`, '2'],
          altKeys: ['2'],
          action: 'Stream Pipeline',
          description: 'Simulated firehose, manual burst injection & Gemini NLP',
          target: 'simulation',
        },
        {
          keys: [`${modKey}`, '3'],
          altKeys: ['3'],
          action: 'Semantic Clusters',
          description: '2D latent space projection, cluster catalog & token matrix',
          target: 'clusters',
        },
        {
          keys: [`${modKey}`, '4'],
          altKeys: ['4'],
          action: 'Executive Report',
          description: 'Gemini-synthesized intelligence dossier & risk matrix',
          target: 'report',
        },
      ],
    },
    {
      title: 'Active Section Navigation',
      description: 'Step through internal sub-views within the current module',
      items: [
        {
          keys: ['['],
          action: 'Previous Sub-Tab',
          description: 'Jump to the preceding sub-view in the active section',
        },
        {
          keys: [']'],
          action: 'Next Sub-Tab',
          description: 'Advance to the next sub-view in the active section',
        },
      ],
    },
    {
      title: 'Pipeline & Modal Controls',
      description: 'Control real-time stream state and interface overlays',
      items: [
        {
          keys: ['Space'],
          action: 'Toggle Stream Ingestion',
          description: 'Pause or resume the live social post ingestion stream',
        },
        {
          keys: ['?'],
          altKeys: [`${modKey}`, '/'],
          action: 'Shortcuts Reference',
          description: 'Toggle this keyboard shortcut cheat sheet',
        },
        {
          keys: ['Esc'],
          action: 'Close Modal / Overlay',
          description: 'Dismiss any open dialog or trend inspector panel',
        },
      ],
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard Shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0f19]/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#121824] shadow-2xl overflow-hidden text-[#f1f5f9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#121824]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b0f19] border border-[#38bdf8]/30 text-[#38bdf8] shadow-[0_0_8px_rgba(56,189,248,0.2)]">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#f1f5f9] flex items-center gap-2">
                <span>Power User Keyboard Shortcuts</span>
                <span className="rounded bg-[#38bdf8]/15 px-2 py-0.5 text-[10px] font-mono text-[#38bdf8] border border-[#38bdf8]/30">
                  Global Hotkeys
                </span>
              </h2>
              <p className="text-xs text-[#94a3b8]">
                Navigate the entire intelligence platform rapidly without touching the mouse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#94a3b8] hover:bg-slate-800/60 hover:text-[#fb7185] transition-colors"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6 bg-[#0b0f19]/60">
          {shortcutGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2.5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  {group.title}
                </h3>
                <span className="text-[11px] text-[#94a3b8]">{group.description}</span>
              </div>

              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#121824]">
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 gap-2 hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#f1f5f9]">{item.action}</span>
                        {item.target && (
                          <button
                            onClick={() => {
                              onNavigate(item.target!);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#38bdf8] hover:underline"
                          >
                            Jump now <ArrowRight className="h-2.5 w-2.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-[#94a3b8]">{item.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                      {item.keys.map((k, kIdx) => (
                        <React.Fragment key={kIdx}>
                          <kbd className="min-w-[24px] px-2 py-1 text-center font-mono text-xs font-bold text-[#38bdf8] bg-[#0b0f19] border border-slate-700 rounded shadow-sm">
                            {k}
                          </kbd>
                          {kIdx < item.keys.length - 1 && (
                            <span className="text-[#38bdf8] text-xs font-bold">+</span>
                          )}
                        </React.Fragment>
                      ))}

                      {item.altKeys && (
                        <>
                          <span className="text-[11px] text-[#94a3b8] px-1">or</span>
                          {item.altKeys.map((ak, akIdx) => (
                            <kbd
                              key={akIdx}
                              className="min-w-[20px] px-1.5 py-1 text-center font-mono text-[11px] font-semibold text-[#34d399] bg-[#0b0f19] border border-slate-700 rounded"
                            >
                              {ak}
                            </kbd>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Quick Note */}
          <div className="rounded-xl border border-slate-800 bg-[#121824] p-3 text-xs text-[#94a3b8] flex items-center justify-between shadow-sm">
            <span>
              <strong className="text-[#38bdf8]">Pro-tip:</strong> When not typing in search boxes, you can also press <kbd className="font-mono text-[#38bdf8] bg-[#0b0f19] border border-slate-700 px-1 rounded">1</kbd> to <kbd className="font-mono text-[#38bdf8] bg-[#0b0f19] border border-slate-700 px-1 rounded">4</kbd> directly without holding modifier keys.
            </span>
            <span className="text-[11px] font-mono text-[#94a3b8] hidden sm:inline">Press Esc to close</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-[#121824] text-xs text-[#94a3b8]">
          <span>Press <kbd className="font-mono text-[#38bdf8] bg-[#0b0f19] border border-slate-700 px-1.5 py-0.5 rounded shadow-sm">?</kbd> anywhere to open this dialog</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#38bdf8] hover:bg-[#7dd3fc] px-4 py-1.5 text-xs font-bold text-[#0b0f19] transition-colors shadow-[0_0_12px_rgba(56,189,248,0.3)]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
