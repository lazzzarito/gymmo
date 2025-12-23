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
        'background': '#1a1b26',
        'surface': '#24283b',
        'primary': '#ff4d4d',
        'secondary': '#4fd6be',
        'text': '#c0caf5',
      },
      fontFamily: {
        sans: ['var(--font-vt323)'],
        display: ['var(--font-press-start-2p)'],
      },
    },
  },
  plugins: [],
}
export default config
