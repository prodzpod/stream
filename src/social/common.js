const { WASD, Math, nullish } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd, open } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));
module.exports.nullish = nullish;
module.exports.open = open;