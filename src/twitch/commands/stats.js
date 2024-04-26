const { data } = require('../../@main/include');
const { send, log, warn, error } = require('../include');
module.exports.condition = ['!stats', '!stat']
module.exports.permission = true
module.exports.execute = async (_, user, _data) => {
    let global = data().global;
    // log(`current stats: \nJoel: ${global.joel} \n+2: ${global.plus2} \n-2: ${global.minus2}\n ICANT: ${global.ICANT}`);
    send(`current stats: \nJoel: ${global.joel} \n+2: ${global.plus2} \n-2: ${global.minus2}\n ICANT: ${global.ICANT}`, user, _data);
    return 0;
}