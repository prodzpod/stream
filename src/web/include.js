module.exports.ID = 'web';
module.exports.log = (...stuff) => console.log('[WEB]', ...stuff);
module.exports.warn = (...stuff) => console.warn('[WEB]', ...stuff);
module.exports.error = (...stuff) => console.error('[WEB]', ...stuff);
module.exports.init = async () => 0;
module.exports.commands = {};
module.exports.sockets = [];
module.exports.sendClientWS = (data, filter) => {
    let sockets = this.sockets;
    if (filter) sockets = sockets.filter(filter);
    sockets.map(x => x.send(data));
}