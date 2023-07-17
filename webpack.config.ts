import { resolve } from 'node:path';
import ESLintPlugin from 'eslint-webpack-plugin';

export default {
  mode: 'production',
  entry: resolve(__dirname, 'index'),
  output: { clean: true, path: resolve(__dirname, 'dist'), filename: 'index.js' },
  module: { rules: [{ test: /\.ts$/i, loader: 'ts-loader' }] },
  resolve: { extensions: ['.ts', '.js'] },
  target: 'node',
  plugins: [new ESLintPlugin({ extensions: ['ts'], fix: false })],
};
