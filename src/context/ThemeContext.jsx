import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('medos-theme');
    return saved !== 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    localStorage.setItem('medos-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark(d => !d);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export const dark = {
  bg: '#030308',
  navBg: 'rgba(3,3,8,0.92)',
  cardBg: 'rgba(255,255,255,0.02)',
  cardBgHover: 'rgba(255,255,255,0.04)',
  inputBg: 'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.15)',
  divider: 'rgba(255,255,255,0.05)',
  orb1: 'rgba(109,40,217,0.18)',
  orb2: 'rgba(37,99,235,0.12)',
  orb3: 'rgba(124,58,237,0.10)',
  gridColor: 'rgba(124,58,237,0.03)',
  modalBg: '#0a0a14',
  codeBlock: 'rgba(255,255,255,0.03)',
};

export const light = {
  bg: '#f4f4f9',
  navBg: 'rgba(248,248,254,0.94)',
  cardBg: 'rgba(255,255,255,0.9)',
  cardBgHover: 'rgba(255,255,255,1)',
  inputBg: 'rgba(0,0,0,0.04)',
  border: 'rgba(0,0,0,0.08)',
  borderStrong: 'rgba(0,0,0,0.18)',
  divider: 'rgba(0,0,0,0.06)',
  orb1: 'rgba(109,40,217,0.07)',
  orb2: 'rgba(37,99,235,0.05)',
  orb3: 'rgba(124,58,237,0.04)',
  gridColor: 'rgba(124,58,237,0.04)',
  modalBg: '#ffffff',
  codeBlock: 'rgba(0,0,0,0.03)',
};
