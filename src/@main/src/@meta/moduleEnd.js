const { src } = require("../..");
const { stopReal } = require("../../../..");
const { Math, nullish } = require("../../common");
const { fileExists, measureStart, measureEnd, info, backupLog } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!end", "!kill", "!stop"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const module = args(text)[0];
    if (nullish(module) === null) { await backupLog(); stopReal(); info("Exiting Process"); process.exit(0); return; }
    if (fileExists("src", module, "index.bat")) {
        const m = measureStart(); const ret = await src().module.end(module);
        if (ret[0] === 0) _reply(`Reloaded ${module}! duration: ${Math.prec(measureEnd(m))}ms`);
        else _reply(`${module} is already not active.`);
        return ret;
    } else {
        _reply(`${module} is not a module.`);
        return [1, ""];
    }
}