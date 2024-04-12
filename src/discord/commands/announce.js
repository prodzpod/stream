const { log, warn, error, announce } = require('../include');
module.exports.condition = 'announce'
module.exports.execute = async args => {
    announce(args[1]);
    return 0;
}