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

      'list-title-text': '#ded1b7',
      'tag': {
        text: '#5783f7',
        fill: '#eef3fe',
      },
      'black-fill': '#212f4b',
      'base-fill': '#efefef',
      'placeholder': '#aaa',
      'secondary-text': '#5f5f5f',
      'regular-text': '#9d9d9d',
      'primary-text': '#323232',
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
