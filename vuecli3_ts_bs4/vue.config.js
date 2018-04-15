module.exports = {
    chainWebpack: config => {
        config
            .entryPoints.clear().end()
            .devtool('source-map')
            .entry('appspa')
            .add('./src/main_spa.ts')
            .end()
            .entry('appnospa')
            .add('./src/main_nospa.ts')
            .end()
            .resolve.alias.set('vue$', 'vue/dist/vue.esm.js')
    }
}
