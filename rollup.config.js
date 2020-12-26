import { join, dirname, extname, basename } from 'path'

import nodeResolver from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import replace from '@rollup/plugin-replace'
import json from '@rollup/plugin-json'

import clear from 'rollup-plugin-clear'
import progress from 'rollup-plugin-progress'

import externals from 'rollup-plugin-node-externals'

import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

import filesize from 'rollup-plugin-filesize'
import visualizer from 'rollup-plugin-visualizer'

import parsePackageName from 'parse-pkg-name'

import snakeCase from 'lodash/snakeCase'

import pkg from './package.json'

const isProd = process.env.NODE_ENV === 'production'

const formats = {
  commonjs: {
    format: 'cjs',
    file: pkg.main,
    exports: 'named'
  },
  esm: {
    format: 'esm',
    file: pkg.module,
    exports: 'named'
  },
  umd: {
    format: 'umd',
    name: snakeCase(parsePackageName(pkg.name).name),
    exports: 'named',
    globals: {}
  }
}

const config = {
  input: './src/index.ts',
  inlineDynamicImports: true,
  output: [formats.esm, formats.commonjs],
  plugins: [
    clear({
      targets: ['dist']
    }),
    progress({
      clearLine: false
    }),
    replace({
      __VERSION__: pkg.version,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    externals({
      deps: true
    }),
    nodeResolver(),
    commonjs(),
    typescript(),
    json()
  ],
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  }
}

if (isProd) {
  const file = formats.commonjs.file
  const ext = extname(file)

  config.output.push({
    ...formats.umd,
    file: join(dirname(file), `${basename(file, ext)}.umd${ext}`),
    plugins: [filesize()]
  })

  config.output.push({
    ...formats.umd,
    file: join(dirname(file), `${basename(file, ext)}.umd.min${ext}`),
    plugins: [terser()]
  })

  config.plugins.push(
    visualizer({
      title: `${pkg.name} - ${pkg.author.name}`,
      filename: 'dist/bundle-analyzer-report.html'
    })
  )
}

export default config
