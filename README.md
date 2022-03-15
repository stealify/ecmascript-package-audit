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
