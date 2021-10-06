import { ImportDeclaration, Program, transformSync } from '@swc/core';
import Visitor from '@swc/core/Visitor';

const options = {
  "libraryName": "lodash",
  "libraryDirectory": "",
  "camel2DashComponentName": false,  // default: true
}

export default class PluginImport extends Visitor {
  visitImportDeclaration(e: ImportDeclaration): ImportDeclaration {
    if (e.source.value === options.libraryName) {
      const result = e.specifiers.map(specifier => {
        const chunk = [ e.source.value ];
        if (options.libraryDirectory) chunk.push(options.libraryDirectory);
        chunk.push(specifier.local.value);
        return ({
          type: 'ImportDeclaration',
          span: e.span,
          specifiers: [{
            type: 'ImportDefaultSpecifier',
            span: specifier.span,
            local: { value: specifier.local.value, span: specifier.span },
          }],
          source: {
            type: 'StringLiteral',
            span: e.source.span,
            value: chunk.join('/'),
          }
        }) as ImportDeclaration;
      });
      // FIXME: shoud generate multiple import declarations
      return result[0];
    }
    return e;
  }
}
