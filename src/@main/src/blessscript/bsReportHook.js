const { send } = require("../..")

let cache = [];
module.exports.report = async (module, name, id, code, res, token, stack) => {
    let k = [module, name, id, code].join(" ");
    if (cache.includes(k)) return;
    cache.push(k);
    send("web", "report", module, name, id, code, res, token, stack);
}

module.exports.resetCache = () => { cache = []; }