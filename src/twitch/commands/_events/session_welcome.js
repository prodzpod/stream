const { sendAPICall, id, log, warn, error } = require('../../include');
const { data } = require('../../../@main/include');
const prodID = data().user?.[id]?.['user-id'] ?? '140410053';
module.exports.condition = () => false;
module.exports.permission = false;
module.exports.execute = async (req) => {
    let ret = [];
    const OVERRIDES = {
        "channel.raid.from": "channel.raid", 
        "channel.raid.to": "channel.raid"
    }
    for (let k of [
        "channel.follow", "channel.shoutout.receive", "channel.raid.from", "channel.raid.to", 
        "channel.chat.message", "channel.chat.notification", "channel.chat.message_delete", "channel.ban", 
        /* //? AFFILIATE ZONE
        * "channel.cheer", "channel.channel_points_custom_reward_redemption.add", "channel.ad_break.begin", 
        * "channel.subscribe", "channel.subscription.gift", "channel.subscription.message", 
        * "channel.poll.begin", "channel.poll.progress", "channel.poll.end", 
        * "channel.prediction.begin", "channel.prediction.progress", "channel.prediction.lock", "channel.prediction.end", 
        */
        ]) {
        log('adding eventsub:', k);
        ret.push(await sendAPICall('POST', 'eventsub/subscriptions', null, {
            type: OVERRIDES[k] ?? k,
            version: k == 'channel.follow' ? "2" : "1",
            condition: getCondition(k),
            transport: {
                method: 'websocket',
                session_id: req.payload.session.id
            }
        }));
    }
    log('EventSub set up.', ret.filter(x => x.data[0]?.status == "enabled").map(x => x.data[0].type));
    return ret;
} 

function getCondition(k) {
    switch (k) {
        case "channel.ad_break.begin":
            return { broadcaster_id: prodID };
        case "channel.chat.message":
        case "channel.chat.notification":
        case "channel.chat.message_delete":
            return { broadcaster_user_id: prodID, user_id: prodID };
        case "channel.follow":
        case "channel.shoutout.receive":
            return { broadcaster_user_id: prodID, moderator_user_id: prodID };
        case "channel.raid.from":
            return { from_broadcaster_user_id: prodID };      
        case "channel.raid.to":
            return { to_broadcaster_user_id: prodID };            
        default:
            return { broadcaster_user_id: prodID };
    }
}