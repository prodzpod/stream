const { reactionRoleMessage, removeRole } = require("../app");
const { ROLE_CIRCLE, SERVER, CHANNEL_GENERAL } = require("../common");
const { error, log } = require("../ws");

module.exports.execute = async (apps, reaction, user) => {
    if (reaction.message?.guildId !== SERVER) return;
    if (reaction.partial) {
		try {
			await reaction.fetch();
		} catch (e) {
			error('Something went wrong when fetching the message:', e.stack ?? e);
			return;
		}
	}
    if (reaction.message?.channel.id === CHANNEL_GENERAL) {
        // TODO: message reaction
    } else if (reaction.message?.id === reactionRoleMessage().id) switch (reaction.emoji.name) {
        case "🔌": removeRole(user.id, ROLE_CIRCLE); break;
    }
}