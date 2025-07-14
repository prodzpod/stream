const { log } = require("../../../commonServer");
const { TYPE } = require("./formatTypes");

module.exports.stringify = async (from, tokens) => {
    log("STRINGIFY:", from, tokens);
    let ret = "";
    for (let t of tokens) {
        switch (t.type) {
            case TYPE.text:
                ret += t.value;
                break;
            case TYPE.emote:
                ret += ":" + t.name + ":";
                break;
            case TYPE.tag:
                switch (from) {
                    case "discord": 
                        ret += ({
                            "b": "**",
                            "i": "*",
                            "u": "__",
                            "s": "~~",
                            "x": "||",
                            "font": "`",
                            "/b": "**",
                            "/i": "*",
                            "/u": "__",
                            "/s": "~~",
                            "/x": "||",
                            "/font": "`"
                        })[t.value];
                        break;
                    case "twitch":
                        if (t.value.startsWith("/")) ret += "</>";
                        else ret += `<${t.value}>`;
                        break;
                }
                break;
        }
    }
    log("RET:", ret);
    return ret;
}