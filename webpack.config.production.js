const path = require('path');
const webpack = require('webpack')
const cleanWebpackPlugin = require('clean-webpack-plugin')
const extractTextWebpackPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Purifycss = require('purifycss-webpack');
const glob = require('glob-all');

module.exports = {
  entry: {
    'index': './src/index.js',
    // 'home': './src/home.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            // presets: ['@babel/preset-env']
            presets: [
              ['@babel/preset-env', {
                // targets: {
                //   browsers: ['> 1%', 'last 2 version']
                //   // chrome: '68'
                // }
              }]
            ]
          }
        },
        exclude: '/node_modules/'
      },
      {
        test: /\.scss$/,
        use: extractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('autoprefixer')(),
                  // require('cssnano')()
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                data: '@import "@/style/variable.scss";',
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new cleanWebpackPlugin('dist/*.*', {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new extractTextWebpackPlugin({
      filename: '[name].min.css'
    }),
    new Purifycss({
      paths: glob.sync([
        path.join(__dirname, './*.html'),
        path.join(__dirname, './src/*.js'),
      ])
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin()
    ],
    usedExports: true,
    sideEffects: true
    // splitChunks: {
    //   chunks: "all",
    //   cacheGroups: {
    //     commons: {
    //       chunks: "initial",
    //       minChunks: 2,
    //       maxInitialRequests: 5,
    //       minSize: 0
    //     },
    //     vendor: {
    //       test: /node_modules/,
    //       chunks: "initial",
    //       name: "vendor",
    //       priority: 10,
    //       enforce: true
    //     }
    //     'vendor-index': {
    //       test: /lodash/, // 直接使用 test 来做路径匹配
    //       chunks: "initial",
    //       name: "vendor-index",
    //       enforce: true,
    //     },
    //     'vendor-home': {
    //       test: /jquery/, // 直接使用 test 来做路径匹配
    //       chunks: "initial",
    //       name: "vendor-home",
    //       enforce: true,
    //     },
    //   }
    // },
    // runtimeChunk: 'single'
  }
};