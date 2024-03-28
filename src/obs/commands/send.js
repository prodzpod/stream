const { takeWord } = require('../../@main/util_client');
const { send } = require('../include');
module.exports.condition = 'send';
module.exports.execute = str => {
    let [ _, name, data ] = takeWord(str, 3);
    return new Promise(resolve => send(name, JSON.parse(data), resolve));
}