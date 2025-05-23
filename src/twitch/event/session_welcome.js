
const { STREAMER_ID, CLONK_ID, MALPHON_ID, LALA_ID, FORREST_ID, ELLG_ID, BUG_ID, NILBOG_ID, GOB_ID, KINSKY_ID } = require("../common");
const { fetch } = require("../api");
const { log, warn } = require("../ws");
module.exports.execute = async req => {
    let ret = [];
    for (const event of EVENTS) {
        log("adding eventsub:", event);
        const res = await fetch('POST', 'eventsub/subscriptions', null, {
            type: type[event] ?? event,
            version: event === "channel.follow" ? "2" : "1",
            condition: condition[event] ?? { broadcaster_user_id: STREAMER_ID },
            transport: {
                method: "websocket",
                session_id: req.session.id
            }
        });
        if (res[1].data?.[0]?.status !== "enabled") warn(`Eventsub returns ${res[0]}: ${JSON.stringify(res[1])}`);
        ret.push(res);
    }
    log('EventSub set up.', ret.filter(x => x[1].data?.[0]?.status === "enabled").map(x => x[1].data?.[0].type));
}

const EVENTS = [
    "channel.follow", "channel.shoutout.create", "channel.shoutout.receive", "channel.raid.from", "channel.raid.to", 
    "channel.chat.message", "channel.chat.notification", "channel.chat.message_delete", "channel.ban", 
    /* //? AFFILIATE ZONE
    * "channel.cheer", "channel.channel_points_custom_reward_redemption.add", "channel.ad_break.begin", 
    * "channel.subscribe", "channel.subscription.gift", "channel.subscription.message", 
    * "channel.poll.begin", "channel.poll.progress", "channel.poll.end", 
    * "channel.prediction.begin", "channel.prediction.progress", "channel.prediction.lock", "channel.prediction.end", 
    */
    "clonk.chat.message", "malphon.chat.message", "lala.chat.message", "forrest.chat.message", "ellg.chat.message", "bug.chat.message", "kinsky.chat.message", // "nilbog.chat.message", "gob.chat.message", /* "malphon.channel_points_custom_reward_redemption.add" */
];

const type = {
    "clonk.chat.message": "channel.chat.message",
    "malphon.chat.message": "channel.chat.message",
    "lala.chat.message": "channel.chat.message",
    "forrest.chat.message": "channel.chat.message",
    "ellg.chat.message": "channel.chat.message",
    "bug.chat.message": "channel.chat.message",
    "nilbog.chat.message": "channel.chat.message",
    "gob.chat.message": "channel.chat.message",
    "kinsky.chat.message": "channel.chat.message",
    "malphon.channel_points_custom_reward_redemption.add": "channel.channel_points_custom_reward_redemption.add",
    "channel.raid.from": "channel.raid",
    "channel.raid.to": "channel.raid",
};

const condition = {
    "channel.ad_break.begin": { broadcaster_id: STREAMER_ID },

    "clonk.chat.message": { broadcaster_user_id: CLONK_ID, user_id: STREAMER_ID },
    "malphon.chat.message": { broadcaster_user_id: MALPHON_ID, user_id: STREAMER_ID },
    "lala.chat.message": { broadcaster_user_id: LALA_ID, user_id: STREAMER_ID },
    "forrest.chat.message": { broadcaster_user_id: FORREST_ID, user_id: STREAMER_ID },
    "ellg.chat.message": { broadcaster_user_id: ELLG_ID, user_id: STREAMER_ID },
    "bug.chat.message": { broadcaster_user_id: BUG_ID, user_id: STREAMER_ID },
    "nilbog.chat.message": { broadcaster_user_id: NILBOG_ID, user_id: STREAMER_ID },
    "gob.chat.message": { broadcaster_user_id: GOB_ID, user_id: STREAMER_ID },
    "kinsky.chat.message": { broadcaster_user_id: KINSKY_ID, user_id: STREAMER_ID },
    "malphon.channel_points_custom_reward_redemption.add": { broadcaster_user_id: MALPHON_ID },

    "channel.chat.message": { broadcaster_user_id: STREAMER_ID, user_id: STREAMER_ID },
    "channel.chat.notification": { broadcaster_user_id: STREAMER_ID, user_id: STREAMER_ID },
    "channel.chat.message_delete": { broadcaster_user_id: STREAMER_ID, user_id: STREAMER_ID },

    "channel.follow": { broadcaster_user_id: STREAMER_ID, moderator_user_id: STREAMER_ID },
    "channel.shoutout.create": { broadcaster_user_id: STREAMER_ID, moderator_user_id: STREAMER_ID },
    "channel.shoutout.receive": { broadcaster_user_id: STREAMER_ID, moderator_user_id: STREAMER_ID },

    "channel.raid.from": { from_broadcaster_user_id: STREAMER_ID },
    "channel.raid.to": { to_broadcaster_user_id: STREAMER_ID },
}

module.exports.getEvent = (event, cond) => Object.keys(type).find(x => event === type[x] && (!condition[x] || Object.keys(condition[x]).every(y => cond[y] == condition[x][y]))) ?? event;