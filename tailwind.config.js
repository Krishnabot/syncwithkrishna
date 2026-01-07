/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Purple / Violet palette
        purple: {
          50: '#FAF5FF',   // Soft Purple background
          100: '#F3E8FF',  // Light Lavender
          200: '#E9D5FF',  // Lavender
          300: '#C4B5FD',  // Light Violet
          400: '#A855F7',  // Electric Purple accent
          500: '#8B5CF6',  // Vibrant Violet
          600: '#7C3AED',  // Primary Violet
          700: '#6B46C1',  // Deep Purple primary
          800: '#5B21B6',  // Dark Purple
          900: '#4C1D95',  // Darkest Purple text/borders
        },
        violet: {
          light: '#8B5CF6',
          DEFAULT: '#7C3AED',
          dark: '#6B46C1',
          accent: '#A855F7',
        },
        // Semantic aliases
        primary: {
          DEFAULT: '#6B46C1', // Deep Purple
          hover: '#5B21B6',   // Dark Purple
          light: '#8B5CF6',   // Vibrant Violet
          accent: '#A855F7',  // Electric Purple
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Vibrant Violet
          hover: '#7C3AED',   // Primary Violet
          light: '#C4B5FD',    // Light Violet
          accent: '#E9D5FF',   // Lavender
        },
        surface: {
          DEFAULT: '#FAF5FF',  // Soft Purple background
          elevated: '#FFFFFF',  // White cards
          muted: '#F3E8FF',    // Light Lavender muted
        },
        text: {
          primary: '#4C1D95',   // Darkest Purple
          secondary: '#6B46C1', // Deep Purple
          muted: '#8B5CF6',    // Vibrant Violet muted
          inverse: '#FFFFFF',  // White on dark
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'purple-sm': '0 1px 2px 0 rgba(107, 70, 193, 0.05)',
        'purple': '0 4px 6px -1px rgba(107, 70, 193, 0.1), 0 2px 4px -1px rgba(107, 70, 193, 0.06)',
        'purple-md': '0 10px 15px -3px rgba(107, 70, 193, 0.1), 0 4px 6px -2px rgba(107, 70, 193, 0.05)',
        'purple-lg': '0 20px 25px -5px rgba(107, 70, 193, 0.1), 0 10px 10px -5px rgba(107, 70, 193, 0.04)',
        'purple-xl': '0 25px 50px -12px rgba(107, 70, 193, 0.25)',
        'violet-glow': '0 0 20px rgba(139, 92, 246, 0.3)',
      },
      backgroundImage: {
        'purple-gradient': 'linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A855F7 100%)',
        'violet-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'purple-hero': 'linear-gradient(135deg, #4C1D95 0%, #6B46C1 50%, #8B5CF6 100%)',
      },
      animation: {
        'purple-pulse': 'purple-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'violet-float': 'violet-float 3s ease-in-out infinite',
        'purple-shimmer': 'purple-shimmer 2s linear infinite',
      },
      keyframes: {
        'purple-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'violet-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'purple-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}