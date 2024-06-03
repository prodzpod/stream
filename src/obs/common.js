const { WASD, Math, delay, randomHex } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));

module.exports.delay = delay;
module.exports.randomHex = randomHex;