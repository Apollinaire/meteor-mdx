/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 13-12-18
 */
 /* eslint-disable prefer-arrow-callback */
 import MDXCompiler from './compiler';

 Plugin.registerCompiler({
   extensions: ['mdx'],
 }, function compiler() {
   return new MDXCompiler();
 });
