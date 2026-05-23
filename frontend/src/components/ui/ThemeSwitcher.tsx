import React from 'react';
import { Theme, useTheme } from '@/context/ThemeContext';
import { ChevronDown } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Theme;
    setTheme(selected);
  };

  return (
    <div className="relative inline-block text-white">
      <select
        value={theme}
        onChange={handleChange}
                className="bg-[#1a1a1a] text-sm text-white rounded px-2 py-1 appearance-none outline-none focus:ring-2 focus:ring-brand-yellow hover:bg-[#2a2a2a] border border-gray-600 transition-colors"
      >
        <option value="dark">Industrial Dark</option>
        <option value="light">Clean Light</option>
        <option value="medical">Medical Corporate</option>
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} />
    </div>
  );
};
