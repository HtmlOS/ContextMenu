'use strict';

import babel from 'rollup-plugin-babel';
// 为了让rollup识别commonjs类型的包,默认只支持导入ES6
import commonjs from 'rollup-plugin-commonjs';
// 为了支持import xx from 'xxx'
import nodeResolve from 'rollup-plugin-node-resolve';
// 支持加载json文件
import json from 'rollup-plugin-json';
// 支持字符串替换, 比如动态读取package.json的version到代码
import replace from 'rollup-plugin-replace';
// 读取package.json
import pkg from './package.json';
// 代码生成sourcemaps
import sourceMaps from 'rollup-plugin-sourcemaps';

// PostCSS plugins
import postcss from 'rollup-plugin-postcss';
import simplevars from 'postcss-simple-vars';

import cssnested from 'postcss-nested';
import cssnext from 'postcss-preset-env';
import cssnano from 'cssnano';

// 最小化编译
import {terser} from 'rollup-plugin-terser';

// ts转js的编译器
import typescript from 'rollup-plugin-typescript2';

let defaults = {compilerOptions: {declaration: true}};
let override = {compilerOptions: {declaration: false}};

// 当使用汇总绑定库时，我们通常希望避免包含对等依赖项，
// 因为它们应该由库的使用者提供。通过排除这些依赖项，
// 我们可以减小捆绑大小，避免捆绑重复的依赖项。
// 我们可以使用Rollup外部配置选项来实现这一点，
// 为它提供一个要从包中排除的对等依赖项列表。
// 此插件自动执行该过程，自动将库的对等依赖项添加到外部配置中。
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

//在打包完成时候现实出打包文件的体积大小，这个帮助我们分析包体积，并调整控制
import filesize from 'rollup-plugin-filesize';

// 是否开发环境
const isDev = process.env.NODE_ENV !== 'production';
console.log(`process.env.NODE_ENV=${process.env.NODE_ENV}`);

// web 服务
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

//查找外部模块并安装
import localResolve from 'rollup-plugin-local-resolve';

// 多个入口
import multiEntry from 'rollup-plugin-multi-entry';

// 代码头
const banner = `/*!
 * ${pkg.name}.js v${pkg.version}
 * (c) 2018-${new Date().getFullYear()} ${pkg.author.name}
 * ${pkg.homepage}
 * Released under the ${pkg.license} License.
 */
 `;
export default {
    input: './src/index.ts',
    plugins: [
        isDev &&
            serve({
                open: true,
                host: 'localhost',
                port: 8080,
                contentBase: ['serve', 'dist'],
                historyApiFallback: false,
                //set headers
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }),
        isDev && livereload('serve'),
        isDev && multiEntry(),
        // 代码中的__VERSION__字符串会被package.json中的version字段所替代
        replace({
            __VERSION__: pkg.version,
        }),
        typescript({
            exclude: 'node_modules/**',
            typescript: require('typescript'),
            tsconfigDefaults: defaults,
            tsconfig: 'tsconfig.json',
            tsconfigOverride: override,
        }),
        json(),
        localResolve(),
        filesize(),
        peerDepsExternal(),
        nodeResolve({
            mainFields: ['module', 'main'],
        }),
        commonjs({
            include: 'node_modules/**',
        }),
        postcss({
            extract: true,
            plugins: [simplevars(), cssnested(), cssnext({warnForDuplicates: false}), cssnano()],
            extensions: ['.css'],
        }),
        sourceMaps(),
        babel({
            exclude: 'node_modules/**',
        }),
        terser({
            output: {
                comments: new RegExp(pkg.title),
            },
            compress: {
                pure_funcs: isDev ? [] : ['console.log'], // 去掉console.log函数
            },
        }),
        {banner: banner},
    ],
    output: [
        {
            format: 'cjs',
            // 生成的文件名和路径
            // package.json的main字段, 也就是模块的入口文件
            file: pkg.main,
            sourcemap: true,
        },
        {
            format: 'es',
            // rollup和webpack识别的入口文件, 如果没有该字段, 那么会去读取main字段
            file: pkg.module,
            sourcemap: true,
        },
        {
            format: 'umd',
            name: pkg.title,
            file: pkg.browser,
            sourcemap: true,
        },
    ],
};
