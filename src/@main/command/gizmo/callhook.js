const { src, send, data } = require("../..");
const { unentry } = require("../../common");
const { log } = require("../../commonServer");
const { TYPE } = require("../../src/blessscript/bsUtil");
const { detokenize, tokenize, toString } = require("../../src/blessscript/eval/bsEvalUtil");
const { chat } = require("../../src/chat/chat");

module.exports.execute = async (author, state, data2) => {
    let chatter = Object.values(data().user).find(x => x.twitch.name === author);
    data2 = unentry(data2);
    data2.ai = chatter.shimeji.ai;
    for (let c in data2.ai) {
        let v = data2.ai[c];
        if (typeof v !== "object") data2.ai[c] = v;
        else data2.ai[c] = v.value / v.max;
    }
    data2.memory = chatter.shimeji.memory?.slice(0, 2000) ?? "";
    let code = data().hooks.shimeji[state][chatter.twitch.id] ?? data().hooks.shimeji[state][0];
    let res = "idle 1000"; let tokens, stack;
    if (code) {
        [res, tokens, stack] = await src().bsMain.runRaw(code, () => {}, chatter, {}, tokenize(data2).value);
        src().bsReportHook.report("shimeji", state, chatter.twitch.id, code, res, tokens, stack);
        if (res.type === TYPE.error) res = "idle 1000";
        else res = detokenize(res);
        data("user." + chatter.twitch.id + ".shimeji.memory", toString(stack.var[0].memory));
    }
    // log("bs hook running", state, "for", author, ":", res);
    if (res !== undefined) return [0, res];
    return [1, ""];
}