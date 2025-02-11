const { DefinePlugin, ProvidePlugin } = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify'),
      buffer: require.resolve('buffer/'),
      process: require.resolve('process/browser'),
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'global': 'globalThis' // More reliable cross-platform definition
    }),
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
    })
  ]
};
