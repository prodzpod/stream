const { send, src, data } = require("../..");
const { time, realtype, trueish, array, unentry, split, WASD, String, occurance, safeAssign } = require("../../common")
const { debug, verbose, download, log } = require("../../commonServer");

module.exports.message = async (from, chatter, message, text, reply) => {
    debug("message", from, chatter, message, text, reply);
    // identify chatter
    let _chatter = src().user.identify(chatter);
    if (_chatter?.twitch) for (const k of Object.keys(_chatter)) {
        if (chatter[k]) _chatter[k] = safeAssign(_chatter[k], chatter[k]);
    } else _chatter = safeAssign(_chatter, chatter);
    if (_chatter.twitch && (time() - BigInt(_chatter.twitch.last_updated ?? 0)) > TWITCH_UPDATE_PERIOD) chatter = await twitchUpdate(_chatter);
    else chatter = _chatter;
    chatter = onInteraction(from, chatter, message, text, reply);
    // identify reply
    if (reply) reply = src().message.identify(reply) ?? reply.fallback;
    [message, text] = await module.exports.emotes(from, chatter, message, text, reply); 
    let ret;
    [chatter, ret] = await module.exports.command(from, chatter, message, text, reply);
    if (!ret) [chatter, ret] = await module.exports.reaction(from, chatter, message, text, reply);
    if (!ret) [chatter, ret] = await module.exports.chat(from, chatter, message, text, reply);
    await src().user.register(chatter);
    debug("chat result:", chatter, ret);
    return ret ?? [0, ""];
}

const TWITCH_UPDATE_PERIOD = BigInt(1000*60*60*24);
const TWITCH_INFO_MAP = {
    "login": "login",
    "display_name": "name",
    "description": "description",
    "profile_image_url": "profile_image",
    "offline_image_url": "offline_image",
    "created_at": "created_at"
}
async function twitchUpdate(chatter) {
    let _twitch = await send("twitch", "user", chatter.twitch?.id);
    if (!_twitch?.id) return chatter;
    for (let k of Object.keys(TWITCH_INFO_MAP)) if (_twitch[k]) chatter.twitch[TWITCH_INFO_MAP[k]] = _twitch[k];
    if (chatter.twitch.profile_image) chatter.twitch.profile = await download(chatter.twitch.profile_image, "user", chatter.twitch.id + ".twitch.png");
    chatter.twitch.last_updated = time();
    if (chatter.discord?.profile_image) chatter.discord.profile = await download(chatter.discord.profile_image + "?size=300", "user", chatter.twitch.id + ".discord.png");
    return chatter;
}
function onInteraction(from, chatter, message, text, reply) {
    chatter.meta ??= {};
    chatter.economy ??= {};
    chatter.economy.iu ??= 0;
    chatter.economy.icons ??= [];
    chatter.economy.pointers ??= [];
    chatter.shimeji ??= {};
    chatter.shimeji.sprite ??= null;
    chatter.shimeji.ai ??= {};
    chatter.shimeji.stats ??= {};
    chatter.shimeji.history ??= {};
    chatter.meta.last_chatted ??= 0;
    chatter.meta.last_interacted = time();
    chatter.meta.permission = {
        streamer: chatter.twitch?.badges?.includes("broadcaster-1") ?? false
    }
    return chatter;
}

module.exports.command = async (from, chatter, message, text, reply) => {
    const processes = Object.keys(src()).filter(x => {
        const predicate = array(trueish(src()[x].predicate));
        const cmd = text?.toString().split(/\s+/)[0].trim().toLowerCase();
        switch (realtype(predicate)) {
            case "boolean": return predicate;
            case "string": return predicate === cmd;
            case "array": return predicate.includes(cmd);
            case "function": return trueish(x.predicate(from, chatter, message, text, reply));
        }
        return false;
    });
    if (processes.length) { // process!
        chatter = onCommand(from, chatter, message, text, reply);
        const mainProcess = processes.find(x => ["string", "array"].includes(realtype(array(trueish(src()[x].predicate))))) ?? processes[0];
        const res = unentry(await Promise.all(processes.map(async x => {
            debug("[message]", "processing command", x);
            const _reply = getReply(from, chatter, message, text, reply);
            if (!chatter.meta.permission.streamer) {
                const permission = array(trueish(src()[x].permission));
                let ret = false;
                switch (realtype(permission)) {
                    case "boolean": ret = permission; break;
                    case "number": ret = trueish(({
                        "0": c => c.twitch?.id,
                        "1": c => c.meta.permission.trusted,
                        "2": c => c.meta.permission.vip,
                        "3": c => c.meta.permission.moderator,
                    })[permission](chatter)); break;
                    case "function": ret = trueish(permission(from, chatter, message, text, reply)); break;
                }
                if (!ret) {
                    _reply("Insufficient Permission");
                    return [x, [1, "insufficient permission"]];
                }
            }
            let ret = src()[x].execute(_reply, from, chatter, message, text, reply);
            if (ret instanceof Promise) ret = await ret;
            return [x, ret];
        })));
        return [chatter, res[mainProcess]];
    } else return [chatter, null];
} 
module.exports.args = text => WASD.unpack(split(text, " ", 1)[1]);
function onCommand(from, chatter, message, text, reply) {
    return chatter;
}
function getReply(from, chatter, message, text, reply) { switch (from) {
    case "twitch": return content => send("twitch", "send", message.twitch.channel, "[🌙] " + content, message.twitch.id);
    case "discord": return content => send("discord", "send", message.discord.channel, content, message.discord.id);
    case "web": return content => send("web", "info", chatter.twitch.id, content);
}}

module.exports.emotes = async (from, chatter, message, text, reply) => {
    // TODO: replace <emote> with blanks, create message.emote with index, sitewide forms and url
    return [message, text];
}
module.exports.reaction = async (from, chatter, message, text, reply) => {
    // TODO: check for text: just emoji
    return [chatter, null];
}

const TODO_TESTSTREAM_ICONS = ["WINNT/explorer.exe_14_107", "WINNT/explorer.exe_14_111-0", "WINNT/explorer.exe_14_205-2", "WINNT/explorer.exe_14_205-0", "WINNT/explorer.exe_14_110-0", "WINNT/regedit.exe_14_101-0", "WINNT/winhlp32.exe_14_4001-0", "WINNT/winrep.exe_14_110-0", "WINNT/inf/unregmp2.exe_14_400", "WINNT/msagent/agentsvr.exe_14_113-1", "WINNT/system32/access.cpl_14_110-3", "WINNT/system32/access.cpl_14_218-0", "WINNT/system32/access.cpl_14_219-0", "WINNT/system32/access.cpl_14_224-0", "WINNT/system32/access.cpl_14_229-0", "WINNT/system32/access.cpl_14_227-0", "WINNT/system32/access.cpl_14_228-0", "WINNT/system32/access.cpl_14_230-0", "WINNT/system32/acctres.dll_14_102", "WINNT/system32/acctres.dll_14_100-0", "WINNT/system32/accwiz.exe_14_246", "WINNT/system32/appmgr.dll_14_218-1", "WINNT/system32/admparse.dll_14_USER-0", "WINNT/system32/appwiz.cpl_14_1500-0", "WINNT/system32/appwiz.cpl_14_1504-3", "WINNT/system32/capesnpn.dll_14_204-0", "WINNT/system32/cdfview.dll_14_8192-4", "WINNT/system32/cdfview.dll_14_8197-1", "WINNT/system32/cdplayer.exe_14_117", "WINNT/system32/certmgr.dll_14_218-0", "WINNT/system32/certmgr.dll_14_277-0", "WINNT/system32/charmap.exe_14_111-0", "WINNT/system32/ciadmin.dll_14_403-1", "WINNT/system32/comctl32.dll_14_20481-0", "WINNT/system32/commdlg.dll_14_528-1", "WINNT/system32/compstui.dll_14_64008-0", "WINNT/system32/compstui.dll_14_64010-0", "WINNT/system32/compstui.dll_14_64009-0", "WINNT/system32/compstui.dll_14_64013-0", "WINNT/system32/compstui.dll_14_64014-0", "WINNT/system32/compstui.dll_14_64016-0", "WINNT/system32/compstui.dll_14_64040-0", "WINNT/system32/compstui.dll_14_64066-0", "WINNT/system32/compstui.dll_14_64065", "WINNT/system32/compstui.dll_14_64067", "WINNT/system32/comuid.dll_14_332-3", "WINNT/system32/cryptui.dll_14_3425-1", "WINNT/system32/cscdll.dll_14_133-0", "WINNT/system32/cscdll.dll_14_131", "WINNT/system32/cscui.dll_14_1347-0", "WINNT/system32/deskadp.dll_14_100", "WINNT/system32/desk.cpl_14_40-3", "WINNT/system32/dfrgres.dll_14_106", "WINNT/system32/dmdskres.dll_14_369-1", "WINNT/system32/dsuiext.dll_14_4116-1", "WINNT/system32/eudcedit.exe_14_2-0", "WINNT/system32/filemgmt.dll_14_237-3", "WINNT/system32/fontext.dll_14_4-0", "WINNT/system32/fontext.dll_14_7-0", "WINNT/system32/freecell.exe_14_601-1", "WINNT/system32/hdwwiz.cpl_14_100-0", "WINNT/system32/grpconv.exe_14_100-1", "WINNT/system32/grpconv.exe_14_101", "WINNT/system32/hticons.dll_14_116", "WINNT/system32/hticons.dll_14_114", "WINNT/system32/hticons.dll_14_112", "WINNT/system32/hticons.dll_14_111", "WINNT/system32/hticons.dll_14_107", "WINNT/system32/hticons.dll_14_106", "WINNT/system32/ieakui.dll_14_801-0", "WINNT/system32/inetcpl.cpl_14_1313-0", "WINNT/system32/main.cpl_14_400-3", "WINNT/system32/mmsys.cpl_14_4379", "WINNT/system32/mmsys.cpl_14_4380-0", "WINNT/system32/mnmsrvc.exe_14_100-2", "WINNT/system32/mobsync.exe_14_132-0", "WINNT/system32/moricons.dll_14_21-0", "WINNT/system32/moricons.dll_14_65-1", "WINNT/system32/msdtcprx.dll_14_150-3", "WINNT/system32/mshtml.dll_14_2661-1", "WINNT/system32/mspaint.exe_14_116", "WINNT/system32/msports.dll_14_2-1", "WINNT/system32/msrating.dll_14_105", "WINNT/system32/netshell.dll_14_171", "WINNT/system32/notepad.exe_14_2-0", "WINNT/system32/pifmgr.dll_14_20", "WINNT/system32/progman.exe_14_117-1", "WINNT/system32/sp3res.dll_14_1505-4", "WINNT/system32/sticpl.cpl_14_110-3"];
module.exports.chat = async (from, chatter, message, text, reply) => {
    if ((message.twitch && message.twitch.channel != "140410053") ||
        (message.discord && message.discord.channel != "1219954701726912586")) return [chatter, null];
    chatter = onChat(from, chatter, message, text, reply);
    const name = chatter.twitch?.name ?? Object.values(chatter).find(x => x.name).name;
    // TODO: replace emotes
    if (!message.twitch) message.twitch = (await send("twitch", "send", null, `@${name}: ${text}`, reply?.twitch?.id));
    if (!message.discord) message.discord = (await send("discord", "send", null, `\`<@${name}>\`: ${text}`, reply?.discord?.id));
    send("gizmo", "chat", `lib/icons_win2k_sp4_en/${TODO_TESTSTREAM_ICONS[Math.abs(String.hashCode(name) % TODO_TESTSTREAM_ICONS.length)]}`, (chatter.twitch?.color ?? "#000000").slice(1), name, text, false);
    src().message.register(message);
    return [chatter, null];
}
function onChat(from, chatter, message, text, reply) {
    const iu = text.length / 10;
    chatter.economy.iu += iu;
    const global = data().global; let found = false;
    for (const k in GLOBAL_OCCURANCE) {
        const occ = occurance(text.toLowerCase(), GLOBAL_OCCURANCE[k]);
        if (occ > 0) { found = true; global[k] ??= 0; global[k] += occ; }
    }
    if (found) data("global", global);
    return chatter;
}
const GLOBAL_OCCURANCE = {
    joel: "joel",
    plus2: "+2",
    minus2: "-2",
    ICANT: "icant",
};