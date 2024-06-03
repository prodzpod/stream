const { send } = require("../..");
const { unstringify } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!gravity"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, reply) => {
    let _args = args(text).map(x => unstringify(x));
    let x = 0, y = 0;
    if (typeof _args[0] === "number" && typeof _args[1] === "number") { x = _args[0]; y = _args[1]; }
    else if (typeof _args[0] === "number") { y = _args[0]; }
    else {
        _args = _args.map(x => x.toString().toLowerCase());
        if (_args.includes("left")) x -= 4;
        if (_args.includes("right")) x += 4;
        if (_args.includes("up")) y -= 4;
        if (_args.includes("down")) y += 4;
    }
    if (x === 0 && y === 0) y = 4;
    log("Redeeming:", "gravity", x, y);
    _reply("i think the homestuck one is better");
    send("gizmo", "gravity", x, y); return [0, ""];
}