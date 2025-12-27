const { data, src, send } = require("../..");
const { nullish, getIdentifier, WASD } = require("../../common");
const { log } = require("../../commonServer");
const LZString = require("../../libs/lz-string");
module.exports.execute = async (...args) => {
    const _heatmap = LZString.decompressFromEncodedURIComponent(data().hwg.heatmap);
    if (!_heatmap) return [0, {res: 0}];
    const heatmap = JSON.parse(_heatmap);
    const max = Math.max(...heatmap.flat());
    const value = heatmap[Math.floor(Number(args[0] ?? 0) / (1920 / heatmap.length))]?.[Math.floor(Number(args[1] ?? 0) / (1080 / heatmap[0].length))];
    return [0, {res: value / max}];
}