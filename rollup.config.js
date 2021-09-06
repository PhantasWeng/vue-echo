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
    ],
    external: [
      'laravel-echo'
    ]
  },
  // SSR build.
  {
    input: './src/index.js',
    output: {
      format: 'cjs',
      file: 'dist/index.ssr.js',
      exports: 'named'
    },
    plugins: [
      vue({ css: false, optimizeSSR: true }),
      babel({ babelHelpers: 'bundled' })
    ],
    external: [
      'laravel-echo'
    ]
  },
  // Browser build.
  {
    input: './src/index.js',
    output: {
      name: 'vueEcho',
      globals: {
        'laravel-echo': 'LaravelEcho'
      },
      format: 'iife',
      file: 'dist/index.js',
      exports: 'named'
    },
    plugins: [
      vue({ css: false, optimizeSSR: true }),
      babel({ babelHelpers: 'bundled' })
    ],
    external: [
      'laravel-echo'
    ]
  }
]