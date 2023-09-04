function flattenObject(obj, parentKey = '', result = {}) {
  for (const key in obj) {
    const newKey = parentKey ? `${parentKey}-${key}` : key
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]))
      flattenObject(obj[key], newKey, result)

    else
      result[newKey] = obj[key]
  }
  return result
}
module.exports = {
  plugins: {
    'tailwindcss': {},
    'autoprefixer': {},
    'postcss-preset-env': {},
    'postcss-import': {},
    'postcss-simple-vars': {
      variables() {
        /** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig['theme']['colors'] } */
        const colorsConfig = require('./tailwind.config.js').theme.colors
        if (colorsConfig.length === 0)
          return {}

        return flattenObject(colorsConfig)
      },

    },
  },
}
