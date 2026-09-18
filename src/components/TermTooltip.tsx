import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, Sparkles, BookOpen } from 'lucide-react';
import { TERMS_GLOSSARY, TermDefinition, lookupTerm } from '../data/termsGlossary';

interface TermTooltipProps {
  termKey?: keyof typeof TERMS_GLOSSARY | string;
  customTerm?: string;
  customDefinition?: string;
  customCategory?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
  underline?: boolean;
  className?: string;
}

export const TermTooltip: React.FC<TermTooltipProps> = ({
  termKey,
  customTerm,
  customDefinition,
  customCategory = 'Glossary Term',
  children,
  showIcon = false,
  underline = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<any>(null);

  // Lookup term from glossary
  const definition: TermDefinition | null =
    termKey && TERMS_GLOSSARY[termKey]
      ? TERMS_GLOSSARY[termKey]
      : termKey
      ? lookupTerm(termKey)
      : customTerm
      ? lookupTerm(customTerm)
      : null;

  const title = customTerm || definition?.term || (typeof children === 'string' ? children : 'Term');
  const meaning = customDefinition || definition?.simpleMeaning || 'Technical metric tracked by TrendPulse Radar.';
  const interpretation = definition?.practicalInterpretation;
  const category = definition?.category || customCategory;
  const formula = definition?.formula;
  const example = definition?.example;

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const left = Math.min(Math.max(16, rect.left + rect.width / 2 - 140), window.innerWidth - 300);
      const top = rect.top < 220 ? rect.bottom + 8 : rect.top - 8;
      setCoords({ top, left });
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      className={`relative inline-flex items-center gap-1 cursor-help group outline-none ${
        underline ? 'border-b border-dotted border-[#0EA5E9]/60 hover:border-[#0EA5E9]' : ''
      } ${className}`}
    >
      {children || <span>{title}</span>}
      {showIcon && (
        <HelpCircle className="h-3 w-3 text-[#0EA5E9] group-hover:drop-shadow-[0_0_4px_#0EA5E9] transition-colors inline-block" />
      )}

      {/* Tooltip Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="fixed z-50 w-80 rounded-xl border border-[#334155] bg-[#1E293B]/98 p-4 shadow-[0_0_25px_rgba(0,0,0,0.6)] backdrop-blur-md text-left transition-all duration-150 animate-in fade-in zoom-in-95 pointer-events-auto"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.top > 250 ? 'translateY(-100%)' : 'none',
          }}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#0EA5E9] drop-shadow-[0_0_4px_#0EA5E9] shrink-0" />
              <span className="font-bold text-[#F8FAFC] text-xs tracking-tight">{title}</span>
            </div>
            <span className="rounded bg-[#0D1117] border border-[#334155] px-2 py-0.5 text-[9px] font-mono font-semibold text-[#0EA5E9]">
              {category}
            </span>
          </div>

          {/* Formula Display if present */}
          {formula && (
            <div className="mt-2 rounded-lg bg-[#0D1117] border border-[#0EA5E9]/30 px-2.5 py-1.5 flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-[#94A3B8]">Formula:</span>
              <code className="text-xs font-mono font-bold text-[#0EA5E9] tracking-wide">{formula}</code>
            </div>
          )}

          {/* Simple Meaning */}
          <div className="mt-2 text-xs text-[#cbd5e1] leading-relaxed">
            {meaning}
          </div>

          {/* Practical Interpretation */}
          {interpretation && (
            <div className="mt-2.5 rounded-lg bg-[#0D1117]/80 border border-[#334155] p-2 text-[11px] text-[#e2e8f0] leading-normal">
              <span className="font-semibold text-[#0EA5E9] block mb-0.5">What this means:</span>
              {interpretation}
            </div>
          )}

          {/* Concrete Example */}
          {example && (
            <div className="mt-2 text-[10px] font-mono text-[#94A3B8]">
              <span className="text-[#0EA5E9]">Example:</span> {example}
            </div>
          )}
        </div>
      )}
    </span>
  );
};
