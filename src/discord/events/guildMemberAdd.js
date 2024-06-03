const { isNullOrWhitespace } = require("../../@main/util_client");
const { saveFile } = require("../../@main/util_server");
const { log } = require("../include");
const path = require('path');
module.exports.execute = (app, member) => {
    let avatar = member.user.avatarURL();
    let name = member.user.username;
    let url = path.join(__dirname, "../../@main/user/.discord.png");
    log("discord joined:", name, url);
    return;
    if (avatar) {
        let _url = saveFile(avatar, __dirname, "../../@main/user/.temp.discord.png");
        if (!isNullOrWhitespace(_url)) url = _url;
    }
}