var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');


var config = {
    //插件项
    // plugins: [new webpack.DefinePlugin({
    //   'process.env':{
    //     'NODE_ENV': JSON.stringify('production')
    //   }
    // }),commonsPlugin],
    //页面入口文件配置
    entry: {
        app : './public/js/source/app.js'
    },
    //入口文件输出配置
    output: {
        path: path.join(__dirname, 'public/js/dist'),
        filename: '[name].bundle.js'
    },
    module: {
        // noParse: [],
        //加载器配置
        loaders: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              loader: "babel-loader",
              query: {
                presets: ['es2015','react','stage-0']
              }
           },
           { test: /\.css$/, loader: 'style-loader!css-loader' },
           { test: /\.less$/, loader: 'style-loader!css-loader!less-loader'},
           { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader' },
           { test: /\.woff(\?t=\d+)?$/, loader: 'file-loader' },
           { test: /\.ttf(\?t=\d+)?$/, loader: 'file-loader' },
           {
				test: /\.(gif|jpe?g|png)$/,
				loader: 'url-loader?limit=25000',
				query: {
					limit: 10000,
					name: 'static/media/images/[name].[hash:8].[ext]'
				}
			},
        ]
    },
    //其它解决方案配置
    resolve: {
        extensions: ['.js', '.jsx','.json', '.scss'],
        alias: {
        }
    }
};


module.exports = config;
