/**
 * @Author: Apollinaire Lecocq <apollinaire>
 * @Date:   13-12-18
 * @Last modified by:   apollinaire
 * @Last modified time: 16-12-18
 */

import mdx from '@mdx-js/mdx';

export default class MDXCompiler {
  async processFilesForTarget(files) {
    files.forEach(file=>{console.log(file.getPathInPackage());})
    files.forEach(file => {
      const path = `${file.getPathInPackage()}.js`;
      // console.log(path)
      const content = file.getContentsAsString().trim();
      try {
        const result = mdx(content);
        result.then(fileContent => {
          let data = `
          import React from 'react'
          import { MDXTag } from '@mdx-js/tag'
          ${fileContent}
          `;
          // console.log(data);
          file.addJavaScript({
            data,
            path,
          });
        });
//       file.addJavaScript({path,data:`
//   const React = require('react')
//   const  tagger = require(@mdx-js/tag);
//   const MDXTag = tagger.MDXTag;
// module.exports = class MDXContent extends React.Component {
//   constructor(props) {
//     super(props)
//     this.layout = null
//   }
//   render() {
//     const { components, ...props } = this.props
// 
//     return <MDXTag
//              name="wrapper"
// 
//              components={components}><MDXTag name="h1" components={components}>{\`Hello\`}</MDXTag>
// <MDXTag name="p" components={components}>{\`This is me writing some mdx lul\`}</MDXTag>
// <MDXTag name="ol" components={components}>
// <MDXTag name="li" components={components} parentName="ol">{\`write a compiler\`}</MDXTag>
// <MDXTag name="li" components={components} parentName="ol">{\`write some mdx\`}</MDXTag>
// <MDXTag name="li" components={components} parentName="ol">{\`???\`}</MDXTag>
// <MDXTag name="li" components={components} parentName="ol">{\`profit\`}</MDXTag>
// </MDXTag>
//            </MDXTag>
//   }
// }
// `})
        //         data.then(result => {
        //           const code = `
        // import React from 'react'
        // import { MDXTag } from '@mdx-js/tag'
        // ${result}
        // `;
        //           file.addJavaScript({
        //             data: result,
        //             path: path,
        //           });
        //         });
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
    });
  }
}
