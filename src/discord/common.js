const { WASD, Math, inPlaceSort } = require("../@main/common"); //! REWRITE INTO DIFFERENT LANGUAGE ON REMAKE
const { listFiles, path, measureStart, measureEnd } = require("../@main/commonServer");
module.exports.WASD = WASD;
module.exports.Math = Math;
module.exports.listFiles = listFiles;
module.exports.path = path;
module.exports.measureStart = measureStart;
module.exports.measureEnd = x => Math.prec(measureEnd(x));
module.exports.inPlaceSort = inPlaceSort;

module.exports.BOT_ID = "1220255491956015154";
module.exports.BOT2_ID = "1237994640427450378";
module.exports.IRC_ID = "1117223939014410261";

module.exports.SERVER = "1219954701726912583";
module.exports.SERVER_EMOTES = "1269775966893379636";

module.exports.CHANNEL_ANNOUNCEMENT = "1219958741495975936";
module.exports.CHANNEL_REACTIONROLE = "1219956526794543194";
module.exports.CHANNEL_GENERAL = "1219954701726912586";
module.exports.CHANNEL_CIRCLE = "1270496759545593927";

module.exports.MESSAGE_REACTIONROLE = "1270499013820547122";

module.exports.ROLE_CIRCLE = "1270494916325277727";