const { sendClient } = require("../../../@main/include");
const { log, id, ID } = require("../../include");

module.exports.condition = "!raid";
module.exports.permission = false;
module.exports.execute = async (req) => {
    let user;
    if (Array.isArray(req)) user = req[1];
    else user = req.payload.event.from_broadcaster_user_name;
    if (user == id) {
        log("detected raiding out, ending stream");
        sendClient(ID, 'main', `endstream`);
    } else log("raid notification:", user);
}