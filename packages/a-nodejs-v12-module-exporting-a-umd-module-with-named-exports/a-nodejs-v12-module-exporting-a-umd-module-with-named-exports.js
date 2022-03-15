// we use directly always the path as we package that for testing
// to eliminate resolve inconsistencys we write always real relativ disk pathes.
const aUMDmodule = require('../a-umd-module-with-named-exports/a-umd-module-with-named-exports.js');
module.exports = aUMDmodule;
