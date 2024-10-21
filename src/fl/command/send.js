const { send } = require("../midi")

module.exports.execute = (cc, v, channel=0) => send(cc, v, channel);