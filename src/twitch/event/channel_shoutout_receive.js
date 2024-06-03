const { send } = require("../ws")

module.exports.execute = req => {
    send("shoutout", req.from_broadcaster_user_id, req.from_broadcaster_user_name, req.viewer_count);
}