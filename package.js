/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 17-12-18
 */
 /* eslint-disable no-var, prefer-arrow-callback */
 var packages = [
   'ecmascript',
   'isobuild:compiler-plugin@1.0.0',
 ];

 Package.describe({
   name: 'apollinaire:mdx',
   version: '0.0.2',
   summary: 'Compiler plugin that supports Markdown and MDX files in Meteor',
   git: 'https://github.com/Apollinaire/meteor-mdx',
   documentation: 'README.md',
 });

 Package.registerBuildPlugin({
   name: 'compile-mdx',
   use: [
     'ecmascript',
     'babel-compiler@7.2.3',
     //'caching-compiler'
   ],
   sources: [
     'compiler.js',
     'plugin.js',
   ],
   npmDependencies: {
     '@mdx-js/mdx': '0.16.6',
   },
 });

 Package.onUse(function use(api) {
   api.versionsFrom('1.3.2.4');

   api.use(packages, ['server', 'client']);
 });

 Package.onTest(function test(api) {
   // api.use(packages, ['server', 'client']);
   // api.use('swydo:graphql');
   // 
   // api.use([
   //   'meteortesting:mocha',
   // ]);
   // 
   // api.mainModule('specs/server.spec.js', 'server');
   // api.mainModule('specs/client.spec.js', 'client');
 });
