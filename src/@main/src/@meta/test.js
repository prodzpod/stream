const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math } = require("../../common");
const { log, path, fetch, listFiles, info } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    // https://twitter.com/i/oauth2/authorize?response_type=code&client_id=M3JlOUVSbnc0TFg1RFR3UXEzUDI6MTpjaQ&redirect_uri=https://prod.kr/oauth&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=challenge&code_challenge_method=plain
    /*
    log(WASD.pack(await fetch({})("POST", "https://api.x.com/2/oauth2/token", null, {
        code: args(text)[0],
        grant_type: "authorization_code",
        client_id: process.env.TWITTER_CLIENT_ID,
        redirect_uri: "https://prod.kr/oauth",
        code_verifier: "challenge"
    }, "application/x-www-form-urlencoded")));
    */
    // https://www.tumblr.com/oauth2/authorize?client_id=96zrrgRT0LlFGdvKjls9zSxDlPzKtnZfaDH1nVVpca53t5wQL7&response_type=code&scope=basic%20write%20offline_access&state=state
    /*
    log(WASD.pack(await fetch({})("POST", "https://api.tumblr.com/v2/oauth2/token", null, {
        code: args(text)[0],
        grant_type: "authorization_code",
        client_id: process.env.TUMBLR_KEY_STARTELLERS,
        client_secret: process.env.TUMBLR_SECRET_STARTELLERS
    }, "application/x-www-form-urlencoded")));
    */
    
    return [0, ""];
}