const { send } = require("../ws")

module.exports.execute = req => {
    send("ban", req.user_id);
}