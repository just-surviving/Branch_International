/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'branch-blue': '#1E40AF',
        'branch-light': '#3B82F6',
        'branch-dark': '#1E3A8A',
        // WhatsApp Dark Mode Colors
        'wa': {
          'bg-deep': '#111b21',        // Main background
          'bg-panel': '#202c33',       // Panel/sidebar background
          'bg-hover': '#2a3942',       // Hover state
          'bg-active': '#2a3942',      // Active/selected state
          'green': '#00a884',          // Primary accent (teal green)
          'green-dark': '#005c4b',     // Outgoing message bubble
          'msg-in': '#202c33',         // Incoming message bubble
          'msg-out': '#005c4b',        // Outgoing message bubble
          'text-primary': '#e9edef',   // Primary text
          'text-secondary': '#8696a0', // Secondary text
          'border': '#2a3942',         // Border color
          'input-bg': '#2a3942',       // Input field background
        },
        // Override gray for WhatsApp-style dark mode
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#8696a0',
          500: '#6b7280',
          600: '#374151',
          700: '#2a3942',
          800: '#202c33',
          900: '#111b21',
          950: '#0b1014',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
