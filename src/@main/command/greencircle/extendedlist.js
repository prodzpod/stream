const { send, data, src } = require("../..");
const { WASD, unentry } = require("../../common");
const { log } = require("../../commonServer");
const getID = (name) => Object.values(data().user).find(x => x?.twitch?.login?.toLowerCase() === name?.toLowerCase())?.twitch?.id;

module.exports.execute = async (page, PAGES) => {
    const pp = Math.ceil(EXTENDEDLIST.length / PAGES);
    const toUpdate = EXTENDEDLIST.slice(pp * page, Math.min(pp * page + pp, EXTENDEDLIST.length))
    let ids = [];
    for (const user of toUpdate) {
        let id = getID(user);
        if (!id) { 
            id = (await send("twitch", "user", user))?.id; 
            await src().user.initialize(id);
        }
        ids.push(id);
    }
    const liveData = await send("twitch", "streams", ids);
    let logins = unentry(ids.map(x => [x, data().user[x].twitch.login]));
    let isLive = unentry(ids.map(x => [x, liveData.some(y => y.login === logins[x])]));
    let wasLive = unentry(ids.map(x => [x, data().user[x].twitch.streaming ?? false]));
    const streamOns = ids.filter(x => !wasLive[x] && isLive[x]).reverse();
    const streamOffs = ids.filter(x => wasLive[x] && !isLive[x]);
    for (let user of streamOns) {
        log("Extendedlist Online:", WASD.toString(logins[user]));
        send("web", "online", WASD.toString(logins[user]));
        // announcementzones
        let stream = liveData.find(x => x.login === logins[user]);
        if (!GREENCIRCLE.map(x => x.toLowerCase()).includes(logins[user].toLowerCase())) await send("discord", "send", "1270496759545593927", `[<:teal_circle:1343403517154431037>] **${stream.name}** has started a **${stream.game ?? ""}** stream, come hang out!\nhttps://twitch.tv/${stream.login}`, []);
        if (logins[user] === "lala_amanita") await fetch("https://discord.com/api/webhooks/1343345252018290758/aUTtWb1rVOr0cWsmQxwf8O7LiQaaDv-Fi8B-lIdHHLHq--ab-N_StOG15LZK5kHjEiyp", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                "content": `@everyone\nhi guys lala is live${!stream.game ? "" : `with **${stream.game}**`} u should like come n watch the,m ,,,\n\n**${stream.title}**\nhttps://twitch.tv/lala_amanita`
            })
        });
        data("user." + user + ".twitch.streaming", true);
    }
    for (let user of streamOffs) {
        log("Extendedlist Offline:", WASD.toString(logins[user]));
        send("web", "offline", WASD.toString(logins[user]));
        data("user." + user + ".twitch.streaming", false);
    }
    return [0, ""];
}

const EXTENDEDLIST = [
    // GROUP -1: The Progenitors (ETERNAL DEBT)
    "LCOLONQ",
    "digi_shell",
    // GROUP 0: Top Row (7 visible in 100%, 10 visible in max)
    "Venorrak",
    "mickynoon",
    "SaladForrest",
    "KinskyUnplugged",
    "Tyumici",
    "Meisaka",
    "CR4ZYK1TTY",
    "bigbookofbug",
    "yellowberryHN",
    // lala tier :3
    "lala_amanita",
    // GROUP 1: 10 Viewers who also Stream
      // codepeople
    "liquidcake1",
    "YukieVT",
    "exodrifter_",
    "LainVT",
    "ellg",
    "yiffweed",
    "CipherLunis",
    "RayMarch",
    "JakeCreatesStuff",
    "basie",
    "vesdev",
    "BigGayMikey",
      // coolpeople
    "BrighterMalphon",
    "rotsuki",
    "zulleyy3",
    "Ricardo_Stryki",
    "h_ingles",
    "physbuzz",
    "DanktownBunny",
      // idk if they streampeople
    "Ghorr",
    "TheJonyMyster",
    "lunarequest",
    "pixelSorted",
    // banana tier
    "bvnanana", 
    // GROUP 2: gaypeople (cool people i met from the greater gayprogrammer cycles)
    "NovaLiminal",
    "badcop_",
    "Aerze_the_Witch",
    "OwlkalineVT",
    "ExpiredPopsicle",
    "InternetRain",
    "enlynn_",
    // GROUP 3: gamepeople (yume nikki > tetris > mahjong)
    "Wolfborgg",
    "Harvologist",
    "EchorinP",
    "Nicchiketto",
    "berylberu",
    "spitcrush",
    "ManakaRei",
    "zhunGamer",
    "AznUsagi",
    // GROUP 4: artpeople
    "KotaruComplex",
    "Must_Broke_",
    "37LN37",
    "ESTRE777A",
    "Firosaa",
    "teal_XavierCrow",
    "GREEDRA",
    // GROUP 5: forrestpeople (cool people i met from forrestzone)
    "ericplaysbass",
    "yongestation",
    "JamsVirtual",
    "MechaMozie",
    "NilbogLive",
    "thisisgob",
    // bug tier
    "BugVT",
    // GROUP 6: malphpeople (cool people i met from malphzone)
    "kogorinvt",
    "TheKanMan",
    "agumiisdungeon",
      // collab zones
    "Spellcrafter_Geltaran",
    "HazmatVT",
    "omocide_",
    "Mold_Entity",
      // lala zones
    "BigDaveCDXX",
    "catdeersnooz",
    "sunnyfaller",
    "MeginoMagi",
      // and beyond...
    "ReiRosenfeld",
    "RamnorTheWanderer",
    "nosharko",
    "MoMoMoVT",
    // GROUP 7: various adjacent zones beyond
      // more code zones
    "Setolyx",
    "FOSSUnleashed",
    "vasher_1025",
    "trap_exit",
    "S9tPepper_",
    "CyberKaida",
    "LittleWitchAuz",
    "Titanseek3r",
    "Outfrost",
    "FreshWaterFern",
    "MyriadMinds",
      // og adjacents
    "ConditionBleen",
    "Jazzahol",
    "Soymilk",
    "OlgaOkami",
    "BixiaVT",
    "AlmantasVT",
    "Psychic_Refugee",
    "Colinahscopy_",
    "DigbyCat",
    "NineteenNinetyX",
    "Hexadigital",
    "DivyDii",
    "stalkeralker",
    "KariChary",
    "StuxVT",
      // extended malph zones
    "iLoidtupo",
    "AlpinAlbench",
    "fwofie",
      // extended forrest zones
    "BigNoseBug",
    "gyoglep",
      // digi zones
    "TrickorSweets",
    "TakamuraTakako",
      // various
    "Tameggy",
    "3rdPT",
    "DaiyaDiamandis",
    "KeitaroCh",
    "AltoVT",
    // geiser tier
    "imgeiser",
    "mahjongpilled",
    // GROUP 8: genuinely cool people (idk if they like me tho)
      // gizmo tubes
    "shindigs",
    "nme64_u",
    "mdxcai",
    "UWOSLAB",
    "flyann",
    "tyjiro",
    "Jall",
      // code tubes
    "sphaerophoria",
    "PracticalNPC",
    "finisfine",
    "het_tanis",
    "kujukuju",
    "Tsoding",
      // game tubes
    "Geop",
    "Meicha",
    // GROUP X: unsorted (tbd)
    "SlendiDev",
    "grynmoor",
    "Psydere",
    // GROUP Y: idk if they streamtier
    "skyisfine",
    "Swaihilde",
];

const GREENCIRCLE = [ // commented: exists in greencircle.live but does not get captured by greenfeed
    "LCOLONQ",
    "prodzpod",
    "Tyumici",
    "ellg",
    "JakeCreatesStuff",
    "badcop_",
    "basie",
    "Hexadigital",
    "Venorrak",
    "zulleyy3",
    "vasher_1025",
    "CR4ZYK1TTY",
    "yellowberryHN",
    // "KotaruComplex",
    "yiffweed",
    "BigGayMikey",
    "37LN37",
    "vesdev",
    "bvnanana",
    "YukieVT",
    "Colinahscopy_",
    "NovaLiminal",
    "Meisaka",
    "NineteenNinetyX",
    "Ricardo_Stryki",
    "exodrifter_",
    "RayMarch",
    // "SaladForrest",
    "bigbookofbug",
    "CipherLunis",
    "liquidcake1",
    "mickynoon",
    "imgeiser",
    "KinskyUnplugged",
];