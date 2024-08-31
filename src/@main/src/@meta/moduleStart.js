const { src } = require("../..");
const { Math } = require("../../common");
const { fileExists, measureStart, measureEnd } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!start", "!restart"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const module = args(text)[0];
    if (fileExists("src", module, "index.bat")) {
        const m = measureStart(); const ret = await src().module.start(module, true);
        _reply(`Reloaded ${module}! duration: ${Math.prec(measureEnd(m))}ms`);
        return ret;
    } else {
        _reply(`${module} is not a module.`);
        return [1, ""];
    }
}