module.exports.condition = 'send' // main (id) exec location fn args
module.exports.execute = async args => {
    console.log('[API]', 'Executing', args[2], 'on', args[1], 'with', args.slice(3));
    let ret = await require(args[1]).args[2](...args.slice(3));
    return ret;
}