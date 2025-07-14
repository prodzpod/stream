const { send } = require("../..");
const { nullish, realtype, Math, time, formatDate, numberish } = require("../../common");
const { log, download, debug } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!locateclip", "!getclip", "!clipso"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text) => {
    const _args = args(text);
    const clip = await module.exports.locate(_reply, _args[0], _args[1]);
    if (Array.isArray(clip)) return clip;
    if (chatter?.meta.permission.streamer) {
        await module.exports.download(clip);
        _reply("Located the optimal clip for this occasion: https://prod.kr/v/clips");
    } else _reply("Located the optimal clip for this occasion: https://www.twitch.tv/" + _args[0] + "/clip/" + clip.id);
    return [0, clip.id];
}

module.exports.locate = async (_reply, channel, number) => {
    number = numberish(number);
    if (realtype(number) !== "number") number = 1;
    if (!channel) { _reply("user not found"); return [1, "user not found"]; }
    let user = await send("twitch", "user", channel);
    if (!user) { _reply("user not found"); return [1, "user not found"]; }
    let res = await getClips(user.id, 31, true);
    if (!res.length) res = await getClips(user.id, undefined, true);
    if (!res.length) res = await getClips(user.id, 31);
    if (!res.length) res = await getClips(user.id, 365);
    if (!res.length) res = await getClips(user.id);
    if (!res.length) { _reply("this streamer has no clip"); return [1, "clip not found"]; }
    log("Fetching Video Data");
    res = await getVideoData(res);
    let clip = res.sort((a, b) => {
        let i = (a.featured ? 1 : 0) - (b.featured ? 1 : 0);
        if (i != 0) return i;
        i = (a.custom_title ? 1 : 0) - (b.custom_title ? 1 : 0);
        if (i != 0) return i;
        let mag = Math.log((a.view + 1) / (b.view + 1)) / Math.log(2);
        let res = Number(BigInt(Math.round(mag*30*24*60*60*1000)) + a.date - b.date);
        return res;
    }).reverse()[(number - 1) % res.length];
    log("Clip Found:", clip);
    return clip;
}

module.exports.download = async (clip, name="temp") => {
    log("Downloading Video");
    await send("twitch", "remote", "VIDEO", clip.id);
    log("Sending Video to Local");
    await download("https://pub.colonq.computer/~prod/temp.mp4", name + ".mp4");
    log("Deleting Video in pubnix");
    await send("twitch", "remote", "VIDEO");
    log("Done");
    return "https://prod.kr/data/" + name + ".mp4";
}

function getq(id, date, featured=false) {
    let q = {broadcaster_id: id, is_featured: featured };
    date = numberish(date);
    if (realtype(date) === "number") date = BigInt(date);
    if (realtype(date) === "bigint") q.started_at = formatDate(time() - time(date*60n*60n*24n*1000n), "YYYY-MM-DDThh:mm:ss%Z");
    debug("Fetching clips with params", q);
    return q;
}

async function getClips(id, date, featured=false) {
    let res = await send("twitch", "remote", "GET", "clips", getq(id, date, featured));
    if (nullish(res?.data?.length) === null) return [];
    return res.data.map(x => ({id: x.id, title: x.title, custom_title: x.video_id, view: x.view_count, date: time(x.created_at), featured: x.is_featured}));
}

async function getVideoData(res) {
    let VIDEOS = {};
    for (let i = 0; i < res.length; i++) {
        let video = res[i].custom_title
        if (!VIDEOS[video]) {
            let res = await send("twitch", "remote", "GET", "videos", {id: video});
            if (nullish(res?.data?.length) === null) VIDEOS[video] = null;
            else VIDEOS[video] = res.data[0].title;
        }
        res[i].custom_title = VIDEOS[video] === null ? false : VIDEOS[video] !== res[i].title;
    }
    debug("Videos Fetched: ", VIDEOS, res);
    return res;
}