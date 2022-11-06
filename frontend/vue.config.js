const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
module.exports = defineConfig({
  devServer: {
    port: 3000
  },
  transpileDependencies: true,
  css: {
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/variable.scss"; `
      }
    }
  },
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  }
})
