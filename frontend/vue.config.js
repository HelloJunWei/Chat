const { defineConfig } = require('@vue/cli-service')
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
})
