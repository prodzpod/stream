const { send, data, src } = require("../..");
const { WASD, unentry } = require("../../common");
const { log } = require("../../commonServer");
const getID = (name) => Object.values(data().user).find(x => x?.twitch?.login?.toLowerCase() === name?.toLowerCase())?.twitch?.id;

module.exports.execute = async (page, PAGES) => {
    const EXTENDEDLIST = [...TEALCIRCLE, ...TURQUOISECIRCLE];
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
        if (!GREENCIRCLE.map(x => x.toLowerCase()).includes(logins[user].toLowerCase())) {
          const channel = TEALCIRCLE.map(x => x.toLowerCase()).includes(logins[user].toLowerCase()) ? "1270496759545593927" : "1392832678801178755"
          await send("discord", "send", channel, `[<:teal_circle:1343403517154431037>] **${stream.name}** has started a **${stream.game ?? ""}** stream, come hang out!\nhttps://twitch.tv/${stream.login}`, []);
        }
        if (logins[user] === "lala_amanita") await fetch("https://discord.com/api/webhooks/1349585446010749030/" + process.env.LALA_WEBHOOK_TOKEN, {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify({
                "content": `@everyone\nhi guys lala is live${!stream.game ? "" : ` with **${stream.game}**`} u should like come n watch the,m ,,,\n\n**${stream.title}**\nhttps://twitch.tv/lala_amanita`
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

// TEALCIRCLE v2.0 BETA EDITION
const TEALCIRCLE = [
    // PRE-GROUP A: The Progenitors (ETERNAL DEBT)
    "LCOLONQ",
    "digi_shell",
    // PRE-GROUP B: Top Row (7 visible in 100%, 10 visible in max)
      // gizmopeople
    "Venorrak",
    "CR4ZYK1TTY",
    "JakeCreatesStuff",
    "Tyumici",
    "Meisaka",
      // codepeople
    "exodrifter_",
    "LainVT",
      // gamepeople
    "liquidcake1",
    "yiffweed",
    "BrighterMalphon",
    // lala tier :3
    "lala_amanita",
    "SaladForrest",
    // PRE-GROUP C: EMERGENCY BELL (should go on top if live)
    "AlpinAlbench",
    "dn_panic",
    "nme64_u",
    "TheJonyMyster",
    "MODCLONK",
    "nulligor",
    "CrazyKitty357",
    "vodkanyan",
    // PRE-GROUP D: *20* Viewers who also Stream (thank you for talking to me)
      // gizmopeople
    "KinskyUnplugged",
    "mickynoon",
    "BugVT",
    "DanktownBunny",
      // codepeople
    "bigbookofbug",
    "ellg",
    "physbuzz",
    "RayMarch",
    "CipherLunis",
    "BigGayMikey",
      // gamepeople
    "rotsuki",
    "h_ingles",
    "JeanMarcVGC",
    "TheKanMan",
    "TechBonus",
    "fwofie",
    "Ricardo_Stryki",
    "Arross",
    "Colinahscopy_",
    "MoMoMoVT",
    "zulleyy3",
    // joobijooni tier
    "joobijooni",
    "bvnanana",

    // MAIN GROUP PASS 1
    // GROUP 1: =>GreenCircle+
      // 10 viewers
    "yellowberryHN",
    "vasher_1025",
    "trap_exit",
    "kettlestew",
    "divorce_jonze",
      // gizmopeople
    "HazmatVT",
    "ConditionBleen",
    "KariChary",
    "grynmoor",
      // codepeople
    "walfas",
    "vesdev",
    "Tomaterr",
      // creativepeople
    "Must_Broke_",
    "ESTRE777A",
    "KotaruComplex",
    "37LN37",
    "The0x539",
      // gamepeople
    "Psychic_Refugee",
    "AlmantasVT",
    "BODEGARRAT",
      // jakecreates microcircle
    "badcop_",
    "FranParsewell",
      // mickynoon microcircle
    "RetroHomebrew",
    // GROUP 1.5: =>Indie Game Devs
    "KrypticKralo",
    "basie",
    "FreshWaterFern",
    "PGComai",
    "CronoZero15",
    "Setolyx",
    "Bamo16",
    "maidmagedev",
    // GROUP 2: =>Normal About Computer
    "lunarequest",
    "NovaLiminal",
    "enlynn_",
    "YukieVT",
    "ExpiredPopsicle",
    "MyriadMinds",
    "FOSSUnleashed",
    "AstatinChan",
    "Zarithya",
    // GROUP 3: =>SaladForrest
    "gyoglep",
    "yongestation",
    "ericplaysbass",
    "mxnaco",
    "JamsVirtual",
    "RatCousin",
    "coffeetron_",
    "crazymacattack",
    "NilbogLive",
    "thisisgob",
    "MechaMozie",
    "ononano",
      // inari/bug microcircle
    "InariReiju",
    "EntityMorp",
    "Utterneer",
    // GROUP 4: =>BrighterMalphon/lala_amanita
      // malphon
    "kogorinvt",
    "agumiisdungeon",
    "Spellcrafter_Geltaran",
    "DaiyaDiamandis",
    "Mawg",
    "SkabVT",
    "3rdPT",
    "SlushyWater52",
    "badbatterz",
      // lala
    "catdeersnooz",
    "foung_shui",
    "Cheftaku",
    "MeginoMagi",
    "RamnorTheWanderer",
    "OwenAeon",
    "Firosaa",
    "british_nep",
    "sunnyfaller",
    "zoiteki",
    // GROUP 5: =>digi_shell
    "Nicchiketto",
    "Harvologist",
    "Wolfborgg",
      // tetrio zone
    "ManakaRei",
    "zhunGamer",
    // GROUP 6: =>OFFKAI
    "ivurytower",
    "jacknyeko",
    "TibiMoth",
    "beebostrom",
    "EldraEcho",
    "Ramathal",
    "Rooftop_Noona",

    //! PROCEED TO "PASS 2" IN TURQUOISECIRCLE

    // GROUPLESS TIER
    "Ghorr",
    "AznUsagi",
    // Post-Group A: people i respect (-groups)
    "flyann",
    "shindigs",
    "mdxcai",
    "julieee22",
    "UWOSLAB",
    "tyjiro",
    "BigNoseBug",
    "MissLalaVT",
    "sphaerophoria",
    "Jall",

    //! PROCEED TO "POST GROUP B" IN TURQUOISECIRCLE
]

const TURQUOISECIRCLE = [
    // MAIN GROUP PASS 2
    // GROUP 1: =>GreenCircle+
      // gizmopeople
    "Meicha",
      // codepeople
    "cutenice",
    "skyisfine",
    "DehiDehiNowInFinland",
    "Soymilk",
    "SlendiDev",
    "S9tPepper_",
    "freedrull_",
    "DrawThatDevstone",
    "DrawThatRedstone",
    "iSakamoto_San",
      // creativepeople
    "SunAlbionis",
    "iLoidtupo",
      // gamepeople
    "Hexadigital",
    "OlgaOkami",
    "BixiaVT",
    "hanbunVT",
    "DigbyCat",
    "NineteenNinetyX",
    "Jazzahol",
    "Nyanomancer",
    "PeetsEater",
    "DanteDaedalusCh",
      // jakecreates microcircle
    "DivyDii",
      // mickynoon microcircle
    "Tameggy",
    "wooqi",
    // GROUP 1.5: =>Indie Game Devs
    "kani_dev",
    "meMaggatron",
    "CodeVoid0x25",
    "ChipzNSalsa2",
    "RiskyBiscuitGames",
    "tbdgamer",
    "b3agz",
    "TheYagich",
    // GROUP 2: =>Normal About Computer
    "Aerze_the_Witch",
    "InternetRain",
    "OwlkalineVT",
    "LittleWitchAuz",
    "Titanseek3r",
    "duhuhu_",
    "earend",
    "Outfrost",
    "FixItFreb",
    // GROUP 3: =>SaladForrest
    "mikemeows",
    "heckmaybe",
    "westernstyleguy",
    "TheGoofcat",
    "GinjiVitis",
    "GothmirL",
    "GREEDRA",
    "Pigeon_Child",
    "WrongTypeOfHero",
      // inari/bug microcircle
    "YatanoHakuya",
    // GROUP 4: =>BrighterMalphon/lala_amanita
      // malphon
    "Mold_Entity",
    "omocide_",
    "churl_gm",
    "teal_XavierCrow",
    "Kiji_The_Waffle",
    "billy_the_bucket",
      // lala
    "RachelNom",
    "tiraleafu",
    "KiritoNarukami_",
    "ReiRosenfeld",
    "SakuraMikage",
    "SwellTimeGPool",
    "RIHSURI",
    // GROUP 5: =>digi_shell
    "TakamuraTakako",
    "TrickorSweets",
    "MissFushi",
    "EchorinP",
    "berylberu",
      // tetrio zone
    "PenbuVT",
    // GROUP 6: =>OFFKAI
    "A12FLAMES",
    "RadioBoneAir",
    "Ultrasquid",
    "mxpuffin",

    // Post-Group B: people i need to interact with (test groups)
    "AlpineShowTime",
    "Panic",
    "DesyncZX",
    "NextTime000",
    "chocojax",
    "Nyrator",
    "ZephHaathun",
    "nosharko",
    "SigridAndBird",
    "TheAnglerCh",
    "mostlymaxi",
    "MurderVT",
    "K10ND1K3",
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
    "KotaruComplex",
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
    "SaladForrest",
    "bigbookofbug",
    "CipherLunis",
    "liquidcake1",
    "mickynoon",
    "imgeiser",
    "KinskyUnplugged",
    "trap_exit",
    "LainVT",
    "FOSSUnleashed",
    "h_ingles",
    "The0x539",
    "BrighterMalphon",
    "physbuzz",
    "digi_shell",
    "Aerze_the_Witch",
];