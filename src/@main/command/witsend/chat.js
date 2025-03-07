const { src, send } = require("../..");
const { log } = require("../../commonServer");

module.exports.execute = async (id, author, color, message, time) => {
    return await src().chat.message(
        "witsend", 
        { witsend: { id: author, name: author, color: color } }, 
        { witsend: { id: id, channel: 0 }}, 
        message ?? "", [], null);
}