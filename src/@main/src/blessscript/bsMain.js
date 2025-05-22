const { src } = require("../..");
const { split, WASD } = require("../../common");
const { log } = require("../../commonServer");

// *parses and executes blessscript string.
// *(execute default params) => any
module.exports.predicate = ["!bs", "!blessscript", "!bless", "!run"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (from?.from == "blessscript") return [1, "cannot call bs within bs"];
    return await module.exports.run(split(text, " ", 1)[1], _reply, chatter, message);
}

// runs string raw
// (string, string => (), "chatter" || null, "message" || null) => any
module.exports.run = async (txt, _reply, chatter = null, message = null, prestack = {}) => {
    let [res, tokens, stack] = await module.exports.runRaw(txt, _reply, chatter, message, prestack);
    log("txt:", txt);
    log("tokens:", tokens);
    log("res:", res);
    _reply(WASD.pack(res));
    return [0, res]; // placeholder
}

module.exports.runRaw = async (txt, _reply, chatter = null, message = null, prestack = {}) => {
    let stack = module.exports.getDefaultToken(_reply, chatter, message, prestack);
    let tokens;
    [tokens, stack] = await src().bsScan.scan(txt, module.exports.getDefaultToken(_reply, chatter, message, prestack));
    stack.isReturnValue = true;
    let res;
    [res, stack] = (await src().bsEval.eval(tokens, stack));
    return [res, tokens, stack];
}

module.exports.getDefaultToken = (_reply, chatter = null, message = null, prestack = {}) => {
    let stack = new (src().bsUtil.StackData)();
    stack.chatter = chatter; stack.message = message; stack.from = { from: "blessscript", _reply: _reply };
    Object.assign(stack.var[0], prestack);
    return stack;
}