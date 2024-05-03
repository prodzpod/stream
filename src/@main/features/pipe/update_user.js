const { isNullish, filterKey, isNullOrWhitespace, safeAssign } = require("../../util_client");
const { data, writeData, log, sendClient, ID } = require('../../include');
const { saveFile } = require("../../util_server");
const { sendAPICall } = require("../../../twitch/include");
const TIME_BETWEEN_PROFILE_REFETCH = 24*60*60*1000; // 1 day
module.exports.condition = 'update_user' // main (id) | update_user user (tag)
module.exports.execute = async args => {
    if (args[3] === "!!discord") { args = [args[0], args[4], args[2], ...args.slice(5)]; };
    if (args[1] === '[SYSTEM]') return '{}';
    let tag = args[2];
    if (args[1].startsWith('#')) return '{}';
    try {tag = JSON.parse(tag)} catch {};
    let file = data().user?.[args[1]];
    let overwrites = {};
    if (!isNullish(tag)) {
        delete tag.logged;
        if (!file || Object.keys(tag).some(k => tag[k] != file[k])) Object.assign(overwrites, tag);
    }
    if (!file || new Date().getTime() - (file.updated_at ?? 0) >= TIME_BETWEEN_PROFILE_REFETCH) {
        // let raw = JSON.parse(await new Promise(resolve => sendClient(ID, 'twitch', 'api', 'GET', `users?login=${args[1]}`, resolve)));
        let raw = await sendAPICall("GET", `users?login=${args[1]}`);
        if (raw?.data?.length) {
            raw = raw.data?.[0];
            Object.assign(overwrites, filterKey(raw, x => ['display_name', 'description'].includes(x)));
            if (raw.created_at) overwrites.created_at = new Date(raw.created_at).getTime();
            if (raw.profile_image_url) {
                let url = await saveFile(raw.profile_image_url, __dirname, `../../data/user/${args[1]}.png`); 
                if (!isNullOrWhitespace(url)) overwrites.profile_image = url;
            }
        }
        overwrites.updated_at = new Date().getTime();
    }
    overwrites.last_showed_up = new Date().getTime();
    writeData(`user.${args[1]}`, overwrites, true);
    file = safeAssign(file, overwrites);
    // log("updateuser returned:", JSON.stringify(file ?? {}));
    return JSON.stringify(file ?? {});
}