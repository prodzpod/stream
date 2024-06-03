const { WASD, Math, split, unentry, nullish } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd, fileExists } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));

module.exports.fileExists = fileExists;
module.exports.split = split;
module.exports.unentry = unentry;
module.exports.nullish = nullish;