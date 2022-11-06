const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath:'/github-api-desafio-pages',
  transpileDependencies: [
    'vuetify'
  ]
})
