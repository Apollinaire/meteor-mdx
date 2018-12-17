/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 17-12-18
 */

import mdx from '@mdx-js/mdx';
import { BabelCompiler } from 'meteor/babel-compiler';

export default class MDXCompiler /*extends MultiFileCachingCompiler*/ {
  constructor() {
    // super({
    //   compilerName: 'compile-mdx',
    // 
    // });
    this.babelCompiler = new BabelCompiler({
      runtime: false, // keep this? it's from coffeeScript: https://github.com/meteor/meteor/blob/0fcc7ddd46d0ef8a278376ba64538210486ab646/packages/non-core/coffeescript-compiler/coffeescript-compiler.js#L25
      react: true,
    });
  }
  
  /**  
   * processFilesForTarget - The entry point of the compiler.
   *    
   * @param  {Object[]} files an array containing all the .mdx files (as a meteor file class)
   */   
  processFilesForTarget(files) {
    return Promise.all(files.map(this.processOneFile.bind(this)));
  }

  /**
   * compileES6Module - uses babel-compiler to compile a string containing an es6 styled js file.
   *
   * @param  {(string|Object)} file a file object like passed by the meteor build tool
   * @param  {string}          source the source to compile
   * @return {Object}          An object {data:string,path:string} that can be passed to file.addJavaScript()
   */

  compileES6Module(file, source) {
    return this.babelCompiler.processOneFileForTarget(file, source);
  }


  /**
   * processOneFile - Give it one file, it will be added to the bundle
   *    
   * @param  {type} file the file to process
   * @return {Promise}      A promise that resolves by adding the processed file to the bundle.
   */   
  processOneFile(file) {
    try {
      // const path = `${file.getPathInPackage()}.js`;
      const content = file.getContentsAsString().trim();
      // mdx takes a string containing an mdx file and returns a promise that resolves a string containing an ES6+JSX file.
      const processedES6Content = mdx(content);
      var _this = this;
      return processedES6Content.then(fileContent => {
        // mdx does not add the imports in its file, so we do it here.
        const processedES6ContentWithImports = `
import React from 'react'
import { MDXTag } from '@mdx-js/tag'
${fileContent}
        `;

        // then we must process this es6 module with babel-compiler
        const processedFile = _this.compileES6Module(file, processedES6ContentWithImports);
        // finally, add the file to the bundle.
        file.addJavaScript(processedFile);
      });
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

}
