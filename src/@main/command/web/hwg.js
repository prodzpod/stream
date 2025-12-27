const { data, src, send } = require("../..");
const { nullish, getIdentifier, WASD } = require("../../common");
const { log } = require("../../commonServer");
module.exports.execute = async (...args) => {
    switch (args[0]) {
        case "send":
            send("web", "ws", "hwg", WASD.pack({action: args[1], object: args[2]}));
        case "heatmap-save":
            data("hwg.heatmap", args[1]);
            break;
        case "heatmap-request":
            const q = data().hwg.heatmap;
            if (q) send("web", "ws", "hwg", WASD.pack({action: "heatmap-load", heatmap: q}));
            break;
    }
    return [0, ""];
}