const fs = require('fs');
const babelParser = require('@babel/parser');

const ast = babelParser.parse(fs.readFileSync('../server/src/services/invoices.js', { encoding: 'utf-8' }));
console.log(ast.program.body);