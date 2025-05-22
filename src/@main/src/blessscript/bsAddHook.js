const { data } = require("../..");
const { split, WASD, unique } = require("../../common");
const { log, listFiles } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!addhook", "!hook"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    log(text);
    const modules = ["shimeji", "chat", "command", ...unique((await listFiles("src/@main/command")).map(x => split(x, "/", 1)[0]))];
    let module, name, command;
    let c = text.trimStart();
    c = c.slice(c.indexOf(" ")).trimStart(); // .!hook
    module = c.slice(0, c.indexOf(" ")); c = c.slice(c.indexOf(" ")).trimStart(); // module
    if (c.startsWith("\"")) {
        name = ""; c = c.slice(1);
        while (true) {
            let idx = c.indexOf("\"");
            name += c.slice(0, idx);
            if (c[idx+1] !== "\"") { c.slice(idx + 1); break; }
            name += "\""; c = c.slice(idx + 2);
        }
    }
    else {
        name = c.slice(0, c.indexOf(" ")); c = c.slice(c.indexOf(" ")).trimStart(); // name
    }
    command = c;
    if (!modules.includes(module)) { _reply("valid modules: `" + modules.join("`, `") + "`"); return [1, ""]; }
    if (!name) { _reply("name is empty"); return [1, ""]; }
    else if (!command) { 
        if (data().hooks[module][name]?.[chatter.twitch.id]) {
            data("hooks." + module + "." + name + "." + chatter.twitch.id, false); 
            _reply("hook " + module + " " + name + " was removed!");
            return [0, name];
        }
        else { _reply("you dont have a hook here already"); return [1, ""]; }
    }
    let z = {}; z[chatter.twitch.id] = command;
    data("hooks." + module + "." + name, z); 
    _reply("hook " + module + " " + name + " was added!");
    return [0, z];
}
