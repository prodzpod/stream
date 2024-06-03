const { send } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");

module.exports.predicate = "!qat";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    const html = await send("qat", "qat", split(text, " ", 1)[1]);
    const start = html.indexOf("<div class=\"in\">", html.indexOf("<td class=\"l\">")) + "<div class=\"in\">".length;
    const end = html.indexOf("</div>", start);
    const div = html.slice(start, end).replaceAll("<br>", "\n");
    const data = Array.from(div.matchAll(/<b>Length \d+<\/b>/g)).map(x => {
        const start = div.indexOf("</b>", x.index) + "</b>".length;
        let end = div.indexOf("<b>", start);
        if (end === -1) end = div.indexOf("<i>", start);
        if (end === -1) end = div.length;
        return div.slice(start, end).replace(/\s+/g, " ").trim();
    }).join(" ");
    _reply(data);
    return [0, data];
}