module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({
      // Stage 3 is default. Lower for more transforms.
      stage: 3,
      features: {
        'nesting-rules': true // allow native CSS nesting
      },
      browsers: 'defaults, not IE 11, not dead'
      // ↑ Adjust as needed (see below)
    })
  ]
}