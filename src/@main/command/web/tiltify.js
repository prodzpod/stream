const { src, send } = require("../..");
module.exports.execute = async (campaign, name, reward, value, currency, comment) => {
    return await src().jake.tiltify(campaign, name, reward, value, currency, comment);    
}