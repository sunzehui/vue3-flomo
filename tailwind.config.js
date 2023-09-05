const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
        wenkai: ['wenkai', ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      ...colors,
      'primary': '#55bb8e',
      'primary-light-1': '#d3ecdd',
      'primary-light-2': '#8ddeb5',
      'primary-light-3': '#aaddc6',

      'list-title-text': '#ded1b7',
      'tag': {
        text: '#5783f7',
        fill: '#eef3fe',
      },
      'black-fill': '#212f4b',
      'base-fill': '#efefef',
      'light-fill': '#fafafa',
      'placeholder': '#aaaaaa',
      'secondary-text': '#5f5f5f',
      'regular-text': '#9d9d9d',
      'primary-text': '#323232',
      'disabled': '#aaddc6',
      'dark': {
        'fill': '#121212',
        'primary': '#397354',
        'primary-light-1': '#475446',
        'primary-light-2': '#5d795c',
        'primary-light-3': '#aaddc6',

        'list-title-text': '#fff',
        'tag': {
          text: '#2b88d8',
          fill: '#3a4359',
        },
        'base-fill': '#202020',
        'black-fill': '#3d3d3d',
        // 'black-fill': '#212f4b',
        'light-fill': '#5f5f5f',
        'placeholder': '#aaa',
        'secondary-text': '#5f5f5f',
        'regular-text': '#9d9d9d',
        'primary-text': '#d9d9d9',

        'disabled': 'rgba(255,255,255,.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
