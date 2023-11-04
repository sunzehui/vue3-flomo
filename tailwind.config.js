const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
        wenkai: ['wenkai', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      'transparent': 'transparent',
      'current': 'currentColor',
      'white': '#ffffff',
      'primary': 'var(--flomo-primary)',
      'primary-light-1': 'var(--flomo-primary-light-1)',
      'primary-light-2': 'var(--flomo-primary-light-2)',
      'primary-light-3': 'var(--flomo-primary-light-3)',
      'list-title-text': 'var(--flomo-list-title-text)',
      'tag-text': 'var(--flomo-tag-text)',
      'tag-fill': 'var(--flomo-tag-fill)',
      'base-fill': 'var(--flomo-base-fill)',
      'dark-fill-1': 'var(--flomo-dark-fill-1)',
      'dark-fill-2': 'var(--flomo-dark-fill-2)',

      'light-fill': 'var(--flomo-light-fill)',
      'placeholder': 'var(--flomo-placeholder)',
      'secondary-text': 'var(--flomo-secondary-text)',
      'regular-text': 'var(--flomo-regular-text)',
      'primary-text': 'var(--flomo-primary-text)',
      'disabled': 'var(--flomo-disabled)',
      'light-text': 'var(--flomo-light-text)',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
