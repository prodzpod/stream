const { send } = require("../ws")

module.exports.execute = req => {
    send("delete", req.message_id);
}