const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require("webpack")
const svelteConfig = require('./svelte.config')

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ['./src/main.js']
	},
	resolve: {
		alias: {
			svelte: path.resolve('node_modules', 'svelte'),

			'@static': path.resolve(__dirname, './src/static'),
      '@libs': path.resolve(__dirname, './src/libs'),
      '@etc': path.resolve(__dirname, './src/etc'),
      '@components': path.resolve(__dirname, './src/components'),
      '@mixins': path.resolve(__dirname, './src/mixins'),
      '@apps': path.resolve(__dirname, './src/apps'),
      '@store': path.resolve(__dirname, './src/store'),

		},
		// extensions: ['.mjs', '.js', '.svelte'],
		extensions: ['.js', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	module: {
		rules: [
			{
        test: /\.worker\.(c|m)?js$/i,
        loader: "worker-loader",
        options: {
          esModule: false,
        },
      },
			// {
      //   test: /\.worker\.js$/,
			// 	// test: /\.worker\.(c|m)?js$/i,
      //   // use: { loader: 'worker-loader' },
			//  	loader: "worker-loader",
			// 	options: {
			// 		// inline: "fallback",
			// 		esModule: false,
      //     // worker: "SharedWorker",
			// 		// type: "classic",
      //   },
      // },
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
              // NOTE Svelte's dev mode MUST be enabled for HMR to work
              dev: !prod, // Default: false
            },
						emitCss: true,
						hotReload: true,
						preprocess: svelteConfig.preprocess,
					}
				}
			},
			// {
			// 	test: /\.css$/,
			// 	use: [
			// 		/**
			// 		 * MiniCssExtractPlugin doesn't support HMR.
			// 		 * For developing, use 'style-loader' instead.
			// 		 * */
			// 		prod ? MiniCssExtractPlugin.loader : 'style-loader',
			// 		{
      //       loader: 'css-loader',
      //       options: {
      //         url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
      //       }
      //     },
			// 		{
			// 		  loader: 'postcss-loader'
			// 		}
			// 	]
			// },
			// {
			//   test: /\.(png|jpg)$/,
			//   loader: 'url-loader'
			// },
			{
        test: /\.(sa|sc|c)ss$/,
        use: [
          prod ? MiniCssExtractPlugin.loader : 'style-loader',
					{
            loader: 'css-loader',
            // options: {
            //   url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
            // }
          },
					{
					  loader: 'postcss-loader'
					},
          'sass-loader',
        ],
      },
			// {
		  //   test: /\.(jpe?g|png|gif|svg)$/i,
		  //   loader: 'file-loader',
		  //   options: {
		  //     name: '/public/[name].[ext]'
		  //   }
			// },
			{
				test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    outputPath: 'images/',
                    publicPath: '/public/',
                    name: prod ? '[hash].[ext]' : '[name]-[hash].[ext]',
                    limit: 4000,
                },
            },
        ],
			}


		]
	},
	mode,
	plugins: [
		new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
    	}),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new ESLintPlugin({
			extensions: ['svelte'],
			formatter: require('eslint').CLIEngine.getFormatter('stylish'),
      fix: true
		})
	],
	devtool: prod ? false: 'source-map',
	optimization: {
		usedExports: true,
 	},
};
