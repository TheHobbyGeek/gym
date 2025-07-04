const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
require('dotenv').config();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const PORT = process.env.PORT || 3000;
  
  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      clean: true,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        inject: true
      })
    ],
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    devServer: {
      port: 8080,
      hot: true,
      open: false,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: `http://localhost:${PORT}`,
          changeOrigin: true,
          secure: false,
          logLevel: 'debug'
        }
      }
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map'
  };
};