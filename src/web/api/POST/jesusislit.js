const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    let args = body?.args; if (!args || !args.length) return [400, "??"];
    if (!["setscene", "announcevalue", "specialbutton"].includes(args[0])) return [403, "no"];
    send(...args);
    return [200, {res: 'wah'}];
}