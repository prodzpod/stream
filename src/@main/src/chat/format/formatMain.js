/**
 * 
 * emotes
 * twitch: {text: "...", emote: [{
 *   position: x,
 *   name: name,
 *   url: url,
 *   source: 'twitch'
 *   format: 'png'
 * }]}
 * discord: <a?:\w+:\d+>
 * web: :\w+:
 * gizmo: <emote="url">
 * 
 * mention
 * twitch: <@name:id>
 * discord: <@id>
 * web: @name
 * 
 * formatting
 * twitch:<b>a</>
 * discord: **
 * gizmo: <b>a</>
 * 
 * universal system
 * "as"mention:id"d""a""s"emote:name:format:url"zb"tag:b"c"tag:/b
 */

const { data } = require("../../..");
const { Math, realtype } = require("../../../common");
const { log } = require("../../../commonServer");
const { simpleTag, simpleTagSelfClosing } = require("./formatPattern");
const { scanFor, scanForDouble, scanForBracket } = require("./formatScan");
const { cleanup, Text, Token, TYPE, Tag } = require("./formatTypes");

module.exports.parse = async (from, text, emote) => {
    log("BEFORE:", from, text, emote);
    let arr = emote?.length ? await parseCommonEmotes(text, emote) : [Text(text)];
    if (PARSE[from]) arr = PARSE[from](arr);
    arr = PARSE.common(arr);
    // final cleanup
    arr = cleanup(arr.map(x => {
        if (x.type.endsWith("_IMMUTABLE")) x.type = x.type.slice(0, -"_IMMUTABLE".length);
        return x;
    }))[0];
    log("AFTER:", arr);
    return arr;
}
async function parseCommonEmotes(text, emote) {
    let ret = [], start = 0;
    for (const e of emote) {
        ret.push(Text(text.slice(start, e.position)));
        start = e.position;
        let res = new Token(TYPE.emote, e.name); res.url = e.url; res.format = e.format;
        // convert url to local...
        ret.push(res);
    }
    if (start < text.length) ret.push(Text(text.slice(start)));
    return cleanup(ret)[0];
}
// parses
const PARSE = {
    common: (arr) => {
        // gizmo bracket format
        arr = simpleTagSelfClosing(arr, "<br>", Text("\n"));
        arr = simpleTagSelfClosing(arr, "<reset>", Tag("!reset"));
        for (let k of "biusx/".split("")) arr = simpleTagSelfClosing(arr, "<" + k + ">", Tag(k));
        arr = simpleTagSelfClosing(arr, /<(color|tilt|size|charspace|lineheight|font)=([^>]+)>/, m => [Tag(m[1]).with("extra", m[2])]);
        arr = simpleTagSelfClosing(arr, /<(wave|shake)( [^>]+)?>/, m => {
            let tag = Tag(m[1]);
            for (let entry of m[2].trim().split()) {
                if (!entry.includes("=")) continue;
                tag = tag.with(...entry.split("="));
            }
            return [tag];
        });
        arr = getCancels(arr);
        // twitch mentions
        arr = simpleTagSelfClosing(arr, /@\w+/, m => {
            let l = m[0].slice(1).toLowerCase().replace(/\W/g, ""); 
            let chatter = Object.values(data().user).find(x => x?.twitch?.login === l);
            return [chatter ? new Token(TYPE.mention, chatter.twitch.login).with("id", chatter.twitch.id) : Text(m[0])];
        });
        // 7tv emotes/global transformations
        const emotes = data().emote;
        for (const category in emotes) for (const name in emotes[category]) {
            const cond = category === "7tv" ? new RegExp(`\\b${name}\\b`) : name;
            arr = scanFor(arr, cond, (m, c, str, ptr, arr) => {
                const _m = typeof m === "string" ? m : m[0];
                let emote = new Token(TYPE.emote, _m).with("url", emotes[category][name]);
                arr.splice(ptr, 1, Text(str.slice(0, c)), emote, Text(str.slice(c + _m.length)));
                return [arr, ptr];
            });
        }
        return arr;
    },
    discord: (arr) => {
        // headers
        function discordInner(arr) {
            // codeblocks
            arr = simpleTagSelfClosing(arr, "```````", [Tag("font").with("extra", "iosevka"), new Token(TYPE.text + "_IMMUTABLE", "`"), Tag("font")]);
            arr = simpleTagSelfClosing(arr, "``````", [new Token(TYPE.text + "_IMMUTABLE", "``````")]);
            arr = simpleTagSelfClosing(arr, "`````", [new Token(TYPE.text + "_IMMUTABLE", "`````")]);
            arr = simpleTagSelfClosing(arr, "````", [new Token(TYPE.text + "_IMMUTABLE", "````")]);
            function codeBlock(start, end) {
                if (!end) end = start;
                return simpleTag(arr, start, end, "font", 
                (_, s, e, arr) => { 
                    arr[s] = arr[s].with("extra", "iosevka"); 
                    arr[s+1].value = arr[s+1].value.trimStart();
                    arr[e-1].value = arr[e-1].value.trimEnd();
                    arr = arr.map(x => { if (x.type === TYPE.text) x.type += "_IMMUTABLE"; return x; }); 
                    return [arr, e]; 
                });
            }
            arr = codeBlock(/```(\w*\n)?/, "```");
            arr = commonCodeblock(arr);
            // bullet point
            arr = scanForDouble(arr, (_, c, str) => {
                if (c !== 0 && str[c - 1] !== "\n") return false;
                return / *(-|\*) /;
            }, /.(\n|$)/, (s, start, end, arr) => {
                arr[start].value = arr[start].value.replace("-", "•").replace("*", "•");
                return [arr, end];
            });
            // everything else
            for (const kv of Object.entries({
                "**": "b", "__": "u", "~~": "s", "||": "x", 
                "*": "i", "_": "i",
            })) arr = simpleTag(arr, kv[0], kv[0], kv[1]);
            return arr;
        }
        const headers = ["> # ", "> ## ", "> ### ", "> -# ", "# > ", "## > ", "### > ", "-# > ", "> ", "# ", "## ", "### ", "-# "];
        arr = scanForDouble(arr, (_, c, str) => {
            if (c !== 0 && str[c - 1] !== "\n") return false;
            return headers;
        }, /.(\n|$)/, (s, start, end, arr) => {
            let startTags = [], endTags = [];
            if (arr[start].value.includes(">")) {
                let idx = arr[start].value.indexOf(">");
                arr[start].value = arr[start].value.slice(0, idx) + arr[start].value.slice(idx + 1);
                startTags.push(Tag("bq"));
                endTags.push(Tag("/bq"));
            }
            let newStart = Tag("size");
            switch (arr[start].value.trim()) {
                case "#": newStart = newStart.with("extra", "78"); break;
                case "##": newStart = newStart.with("extra", "52"); break;
                case "###": newStart = newStart.with("extra", "39"); break;
                case "-#": newStart = newStart.with("extra", "13"); break;
            }
            startTags.push(newStart); endTags.push(Tag("/size")); startTags = startTags.reverse();
            let res = [...startTags, ...discordInner(cleanup([...s.slice(1, -1), Text(arr[end].value[0])])[0]), ...endTags];
            arr.splice(start, s.length, ...res);
            end = start + res.length;
            return [arr, end];
        });
        arr = discordInner(arr);
        arr = scanFor(arr, /<@(\w+):(\d+)>/, (m, c, str, ptr, arr) => {
            arr[ptr] = new Token(TYPE.mention, m[1]).with("id", Object.values(data().user).find(x => x?.discord?.id === m[2])?.twitch?.id);
            return [arr, ptr];
        });
        return arr;
    },
    witsend: (arr) => {
        arr = commonCodeblock(arr);
        scanForBracket(arr, /\[([bisux]+)\//, "]", (subarr, start, end, arr) => {
            let r = [];
            for (let k of "bisux".split("")) if (arr[start].value.includes(k)) r.push(k);
            arr.splice(end, 1, ...r.reverse().map(x => Tag("/" + x)));
            arr.splice(start, 1, ...r.reverse().map(x => Tag(x)));
            return [arr, end + r.length - 1];
        });
        return arr;
    }
}
function commonCodeblock(arr) {
    return scanForDouble(arr, /`+/, (s, c, ss, ptr, arr, i, start) => new RegExp(`[^\`]${arr[start].value}(?!\`)`), (s, start, end, arr) => {
        arr[start] = Tag("font").with("extra", "iosevka");
        arr[end-1].value += arr[end].value[0];
        arr[end] = Tag("/font");
        for (let i = start; i < end; i++) if (arr[i].type === TYPE.text) arr[i].type += "_IMMUTABLE";
        return [arr, end];
    });
}
function getCancels(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].is(TYPE.tag, "/")) continue;
        let level = 0;
        for (let j = i; j >= 0; j--) {
            if (arr[j].type !== TYPE.tag) continue;
            if (arr[j].value.startsWith("/")) level++;
            else if (!arr[j].value.startsWith("!")) level--;
            if (level <= 0) { arr[i].value = "/" + arr[j].value; break; }
        }
        if (level > 0) { arr.splice(i, 1); i--; }
    }
    return arr;
}