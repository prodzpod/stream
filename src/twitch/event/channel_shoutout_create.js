const { send } = require("../ws")

module.exports.execute = req => {
    send("shoutoutgiven", req.to_broadcaster_user_id, req.to_broadcaster_user_name, req.cooldown_ends_at);
}