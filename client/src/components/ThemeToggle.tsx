import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          relative inline-flex items-center justify-center w-12 h-6 rounded-full
          transition-colors duration-200 focus:outline-none shadow-lg hover:scale-110 transform
          ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}
        `}
        aria-label="Toggle theme"
      >
        <motion.div
          className={`
            absolute left-1 flex items-center justify-center w-4 h-4 rounded-full
            ${isDarkMode ? 'text-yellow-200' : 'text-gray-700'}
          `}
          animate={{ x: isDarkMode ? '1.5rem' : '0rem' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {isDarkMode ? <Moon size={12} /> : <Sun size={12} />}
        </motion.div>
      </button>
    </div>
  );
};

export default ThemeToggle;