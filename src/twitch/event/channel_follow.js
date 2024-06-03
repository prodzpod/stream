const { send } = require("../ws")

module.exports.execute = req => {
    send("follow", req.user_id, req.user_name);
}