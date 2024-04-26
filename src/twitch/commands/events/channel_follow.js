const { log } = require("../../include");

module.exports.condition = "!follow";
module.exports.permission = false;
module.exports.execute = async (req) => {
    let user;
    if (Array.isArray(req)) user = req[1];
    else user = req.payload.event.user_name;
    log("follower notification:", user);
}