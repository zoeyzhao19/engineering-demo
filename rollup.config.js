import pkg from './package.json'
import vuePlugin from 'rollup-plugin-vue'
import scss from 'rollup-plugin-scss'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

const name = 'Element3'

const createBanner = () => {
  return `/*!
  * ${pkg.name} v${pkg.version}
  * (c) ${new Date().getFullYear()}
  *  @license MIT
  */`
}

const createBaseConfig = () => {
  return {
    input: 'src/entry.js',
    external: ['vue'],
    plugins: [
      peerDepsExternal(), // 排除peerDependencies依赖项打包
      vuePlugin({
        css: true
      }), // a plugin for rollup that allows you to author Vue components in a format called Single-File Components (SFCs)
      commonjs(), // Convert CommonJS modules to ES6
      babel(), // A Rollup plugin for seamless integration between Rollup and Babel.
      resolve({
        extensions: ['.vue', '.jsx'] // Specifies the extensions of files that the plugin will operate on
      }), // 解析模块路径
      json(), // Convert .json files to ES6 modules
      scss() // A Rollup plugin which import .scss, .sass, .css files, and rebase, inline or copy on url()
    ],
    output: {
      sourcemap: false,
      banner: createBanner(), // Code to insert at top of bundle (outside wrapper)
      externalLiveBindings: false, // whether to generate code to support live bindings(实时绑定)
      globals: {
        vue: 'Vue'
      }
    }
  }
}

function mergeConfig (baseConfig, configB) {
  const config = Object.assign({}, baseConfig)
  if (configB.plugins) {
    baseConfig.plugins.push(...configB.plugins)
  }
  config.output = Object.assign({}, baseConfig.output, configB.output)
  return config
}

function createFileName (formatName) {
  return `dist/element3-ui.${formatName}.js`
}

// es-bundle
const esBundleConfig = {
  plugins: [
    replace({
      __DEV__: `${process.env.NODE_ENV !== 'production'}`
    })
  ],
  output: {
    file: createFileName('esm-bundler'),
    format: 'es'
  }
}

// es-browser
const esBrowserConfig = {
  plugins: [
    replace({
      __DEV__: true
    }) // Replace strings in files while bundling them
  ],
  output: {
    file: createFileName('esm-browser'),
    format: 'es'
  }
}

// es-browser.prod
const esBrowserProdConfig = {
  plugins: [
    terser(), // to minify generated es bundle
    replace({
      __DEV__: false
    })
  ],
  output: {
    file: createFileName('esm-browser.prod'),
    format: 'es'
  }
}

// cjs
const cjsConfig = {
  plugins: [
    replace({
      __DEV__: true
    })
  ],
  output: {
    file: createFileName('cjs'),
    format: 'cjs'
  }
}

// cjs.prod
const cjsProdConfig = {
  plugins: [
    terser(),
    replace({
      __DEV__: false
    })
  ],
  output: {
    file: createFileName('cjs.prod'),
    format: 'cjs'
  }
}

// global
const globalConfig = {
  plugins: [
    replace({
      __DEV__: true,
      'process.env.NODE_ENV': true
    })
  ],
  output: {
    file: createFileName('global'),
    format: 'iife',
    name
  }
}

// global.prod
const globalProdConfig = {
  plugins: [
    terser(),
    replace({
      __DEV__: false
    })
  ],
  output: {
    file: createFileName('global.prod'),
    format: 'iife',
    name // // 打包后的全局变量
  }
}

const formatConfigs = [
  esBundleConfig,
  esBrowserProdConfig,
  esBrowserConfig,
  cjsConfig,
  cjsProdConfig,
  globalConfig,
  globalProdConfig
]

function createPackageConfigs () {
  return formatConfigs.map(formatConfig => {
    return mergeConfig(createBaseConfig(), formatConfig)
  })
}

export default createPackageConfigs()
