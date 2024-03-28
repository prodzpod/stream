const { sendAPICall, id, log, warn, error } = require('../../include');
const { data } = require('../../../@main/include');
const prodID = data().user?.[id]?.['user-id'] ?? '140410053';
module.exports.condition = () => false;
module.exports.permission = false;
module.exports.execute = async (req) => {
    let ret = [];
    for (let k of ["channel.shoutout.receive", "channel.ad_break.begin", "channel.channel_points_custom_reward_redemption.add", "channel.hype_train.begin", "channel.hype_train.progress", "stream.offline"]) {
        ret.push(sendAPICall('POST', 'eventsub/subscriptions', null, {
            type: k,
            version: k == 'channel.follow' ? 2 : 1,
            condition: getCondition(k),
            transport: {
                method: 'websocket',
                session_id: req.payload.session.id
            }
        }));
    }
    log('EventSub set up.')
    return await Promise.all(ret);
} 

function getCondition(k) {
    switch (k) {
        case 'channel.ad_break.begin':
            return { broadcaster_id: prodID };
        case 'channel.follow':
        case 'channel.shoutout.receive':
            return { broadcaster_user_id: prodID, moderator_user_id: prodID };
        default:
            return { broadcaster_user_id: prodID };
    }
}