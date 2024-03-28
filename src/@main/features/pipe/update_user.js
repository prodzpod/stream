const { takeWord, isNullish, unentry } = require("../../util_client");
const { data, writeData, log } = require('../../include');
module.exports.condition = '!!update_user' // main (id) | update_user user (tag)
module.exports.execute = async str => {
    [_, user, tag, message] = takeWord(str, 4);
    if (user.startsWith('#')) user = user.slice(1);
    try {tag = JSON.parse(tag)} catch {}
    if (!tag.logged) return {};
    let file = data().user?.[user];
    if (!isNullish(tag)) {
        delete tag.logged;
        let overwrites = {};
        if (!file || Object.keys(tag).some(k => tag[k] != file[k])) overwrites = tag;
        // skipping image fetching for now; do that when API is available
        writeData(`user.${user}`, tag, true);
    }
    return JSON.stringify(file);
}