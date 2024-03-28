const { takeWord } = require("../util_client");

module.exports.condition = 'send' // main (id) exec location fn args (separated by comma)
module.exports.execute = async str => {
    [_, location, fn, args] = takeWord(str, 4);
    console.log('[API]', 'Executing', fn, 'on', location, 'with', args);
    let ret = await require(location).fn(...args.split(',').map(x => x.trim()));
    return ret;
}