const { DefinePlugin } = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    }
  },
  plugins: [
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};
