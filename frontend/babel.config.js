module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
  ],
  "plugins": [
    ...( process.env.NODE_ENV ==='development' ? ["@babel/plugin-transform-modules-commonjs"]: [])
  ]
}
