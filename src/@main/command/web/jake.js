const { src, send } = require("../..");

let _id = 0;
module.exports.execute = async (...args) => {
    if (!args.length) { _id++; return [0, _id]; }
    await src().jake[args[1]](args[0], ...args.slice(2));
    return [0, ""];
}