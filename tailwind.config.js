/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid rgba(255,255,255,0.3)', // outer border
            },
            thead: {
              borderBottom: '1px solid rgba(255,255,255,0.4)',
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
            th: {
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem',
              color: 'white',
              fontWeight: 'bold',
            },
            tbody: {
              borderTop: '1px solid rgba(255,255,255,0.2)',
            },
            td: {
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.5rem',
              color: 'white',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
