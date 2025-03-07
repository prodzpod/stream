const Bluesky = require("@atproto/api");
const { Social } = require("../social");
const { split } = require("../common");
const { log, error } = require("../ws");
const fs = require("fs");
const ACCOUNTS = {
    "prodzpod.bsky.social": process.env.BLUESKY_PASSWORD,
    "startellers.bsky.social": process.env.BLUESKY_PASSWORD,
}
module.exports.init = async () => {
    let social = new Social("bluesky", Object.keys(ACCOUNTS));
    social.connect = async (id) => {
        let agent = new Bluesky.AtpAgent({ service: "https://" + split(id, ".", 1)[1] });
        await agent.login({ identifier: id, password: ACCOUNTS[id] });
        return agent;
    }
    social.post = async (agent, txt, images, tags) => {
        let ret = {
            text: txt,
            createdAt: new Date().toISOString()
        };
        if (tags?.length) ret.text += "\n" + tags.map(x => "#" + x.replace(/\S+/g, "")).join(" ");
        const text = new Bluesky.RichText({ text: ret.text });
        await text.detectFacets(agent);
        ret.text = text.text; ret.facets = text.facets;
        if (images?.length) {
            ret.embed = {
                $type: "app.bsky.embed.images",
                images: []
            }
            for (let image of images) {
                try {
                    let a = await agent.uploadBlob(new Uint8Array(fs.readFileSync(image.path)), { encoding: image.type });
                    ret.embed.images.push({ alt: "", image: a.data.blob, aspectRatio: { width: image.width, height: image.height } });
                } catch { return null; }
            }
        }
        try {
            let res = await agent.post(ret);
            if (res && res.uri && res.cid) return res;
            return null;
        } catch (e) { error(e, agent, txt, images, tags); return null; }
    }
    social.repost = async (agent, id) => {
        try {
            return await agent.repost(id.uri, id.cid);
        } catch (e) { error(e, agent, id); return null; }
    }
    social.validate = async (agent, txt, images, tags) => (txt?.length ?? 0) < 300;
}