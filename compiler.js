/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 23-12-18
 */

import mdx from '@mdx-js/mdx';
import { BabelCompiler } from 'meteor/babel-compiler';
import { SourceMapConsumer, SourceMapGenerator } from 'source-map';

export default class MDXCompiler extends CachingCompiler {
  constructor() {
    super({
      compilerName: 'compile-mdx',
      defaultCacheSize: 1024 * 1024 * 10,
    });
    this.babelCompiler = new BabelCompiler({
      runtime: false, // keep this? it's from coffeeScript: https://github.com/meteor/meteor/blob/0fcc7ddd46d0ef8a278376ba64538210486ab646/packages/non-core/coffeescript-compiler/coffeescript-compiler.js#L25
      react: true,
    });
  }

  /**
   * getCacheKey - required by caching-compiler
   *
   * @param  {file} inputFile
   * @return {string}           a hash that can identify the file
   */

  getCacheKey(inputFile) {
    return inputFile.getSourceHash();
  }

  setDiskCacheDirectory(cacheDir) {
    this.cacheDirectory = cacheDir;
  }

  /**
   * compileResultSize - required by caching-compiler
   *
   * @param  {Object} compileResult an object with `source` and `sourceMap` keys, containing strings with the compiled source code and its sourceMap
   * @return {Number} the total size of the compiled result;
   */

  compileResultSize(compileResult) {
    return compileResult.source.length + compileResult.sourceMap.length;
  }

  /**
   * compileOneFile - required by caching-compiler - this is where we transform an mdx source file into a js file compiled by babel.
   *
   * @param  {file} inputFile the file loaded by meteor.
   * @return {Object}           an object with `source` and `sourceMap` keys, containing strings with the compiled source and its sourcemap.
   */
  compileOneFile(inputFile) {
    try {
      const content = inputFile.getContentsAsString().trim();
      // mdx takes a string containing an mdx file and returns a string containing an ES6+JSX file.
      // TODO: add the possibility to put options/plugins to mdx if we can get them here. How does the babel compiler see what's in .babelrc?
      //   var babelrcPath = inputFile.findControlFile(".babelrc");
      //   JSON5.parse(inputFile.readAndWatchFile(babelrcPath))
      // see https://github.com/meteor/meteor/blob/0fcc7ddd46d0ef8a278376ba64538210486ab646/packages/babel-compiler/babel-compiler.js#L194
      const jsx = mdx.sync(content);
      //mdx does not add the imports at the beginning. We need react and mdx-tag for the module to compile.
      // TODO: add the option to load more lines for the mdx plugins or change react / MDXTag
      const jsxComplete = `
import React from 'react'
import { MDXTag } from '@mdx-js/tag'
${jsx}
`;

      this.babelCompiler.setDiskCacheDirectory(this.cacheDirectory);
      // then we must process this es6 module with babel-compiler
      const output = this.babelCompiler.processOneFileForTarget(inputFile, jsxComplete);

      // extract the source
      const source = output.data;
      // extract the source-map
      // const sourceMap = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(processedFile.sourceMap)).toJSON();
      const sourceMap = JSON.stringify(output.sourceMap);
      // the return object will be stored in cache and/or passed to this.addCompileResult and this.compileResultSize as `compileResult`
      return { source, sourceMap };
    } catch (e) {
      if (e.locations) {
        file.error({
          message: e.message,
          line: e.locations[0].line,
          column: e.locations[0].column,
        });
      } else {
        throw e;
      }
    }
  }

  addCompileResult(inputFile, compileResult) {
    inputFile.addJavaScript({
      path: inputFile.getPathInPackage() + '.js',
      sourcePath: inputFile.getPathInPackage(),
      data: compileResult.source,
      sourceMap: compileResult.sourceMap,
    });
  }
}
