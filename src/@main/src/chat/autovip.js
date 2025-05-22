const { data, send } = require("../..");
const { remove } = require("../../common");

module.exports.grant = async id => {
    let vips = data().stream.vips;
    if (vips.includes(id))
        vips = [id, ...remove(vips, id)];
    else { 
        vips = [id, ...vips];
        if (vips.length > 50) await send("twitch", "removevip", vips[50]);
        await send("twitch", "addvip", id);
        vips = vips.slice(0, 50);
    }
    data("stream", {vips: vips});
}