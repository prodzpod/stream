const { src } = require("../..");
module.exports.execute = async (login) => {
    let res = await src().generateKey.getUser(login);
    return [0, res];
}