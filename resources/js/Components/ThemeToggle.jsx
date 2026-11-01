import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle Component
 * Toggles between Light and Dark mode using Tailwind class 'dark' on <html>
 * Persists choice in localStorage ('aver-theme')
 */
export default function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial check on mount
    const savedTheme = localStorage.getItem('aver-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme ? savedTheme === 'dark' : prefersDark;

    setIsDark(initialDark);
    document.documentElement.classList.toggle('dark', initialDark);

    // Listener for external theme changes
    const handleThemeChange = (e) => {
      if (e.detail?.resolved) {
        setIsDark(e.detail.resolved === 'dark');
      }
    };
    window.addEventListener('aver:theme', handleThemeChange);
    return () => window.removeEventListener('aver:theme', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    document.documentElement.classList.toggle('dark', nextDark);
    localStorage.setItem('aver-theme', nextDark ? 'dark' : 'light');

    // Update meta theme-color if present
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', nextDark ? '#07131F' : '#F8F9FF');
    }

    window.dispatchEvent(
      new CustomEvent('aver:theme', {
        detail: { mode: nextDark ? 'dark' : 'light', resolved: nextDark ? 'dark' : 'light' },
      })
    );
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`w-10 h-10 flex items-center justify-center rounded-xl border border-border-clean bg-surface-alt hover:bg-surface-container text-on-surface transition-colors focus:outline-none ${className}`}
      aria-label={isDark ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
      title={isDark ? 'Mode Terang' : 'Mode Gelap'}
    >
      <span className="material-symbols-outlined text-[20px] transition-transform duration-200">
        {isDark ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
