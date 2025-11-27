/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores sólidos estilo Mama-IA
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce4bc',
          300: '#8ace8a',
          400: '#5cb55c',
          500: '#00953B', // Verde principal Mama-IA
          600: '#008034',
          700: '#006b2c',
          800: '#005923',
          900: '#00481d',
        },
        secondary: {
          50: '#fffdf5',
          100: '#fff6c9', // Amarillo claro Mama-IA
          200: '#ffed8b',
          300: '#ffde4a',
          400: '#ffcf1f',
          500: '#F8D225', // Amarillo principal Mama-IA
          600: '#e6b900',
          700: '#c28a00',
          800: '#a06c04',
          900: '#845708',
        },
        accent: {
          50: '#faf6f5',
          100: '#f2e8e5',
          200: '#e5d2cc',
          300: '#d3b4a8',
          400: '#bd8e7e',
          500: '#743E2A', // Café principal Mama-IA
          600: '#663625',
          700: '#552c1f',
          800: '#48251a',
          900: '#3d2116',
        },
        text: {
          primary: '#544E4C', // Color de texto principal
          secondary: '#666666',
        }
      },
      // ... mantén las animaciones existentes
    },
  },
  plugins: [],
}