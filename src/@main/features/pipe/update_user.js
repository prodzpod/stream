const { isNullish } = require("../../util_client");
const { data, writeData } = require('../../include');
module.exports.condition = 'update_user' // main (id) | update_user user (tag)
module.exports.execute = async args => {
    let tag = args[2];
    if (args[1].startsWith('#')) args[1] = args[1].slice(1);
    try {tag = JSON.parse(tag)} catch {}
    if (!tag.logged) return {};
    let file = data().user?.[args[1]];
    if (!isNullish(tag)) {
        delete tag.logged;
        let overwrites = {};
        if (!file || Object.keys(tag).some(k => tag[k] != file[k])) overwrites = tag;
        // skipping image fetching for now; do that when API is available
        writeData(`user.${args[1]}`, tag, true);
    }
    return JSON.stringify(file);
}