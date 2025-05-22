const { src } = require("../..");

module.exports.chat = async (from, chatter, message, text, emote, reply) => {
    let meta = src().chat.handleMeta(source, "gizmo", text, emote);
    await fetch("https://prod.kr/api/lala", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "passphrase": process.env.LALA_API_PASSWORD,
            "action": "message", 
            "userId": chatter?.twitch?.id,
            "login": chatter?.twitch?.login, 
            "name": chatter?.twitch?.name, 
            "badge": "broadcaster/1",
            "msgId": message?.twitch?.id ?? -1,
            "text": meta[0],
            // "unescape": true,
            "emotes": emote.map(x => ({
                name: `<emote=${x.url}>`,
                url: {
                    small_animated: x.url.replace("C:/Users/User/Desktop/Development/node/stream2/src/@main/", "https://prod.kr/"),
                    big_animated: x.url.replace("C:/Users/User/Desktop/Development/node/stream2/src/@main/", "https://prod.kr/"),
                    small_static: x.url.replace("C:/Users/User/Desktop/Development/node/stream2/src/@main/", "https://prod.kr/"),
                    big_static: x.url.replace("C:/Users/User/Desktop/Development/node/stream2/src/@main/", "https://prod.kr/")
                }
            })),
        })
    });
}