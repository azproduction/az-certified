export const theme = {
  colors: {
    // Modern neutral palette
    primary: '#2563eb', // Blue accent
    primaryHover: '#1d4ed8',
    text: '#1f2937', // Dark gray
    textLight: '#6b7280', // Medium gray
    background: '#ffffff',
    surface: '#f9fafb', // Light gray
    border: '#e5e7eb',
    error: '#ef4444',
    success: '#10b981',

    // Certificate vibrant colors
    certificate: {
      silver: {
        primary: '#94a3b8',
        secondary: '#cbd5e1',
        accent: '#64748b',
        gradient: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)',
      },
      gold: {
        primary: '#fbbf24',
        secondary: '#fcd34d',
        accent: '#f59e0b',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
      },
      platinum: {
        primary: '#a78bfa',
        secondary: '#c4b5fd',
        accent: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
      },
    },
  },

  fonts: {
    body: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'var(--font-playfair), Georgia, "Times New Roman", serif',
    script: 'var(--font-dancing-script), cursive',
  },

  fontSizes: {
    'xs': '0.75rem',
    'sm': '0.875rem',
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  spacing: {
    'xs': '0.5rem',
    'sm': '0.75rem',
    'md': '1rem',
    'lg': '1.5rem',
    'xl': '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },

  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
  },
}

export type Theme = typeof theme
