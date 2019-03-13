const { resolve, relative } = require('path')

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const config = require('./config')

const stats = require('./stats')
const define = require('./define')

const optimization = require('./optimization')
const minimizer = require('./minimizer')

module.exports = webpackMerge(config, {
    mode: 'production',

    // devtool: 'cheap-source-map',

    bail: true,

    stats: stats.config,

    output: {
        ...config.output,
        path: define.rs_dist,
        filename: '[name].js',
        chunkFilename: '[name].min.js',
        devtoolModuleFilenameTemplate: info => relative(define.rs_root, info.absoluteResourcePath).replace(/\\/g, '/'),
    },

    performance: define.rs_release && {
        hints: 'warning',
        maxAssetSize: 500000,
        maxEntrypointSize: 500000,
        assetFilter: assetFilename => !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
    },

    optimization: webpackMerge(optimization, minimizer),
})
