import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: '#004A8F',
          mid: '#1A6BC4',
          light: '#EBF3FB',
        },
        teal: {
          DEFAULT: '#00936C',
          light: '#E6F6F1',
        },
        bg: '#F4F7FB',
        text: {
          DEFAULT: '#1A2332',
          mid: '#4A5568',
          soft: '#8A99AF',
        },
        border: '#DDE4EE',
      },
      fontFamily: {
        title: ['Fraunces', 'serif'],
        body: ['Figtree', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
