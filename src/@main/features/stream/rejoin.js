const { log, warn, error, rejoinInfo, sendClient, ID } = require("../../include");

module.exports.condition = 'rejoin'
module.exports.execute = async _ => {
    log('================');
    log('REJOINING STREAM');
    log('================');
    rejoinInfo();
    require('../../../model/commands/start').execute([null, 'tracker']);
    sendClient(ID, 'obs', 'start');
    return 0;
}