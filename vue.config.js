const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  devServer: {
    host: 'scriptpro.dweet.net',
    allowedHosts: [
			'0.0.0.0'
    ],
	  port:8000,
  },
  publicPath: '/',
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('html').tap((opts) => {
        opts[0].filename = './index.php';
        return opts;
      });
    }
  }
}
