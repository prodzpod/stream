const dgram = require('node:dgram');
const { ID } = require('./include');
const { getSocketsServer } = require('../@main/include');
let server;
module.exports.init = async () => {
    if (server) await server[Symbol.asyncDispose]();
    server = dgram.createSocket('udp4');
    function t(arr, offset, amount=1, chunk=4) {
        let ret = [];
        for (let i = 0; i < amount; i++)
            ret = [...ret, ...(arr.slice(offset + (i * chunk), offset + (i * chunk) + chunk)/*.reverse()*/)];
            return ret;
    }
    server.on('message', (msg, _) => { 
        let arr = Array.from(new Uint8Array(msg.buffer));
        arr = new Uint8Array([t(arr, 0, 1, 8), t(arr, 20, 2), t(arr, 33, 4+3+3), t(arr, 1753, 3+3), t(arr, 1777, 2)].flat());
        getSocketsServer(ID)?.send('void 0 tracker ' + Buffer.from(arr).toString('base64')); 
    });
    server.bind(11573);
    // console.log(server);
    // require('./commands/start').execute(); // test
}