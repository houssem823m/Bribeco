/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BRIBECO Brand Colors
        primary: '#007BFF',
        'primary-pastel': '#E6F2FF',
        'primary-light': '#4DA3FF',
        'primary-dark': '#0056B3',
        secondary: '#28A745',
        'secondary-pastel': '#E8F5E9',
        'secondary-light': '#5CB85C',
        'secondary-dark': '#1E7E34',
        // Neutral pastel backgrounds (Wecasa style)
        beige: {
          light: '#FFF8F2',
          lighter: '#FFF7EE',
          soft: '#FAF7F3',
        },
        neutral: {
          light: '#F5F5F5',
          soft: '#FAFAFA',
        },
        // Wecasa-inspired pastel variants
        blue: {
          pastel: '#E6F2FF',
          light: '#B3D9FF',
        },
        green: {
          pastel: '#E8F5E9',
          light: '#C8E6C9',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      borderRadius: {
        'wecasa': '24px',
        'wecasa-lg': '30px',
        'wecasa-xl': '32px',
        'pill': '9999px',
      },
      boxShadow: {
        'wecasa': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'wecasa-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'wecasa-lg': '0 10px 40px rgba(0, 0, 0, 0.1)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'section': '80px',
        'section-sm': '60px',
        'section-lg': '120px',
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-md': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero-lg': ['6rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
    },
  },
  plugins: [],
}
