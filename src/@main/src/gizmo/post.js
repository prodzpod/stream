const { src, send } = require("../..");
const { split, nullish } = require("../../common");
const { log, path } = require("../../commonServer");

module.exports.predicate = ["!post", "!social", "!tweet", "!toot"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let [_, audience, txt] = split(src().chat.handleMeta(from, "twitch", text, emote)[0], /\s+/, 2);
    let images = []; let indices = [];
    let RE = /https?:\/\/(?:[^\s]*\.(?:gif|png|jpg|jpeg|bmp|webp|apng|ico|avif|tiff|svg|mp4|avi|gifv|mkv|mov|m4a|m4v|mpg|mpeg|webm)|[^\s]*\bt(?:e|x)nor\.com\/vi(?:e|x)w[^\s\?\#]*|[^\s]*file\/f2-toyhou-se[^\s\?\#]*)(?:(?:\?|\#)[^\s]*)?/dig;
    for (let i = 0; i < 4; i++) {
        let m = RE.exec(txt);
        if (nullish(m) === null) break;
        images.push(txt.slice(m.indices[0][0], m.indices[0][1]));
        indices.push(m.indices[0]);
    }
    for (let r of indices.reverse()) txt = txt.slice(0, r[0]) + txt.slice(r[1]);
    for (let i = 0; i < images.length; i++) images[i] = await downloadAndDataify(images[i].trim(), "temp" + i);
    let tags = HASHTAGS.find(x => x[0].includes(audience.trim().toLowerCase()))?.[1];
    if (!tags) { _reply("invalid target"); return [1, ""]; }
    let data = {
        "text": txt?.trim() ?? "",
        "images": images,
        "tags": tags
    };
    _reply(await send("social", "post", data));
    return [0, data];
}

async function downloadAndDataify(url, name) {
    let file = await download(url, name);
    let size;
    if (file.type.startsWith("image")) size = require("image-size").imageSize(file.path);
    else size = await require("../../libs/get-video-dimensions")(file.path);
    file.width = size.width; file.height = size.height;
    file.bytes = fs.lstatSync(file.path).size;
    return file;
}
const fs = require("fs");
const http = require("http"), https = require("https"), Stream = require("stream").Transform;
const download = (url, name, ...dir) => new Promise(resolve => {
    (url.startsWith('http://') ? http : https).request(url, res => {
        let data = new Stream();
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
            let p = path("src/@main/data", ...dir);
            if (!p.includes(".")) {
                let baseurl = url;
                if (baseurl.includes('?')) baseurl = baseurl.slice(0, baseurl.indexOf('?'));
                if (baseurl.includes('#')) baseurl = baseurl.slice(0, baseurl.indexOf('#'));
                if (baseurl.includes('//')) baseurl = baseurl.slice(baseurl.indexOf('//') + '//'.length);
                let ext = baseurl.split('.');
                ext = ext[ext.length - 1];
                if (ext.includes("/")) ext = "png";
                else baseurl = baseurl.slice(0, -1 - ext.length);
                p += `/${name}.${ext}`;
            }
            let ret = data.read();
            if (ret) fs.writeFileSync(p, ret);
            resolve({
                path: p,
                type: res.headers['content-type']
            });
        });
        res.on('error', e => resolve(e.stack));
    }).end();
});

const HASHTAGS = [
    // GAME DEV
    [["stell", "starteller", "startellers"], {
        "twitter@startellers": [],
        "twitter@prodzpod": "twitter@startellers",
        "tumblr@startellersgame": [],
        "tumblr@prodzpod": "tumblr@startellersgame",
        "masto@prod@mastodon.gamedev.place": [],
        "bluesky@startellers.bsky.social": [],
        "bluesky@prodzpod.bsky.social": "bluesky@startellers.bsky.social",
    }],
    [["game", "gamedev", "gamejam", "jam"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "masto@prod@mastodon.gamedev.place": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["m", "mod", "gamemod", "ror", "ror2", "hacknet", "0dtk", "zdtk", "zerodaytoolkit", "riskofrain", "risk"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    // OTHER PUBLIC
    [["music", "sound", "song", "compose", "composing"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["video", "youtube", "edit", "videos"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["art", "picture", "doodle", "drawing", "doodles", "pictures", "image", "images", "a"], {
        "masto@prod@mas.to": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["create", "creation", "thingimade", "misc", "miscellaneous", "c"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "masto@prod@mastodon.gamedev.place": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    // PERSONAL
    [["v", "vtuber", "stream"], {
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["me", "personal", "blog", "post", "tweet", "blogs", "general"], {
        "masto@prod@mas.to": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    [["announcement", "important", "announcements", "!"], {
        "twitter@prodzpod": [],
        "tumblr@prodzpod": [],
        "masto@prod@mastodon.gamedev.place": [],
        "masto@prod@mas.to": [],
        "bluesky@prodzpod.bsky.social": [],
    }],
    //
    [["test"], {
        "tumblr@prodzpod": [],
    }],
]