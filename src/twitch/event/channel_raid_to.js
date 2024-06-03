const { send } = require("../ws")

module.exports.execute = req => {
    send("raid", req.from_broadcaster_user_id, req.from_broadcaster_user_name, req.viewers);
}