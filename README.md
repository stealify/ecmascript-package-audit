# ecmascript-package-audit
This Package Includes code that is needed to read so called module packages in diffrent formarts and create clean ECMAScript from it.

It handels diffrent Module and Package types. And is designed to do quick audits on so called Packages and the module content of them.
It should provide hints to upgrade that packages so that they are consumeable by more environments and engines. 
It should provide hints on package/module performance

## Features
- Detects dynamic require and import
- Detects packages consume able by node 0.10 + typescript pre 4.5 via require('packagename')
- Detects packages consume able by node 12+ require/package-name, 
- Detects packages not consume able by Typescript-4.6 nodenext node12
- Detects packages with files that are not covered by a exports map
- Detects modules that use module.exports
- Detects UMD modules.
- Detects if a file is a Module or a Script and if it has sideEffects.

## Transition Flow
1. remove module.exports replace with exports.default and __esModule: true (aka transition to es2015 module) typescript calles it "CommonJS"
2. If you got a big lib distribute it as single file modules with a additional index.js that can be used to reference all packages and this way allow easy backward compat.
3. try to avoid package.json exports fild as that makes no sense you can replicate all conditions via individual entrypoints that makes more sense
  3.1 you will gain nothing from conditions and you will get a lot of issues when your not strict using ESNext Syntax and Imports with correct pathes or at last urls 
4. if you want to deploy with environment detection you can do so via implementing that into a extra file that includes index.js + environment detection for the needed parts.
5. Environment detection is most time contra productive in terms of compat it is better to do feature detection based on the known target environments.
6. if your a typescript user it makes sense to add a index.d.ts and additional .ts files for every file stealify tooling can bundle the d.ts files
7. reference the index.d.ts file via the types fild of the package.json
8. if exports condition is in the package.json we need to check that as all see that as authoritativ that means they ignore other filds only the browser fild gets hornored by convention.
 8.1 for better compat of package systems we convert everything to optional exports if needed and also include the level 1 filds into the exports as also resolve subpath patterns and write everything into the package.json as diskspace costs less then computation power it makes no sense to keep that meta file small.
 8.2 as pointed out in 3. the conditional exports add none needed overhead and are a bad thing. while they at last indicate engine support you should avoid them in packages that do not realy get packaged for a ton of enviornments.
 8.3 create a central package that consumes individual environment packages. to help new developers. Or to help Integrators that need to deploy the same package to multiple environments.
9. Try to isolate your integration tests from your main package so that you can deploy them individual as package but add tooling to the main package that makes sure that tests are written before publishing as rule a set of integration tests can pass on diffrent versions of the package while unit tests are optional when the IDE already supports testing Integration tests are mandatory needed!
  9.1 for the highest level of code quality and confidence apply runtime typechecking via so called assert calls this can get transpiled away for production if needed
11. keep unit tests in the same package as the main code but you should most time not need unit tests as when you follow Stealify Guidelines your already testing your code while your coding on it via eslint and typescript as also additional test runs on a regular base. but at last Integration tests for your final package goal should exist.
12. learn about profiling in diffrent engines and start adding performance metrics of your code to indicate code quality.
13. often you need 2 builds to get the final build that is correct https://github.com/rollup/rollup/issues/1156 In the Stealify Guides we call that often a dev bundle you create first the dev or api bundle and then reference that in other bundels so you can keep the api docs consistent and maintainance low. Many even big Projects do that wrong they document the final build result that gets shipped and not the internals. 



## Transitions
For example, let’s say we have a old code base with a cjs module lets add a esm module and load both in ESM. The first is the CommonJS module, and the second is an ES module (note the different file extensions and remember we set type: "module" in our package.json and renamed all files to cjs before we introduced the first esm module):

```js
// cjs-module-a.cjs
module.exports = function() {
  return 'I am CJS module A';
};

// esm-module-a.js 
export function esmModuleA() {
  return 'I am ESM Module A';
};

export default esmModuleA;
To use the CommonJS module in an ES module script (note the .mjs extension and use of the import keyword):

// index.mjs
import esmModuleA from './esm-module-a.mjs';
import cjsModuleA from './cjs-module-a.js';
console.log(`esmModuleA loaded from an ES Module: ${esmModuleA()}`);
console.log(`cjsModuleA loaded from an ES Module: ${cjsModuleA()}`);
```

note that we did not use a namedExport in the CJS Module this becomes importent
when you start understanding packaging this little example shows you that nodejs 

under ESM Conditions exports default of a ESM module as the module.exports property

there is a new variant of modules that do work with bundlers and tooling
we call that esModuleInterOp it allows to return the default exports property of a CJS module which is else not the common behavior. NodeJS has esModuleInterop!

https://www.typescriptlang.org/tsconfig#esModuleInterop
```
// esModuleInterOp will return the helloWorld function on
// require and import
'use strict'
Object.defineProperty(exports, "__esModule", { value: true });
const helloWorld = () => `Hello World`
assert.equal(require(__filename), helloWorld)
exports["default"] = helloWorld;
```
https://www.typescriptlang.org/tsconfig#allowSyntheticDefaultImports
```
// esModuleInterOp will return the helloWorld function on
// require and import
const helloWorld = () => `Hello World`
assert.equal(require(__filename), helloWorld)
exports["default"] = helloWorld;
```


when you got cjs code that does not already has in its first line use strict you should enable that and look if your code still works before you upgrade to esModules (ESM Transpiled to CJS)

as rule of thumb when you use the default property you should maybe use it always or never in future there should be no need for modules with a default export

the import pattern
```
import x from 'x';
```
should disapear and get replaced by

```
import { fn } from 'x'
```

if x is written with a default only export create a wrapper file and reexport it.
maybe convince the maintainers to drop the default export 


is the marker for none sideEffect sideEffect full statements.
```
 /*#__PURE__*/
```
helps with tree shaking 

there is a interristing typescript issue about import * and cjs when module.exports = class | function with prototypes and so on


## Solutions
Write everything for the bundler so that it can act as a preloader and it will produce the final loadable output. as rule of thumb always  use namedExports only in your modules and only import named modules solves all cases!.

Typescript is not a bundler it is a JS and Typescript declaration file consumer it can emit downleveled code and helpers but as soon as you want to work with none
Typescript Process able Modules or Asset Types you will need a bundler or you wrote already the correct code for your environment loader.
