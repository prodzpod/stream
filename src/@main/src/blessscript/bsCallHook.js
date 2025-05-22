const { data, src } = require("../..");

module.exports.command = (_reply, x, from, chatter, message, text, emote, reply) => {
    const hooks = data().hooks.command[x] ?? {};
    if (from?.from !== "blessscript") for (const id in hooks) {
        const code = hooks[id];
        if (!code) continue; const source = data().user[id];
        (async () => {
            let [res, tokens, stack] = await src().bsMain.runRaw(code, _reply, source, {}, src().bsEvalUtil.tokenize({ 
                from: from,
                chatter: chatter,
                message: message,
                text: text,
                emote: emote,
                reply: reply
            }).value);
            src().bsReportHook.report("command", x, id, code, res, tokens, stack);
        })();
    }
}

module.exports.chat = (_reply, from, chatter, message, text, emote, reply) => {    
    if (from?.from !== "blessscript") for (const k in data().hooks.chat) {
        if (k.startsWith("^") ? text.startsWith(k.slice(1)) : text.includes(k)) {
            let hooks = data().hooks.chat[k];
            for (const id in hooks) {
                const code = hooks[id];
                if (!code) continue; const source = data().user[id];
                (async () => {
                    let [res, tokens, stack] = await src().bsMain.runRaw(code, _reply, source, {}, src().bsEvalUtil.tokenize({ 
                        from: from,
                        chatter: chatter,
                        message: message,
                        text: text,
                        emote: emote,
                        reply: reply
                    }).value);
                    src().bsReportHook.report("chat", k, id, code, res, tokens, stack);
                })();
            }
        }
    }
}