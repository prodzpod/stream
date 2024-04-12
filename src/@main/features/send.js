const { sendClient } = require('../include');

module.exports.condition = 'send' // main (id) | send web (id) cmd args
module.exports.execute = async args => {
    console.log('[API]', 'Sending Custom ws:339 to', args[1]);
    sendClient('main', args[1], ...args.slice(2), data => { return data; });
}