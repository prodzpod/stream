const { send } = require("../ws")

module.exports.execute = req => {
    send("raidout", req.to_broadcaster_user_id, req.to_broadcaster_user_name, req.viewers);
}