const { send, log, warn, error } = require('../include');
module.exports.condition = '!test'
module.exports.permission = true
module.exports.execute = async (message, user, data) => {
    send("TEST STREAM: none of this is really done, code is extremely messy, and the stream will most likely end in crashing. be aware!\n\nalso the on screen chat only supports ascii for now", user, data);
    return 0;
}