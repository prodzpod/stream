const { src, commands, setCommand, setSrc } = require("../..");
const { Math } = require("../../common");
const { path, measureStart, measureEnd, log, error } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!reload";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text); const m = measureStart();
    try {
        let fpath;
        if (commands()[_args[0]]) { // reload command
            const module = _args[0];
            fpath = _args[1];
            if (fpath.endsWith(".js")) fpath = fpath.slice(0, -".js".length);
            let resolve;
            try {
                resolve = require.resolve(path("src/@main/command", module, fpath));
                delete require.cache[resolve];
            } catch {
                resolve = require.resolve(path("external/@command", module, fpath));
                delete require.cache[resolve];
            }
            setCommand(module, fpath.split("/").at(-1), require(resolve).execute ?? (() => { warn("command", fname, "execute does not exist, skipping"); }));
        } else {
            fpath = _args[0];
            if (fpath.endsWith(".js")) fpath = fpath.slice(0, -".js".length);
            let resolve;
            try {
                resolve = require.resolve(path("src/@main/src", fpath));
                delete require.cache[resolve];
            } catch {
                resolve = require.resolve(path("external/@src", fpath));
                delete require.cache[resolve];
            }
            setSrc(fpath.split("/").at(-1), require(resolve) ?? { execute: (() => { warn("src", fname, "execute does not exist, skipping"); }) });
        }
        _reply(`reloaded ${fpath}! duration: ${Math.prec(measureEnd(m))}ms`);
        return [0, fpath];
    } catch (e) {
        error(e);
        _reply("target does not exist");
        return [1, ""];
    }
}