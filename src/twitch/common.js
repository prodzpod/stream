const { WASD, Math, nullish } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));

module.exports.nullish = nullish;

module.exports.STREAMER_LOGIN = "prodzpod";
module.exports.STREAMER_ID = "140410053";
module.exports.CLONK_ID = "866686220";
module.exports.MALPHON_ID = "1070508385";
module.exports.LALA_ID = "895949231";
module.exports.BOT_ID = "g584kjzcj1tr15ouxg0fko2ybnckxh";