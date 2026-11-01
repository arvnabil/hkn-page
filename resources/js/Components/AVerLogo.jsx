import React from 'react';

/**
 * AVer Official Identity Logotype Component
 * Render AVer's signature: Bold Navy "AV" + Vibrant Red lowercase "e" + Bold Navy "r"
 */
export default function AVerLogo({
  size = 'md', // 'sm' | 'md' | 'lg'
  withSubtitle = true,
  subtitle = 'SOLUTIONS ADVISOR',
  className = '',
  inverted = false,
}) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.18em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[11px] tracking-[0.25em]',
  };

  const navyColor = inverted ? 'text-white' : 'text-[#0B1F33] dark:text-white';
  const redColor = 'text-[#E52421]'; // Official AVer innovation red

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* AVer Mark */}
      <div className="flex flex-col">
        <div
          className={`font-heading font-black leading-none tracking-tight select-none ${sizeClasses[size] || sizeClasses.md}`}
          style={{ letterSpacing: '-0.03em' }}
        >
          <span className={navyColor}>AV</span>
          <span className={redColor}>e</span>
          <span className={navyColor}>r</span>
        </div>
        {withSubtitle && (
          <span
            className={`font-mono font-bold uppercase text-primary mt-0.5 ${subtitleSizes[size] || subtitleSizes.md}`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}

