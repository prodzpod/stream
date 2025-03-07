const { src } = require("../..");
const { split, WASD } = require("../../common");
const { log } = require("../../commonServer");

// *parses and executes blessscript string.
// *(execute default params) => any
module.exports.predicate = ["!bs", "!blessscript", "!bless", "!run"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return await module.exports.run(split(text, " ", 1)[1], _reply, chatter, message);
}

module.exports.run = async (txt, _reply, chatter = null, message = null) => {
    let stack = new (src().bsUtil.StackData)();
    stack.chatter = chatter; stack.message = message;
    let tokens;
    [tokens, stack] = await src().bsScan.scan(txt, stack);
    const res = (await src().bsEval.eval(tokens, stack))[0];
    log("txt:", txt);
    log("tokens:", tokens);
    log("res:", res);
    _reply(WASD.pack(res));
    return [0, res]; // placeholder
}