const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
    mode: 'production', // Меняем режим на 'production' для минификации
    entry: './src/styles.css',
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css', // Название выходного CSS файла
        }),
    ],
    optimization: {
        minimize: true, // Включаем минификацию
        minimizer: [
            `...`, // Используем стандартные минификаторы Webpack (например, Terser для JS)
            new CssMinimizerPlugin(), // Минификатор для CSS
        ],
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'assets'),
        },
        compress: true,
        port: 9002,
        hot: true,
    },
};
