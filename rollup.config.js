import { babel } from '@rollup/plugin-babel'
import vue from 'rollup-plugin-vue'
export default [
  // ESM build to be used with webpack/rollup.
  {
    input: './src/index.js',
    output: {
      format: 'es',
      file: 'dist/index.esm.js'
    },
    plugins: [
      vue({ css: false }),
      babel({ babelHelpers: 'bundled' })
    ]
  },
  // SSR build.
  {
    input: './src/index.js',
    output: {
      format: 'cjs',
      file: 'dist/index.ssr.js'
    },
    plugins: [
      vue({ css: false, optimizeSSR: true }),
      babel({ babelHelpers: 'bundled' })
    ]
  },
  // Browser build.
  {
    input: './src/index.js',
    output: {
      format: 'iife',
      file: 'dist/index.js'
    },
    plugins: [
      vue({ css: false, optimizeSSR: true }),
      babel({ babelHelpers: 'bundled' })
    ]
  }
]