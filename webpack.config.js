const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = (env, argv) => {
    const mode = argv.mode;
    const devMode = mode !== 'production';

    console.log(`Webpack is assembling in ${chalk.bold.blue(mode)} mode`);

    return {
        entry: './src/index.ts',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'index.js',
        },
        target: 'node', // We need to have it in compiled output imports Node.JS can understand
        externals: [ nodeExternals() ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                }
            ]
        },
        devtool: (devMode) ? 'source-map' : false,
        plugins: [
            new webpack.DefinePlugin({
                "process.env.NODE_ENV": JSON.stringify(mode)
            }),
            ...(
                devMode
                    ? [new WebpackShellPluginNext({
                        onBuildEnd:{
                            scripts: ['npm run start:dev'],
                            blocking: false,
                            parallel: true
                        }
                    })]
                    : []
            )
        ],
        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        },
        watch: devMode,
        mode
    };
};