const { send } = require('../include');
module.exports.condition = 'send';
module.exports.execute = async args => {
    return new Promise(resolve => send(args[1], JSON.parse(args[2]), resolve));
}