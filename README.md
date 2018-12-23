# compile-mdx

This package lets you compile `.mdx` files into a javascript bundle that you can import like a React component.

See the [mdx docs](https://mdxjs.com) for a specification of mdx syntax.

## Usage


```js
import React from 'react';
import MyMDXFile from 'MyMDXFile.mdx';

function MyComponent(){
  return (
      <MyMDXFile/>
  );
}
```

## Installation

```sh
meteor add apollinaire:mdx
```

Inside a package: in `package.js`
```js
Package.onUse(function (api) {
  api.onUse([
    'apollinaire:mdx',
  ]);
});
```

## Why not .md files?

Because meteor will load and transpile every readme.md from your node modules, and it will take a long time to compile these files. You can still write regular markdown in a .mdx file. You can also clone this repo, and add support for md like this in `plugin.js`: 

```js
 Plugin.registerCompiler({
   extensions: ['mdx', 'md'],
 }, function compiler() {
   return new MDXCompiler();
 });
```

## Credits

Thanks to @benjamn and @klaussner for their help!
