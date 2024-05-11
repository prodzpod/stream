const { log, fetchUser } = require("../include");
module.exports.execute = (app, r, user) => {
    let message = r.message;
    let reaction = r.emoji.toString();
    log("reaction:", message.id, reaction, fetchUser(user));
}