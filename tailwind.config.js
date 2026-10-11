/** @type {import('tailwindcss').Config} */
// Colours resolve to CSS variables so the Dark / Light / AutoCAD themes (src/index.css) can swap them.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name, steps) => Object.fromEntries(steps.map((s) => [s, v(`${name}-${s}`)]));

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        graphite: scale('graphite', [950, 900, 850, 800, 700, 600]),
        steel: scale('steel', [100, 200, 300, 400, 500]),
        amber: scale('amber', [300, 400, 500, 600]),
        blueprint: scale('blueprint', [300, 400, 500, 700, 900]),
        paper: v('paper'),
        // "white" is used for hairline borders and overlays; it becomes dark ink in light mode.
        white: v('ink'),
        'on-accent': v('on-accent'),
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Consolas', 'monospace'],
      },
      maxWidth: { page: '76rem' },
    },
  },
  plugins: [],
};
