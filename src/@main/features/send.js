const { takeWord } = require("../util_client");
const { sendClient } = require('../include');

module.exports.condition = 'send' // main (id) | send web (id) cmd args
module.exports.execute = async str => {
    [_, destination, cmd] = takeWord(str, 3);
    console.log('[API]', 'Sending Custom ws:339 to', destination);
    sendClient('main', destination, cmd, data => { return data; });
}