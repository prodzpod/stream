const { send } = require("../ws");

module.exports.execute = req => {
    send("malphonredeem", req.user_id, req.reward.title);
}