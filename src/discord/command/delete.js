const { generalChannel, server } = require("../app");

module.exports.execute = async (message, channel) => {
    if (channel) channel = await server().channels.fetch(channel);
    else channel = generalChannel();
    (await channel.messages.fetch(message)).delete();
    return [0, ""];
}