import { transformSync } from '@swc/core';
import { strict as assert } from 'assert';
import PluginImport from '../lib/import.js';

describe('PluginImport', function() {
  it('should transform lodash', function() {
    const output = transformSync(`
      import React from 'react';
      import { debounce } from 'lodash';
    `, {
      plugin(m) {
        return new PluginImport.default().visitProgram(m);
      },
    });
    assert.equal(output.code, `
      import React from 'react';
      import debounce from "lodash/debounce";
    `.trimStart().replace(/^\s+/mg, ''));
  });
});
