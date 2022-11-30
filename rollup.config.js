// Adapted from https://github.com/sveltejs/template/tree/5de3d089
// via https://gitlab.com/kanthaus/task-lottery/-/blob/main/rollup.config.js

import svelte from 'rollup-plugin-svelte'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import notify from 'rollup-plugin-notify'
import css from 'rollup-plugin-css-only'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

const build = name => {
  const entry = `src/${name}/${name}.js`
  const dest = `extension/${name}/${name}.js`

  const config = {
    input: entry,
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'main',
      file: dest
    },
    plugins: [
      svelte({
        compilerOptions: {
          // enable run-time checks when not in production
          dev: !production
        }
      }),
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css({ output: `${name}.css` }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: [ 'svelte' ]
      }),

      commonjs(),
      notify(),

      production && terser({
        ecma: 'es2020',
        module: true,
        format: {
          comments: false,
        }
      }),
    ],
    watch: {
      clearScreen: false
    }
  }

  return config
}

export default [
  build('background'),
  build('popup'),
  build('settings'),
]
