const { log, send } = require("../../ws");

module.exports.execute = async (query, body) => {
    const raw = body.data.reward_claims ?? [];
    let rewards = [];
    for (const k of raw) for (let i = 0; i < (k.quantity ?? 1); i++) rewards.push(k.reward_id);
    log("tiltify recieved", body.data.campaign_id, body.data.donor_name, rewards, body.data.amount.value, body.data.amount.currency, body.data.donor_comment);
    send("tiltify", body.data.campaign_id, body.data.donor_name, rewards, body.data.amount.value, body.data.amount.currency, body.data.donor_comment);
    return [200, {res: 'hello tiltify'}];
}