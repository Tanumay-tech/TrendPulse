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
        underline ? 'border-b border-dotted border-[#00F2FE]/60 hover:border-[#00F2FE]' : ''
      } ${className}`}
    >
      {children || <span>{title}</span>}
      {showIcon && (
        <HelpCircle className="h-3 w-3 text-[#00F2FE] group-hover:drop-shadow-[0_0_4px_#00F2FE] transition-colors inline-block" />
      )}

      {/* Tooltip Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="fixed z-50 w-72 rounded-xl border border-[#00F2FE]/50 bg-[#161616]/98 p-3.5 shadow-[0_0_25px_rgba(0,242,254,0.3)] backdrop-blur-md text-left transition-all duration-150 animate-in fade-in zoom-in-95 pointer-events-auto"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: coords.top > 250 ? 'translateY(-100%)' : 'none',
          }}
          onMouseEnter={() => clearTimeout(timeoutRef.current)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#F2EFEA]/20">
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#00F2FE] drop-shadow-[0_0_4px_#00F2FE] shrink-0" />
              <span className="font-bold text-[#F2EFEA] text-xs tracking-tight">{title}</span>
            </div>
            <span className="rounded bg-[#8A7F73]/30 border border-[#00F2FE]/30 px-1.5 py-0.5 text-[9px] font-mono text-[#00F2FE]">
              {category}
            </span>
          </div>

          {/* Simple Meaning */}
          <div className="mt-2 text-xs text-[#F2EFEA]/90 leading-relaxed">
            {meaning}
          </div>

          {/* Practical Interpretation */}
          {interpretation && (
            <div className="mt-2.5 rounded-lg bg-[#8A7F73]/25 border border-[#F2EFEA]/20 p-2 text-[11px] text-[#F2EFEA] leading-normal">
              <span className="font-semibold text-[#00F2FE] block mb-0.5">What this means:</span>
              {interpretation}
            </div>
          )}

          {/* Concrete Example */}
          {example && (
            <div className="mt-2 text-[10px] font-mono text-[#AFA69D]">
              <span className="text-[#00F2FE]">Example:</span> {example}
            </div>
          )}
        </div>
      )}
    </span>
  );
};
