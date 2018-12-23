/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 23-12-18
 */
 import MDXCompiler from './compiler';

 Plugin.registerCompiler({
   extensions: ['mdx'],
 }, function compiler() {
   return new MDXCompiler();
 });
