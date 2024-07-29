const fetch = require("node-fetch");
const { log } = require("../../commonServer");
const { unentry } = require("../../common");
const { send } = require("../..");
module.exports.tiltify = async (campaign, name, _reward, value, currency, comment) => {
    // assume campaign is jakes for now
    const rewards = unentry((await (await fetch("https://server.venorrak.dev/tiltify/rewards", { headers: { authorization: "prodIsAwesome" } })).json())
       .data.map(x => [x.id, x.name]));
    for (const reward of (_reward ?? [])) {
        let rewardName = rewards[reward] ?? ("Unknown Reward " + reward);
        log(`[jake] ${name} redeemed ${rewardName} (${value}${currency}): ${comment}`);
        send("web", "jake", "redeem", rewardName.trim().toLowerCase().replace("\W", "_"));
    }
    return [0, ""];
}