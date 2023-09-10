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
  },
}
