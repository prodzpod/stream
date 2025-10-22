const { send, data, src } = require("../..");
const { WASD, unentry } = require("../../common");
const { log, warn } = require("../../commonServer");
const getID = (name) => Object.values(data().user).find(x => String(x?.twitch?.login)?.toLowerCase() === String(name)?.toLowerCase())?.twitch?.id;

module.exports.execute = async (page, PAGES) => {
    const EXTENDEDLIST = [...TEALCIRCLE, ...TURQUOISECIRCLE];
    const pp = Math.ceil(EXTENDEDLIST.length / PAGES);
    const toUpdate = EXTENDEDLIST.slice(pp * page, Math.min(pp * page + pp, EXTENDEDLIST.length))
    let ids = [];
    for (const user of toUpdate) {
        if (!user) continue;
        let id = getID(user);
        if (!id) { 
            id = (await send("twitch", "user", user))?.id; 
            await src().user.initialize(id);
        }
        if (id) ids.push(id); else warn("user is empty:", user);
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
    "digiko",
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
    "freedrull_",
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
    "sus1d1p",
    "noneuclidean",
    "MODCLONK",
    "nulligor",
    "CrazyKitty357",
    "vodkanyan",
    "archible",
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
    "rotxp",
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
    "DrawThatDevstone",
    "DrawThatRedstone",
    "DehiDehiNowInFinland",
    "nosharko",
    "dumbmoths",
    "Soymilk",
      // creativepeople
    "Must_Broke_",
    "ESTRE777A",
    "KotaruComplex",
    "37LN37",
    "The0x539",
      // gamepeople
    "Psychic_Refugee",
    "VeraSimila",
    "AlmantasVT",
    "Hexadigital",
    "OlgaOkami",
    "BixiaVT",
    "DigbyCat",
    "NineteenNinetyX",
    "Jazzahol",
    "Nyanomancer",
      // jakecreates microcircle
    "badcop_",
    "FranParsewell",
      // mickynoon microcircle
    "RetroHomebrew",
    "Tameggy",
      // cipherlunis microcircle
    "iLoidtupo",
    // GROUP 1.5: =>Indie Game Devs
    "KrypticKralo",
    "basie",
    "FreshWaterFern",
    "PGComai",
    "CronoZero15",
    "Setolyx",
    "Bamo16",
    "maidmagedev",
    "NetrunnerVT",
    "just__jane",
      // GREENHEAT PEOPLE???
    "LiftedPixel",
    "AmoAster",
    // GROUP 2: =>Normal About Computer
    "lunarequest",
    "NovaLiminal",
    "enlynn_",
    "YukieVT",
    "KiriArtemisVT",
    "MyriadMinds",
    "FOSSUnleashed",
    "AstatinChan",
    "Zarithya",
    "Aerze_the_Witch",
    "InternetRain",
    "LittleWitchAuz",
    "Titanseek3r",
    "duhuhu_",
    "earend",
    "Outfrost",
    "iSakamoto_San",
    "OwlkalineVT",
    // GROUP 3: =>SaladForrest
      // direct line
    "V_Kyuber",
    "yongestation",
    "ericplaysbass",
    "thelonhobo",
    "mxnaco",
    "JamsVirtual",
    "mikemeows",
      // creativepeople
    "NilbogLive",
    "thisisgob",
    "MechaMozie",
    "coffeetron_",
    "crazymacattack",
    "Pigeon_Child",
    "westernstyleguy",
    "Bee2br",
    "ononano",
    "Nyrator",
      // gamepeople
    "RatCousin",
    "GinjiVitis",
    "GREEDRA",
    "GATORGUTS",
    "BODEGARRAT",
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
    // "Mold_Entity",
    "omocide_",
    "churl_gm",
    "billy_the_bucket",
      // lala
    "catdeersnooz",
    "foung_shui",
    "Cheftaku",
    "MeginoMagi",
    "RamnorTheWanderer",
    "british_nep",
    "sunnyfaller",
    "zoiteki",
    // GROUP 5: =>digi_shell
    "Nicchiketto",
    "Harvologist",
    "Wolfborgg",
    "Taingel",
      // tetrio zone
    "ManakaRei",
    "zhunGamer",
    // GROUP 6: =>OFFKAI
    "ivurytower",
    "jacknyeko",
    "TibiMoth",
    "EldraEcho",
    "Ramathal",
    "Rooftop_Noona",
    "ZephHaathun",
    "DesyncZX",
    "NayaAnukaVT",

    //! PROCEED TO "PASS 2" IN TURQUOISECIRCLE

    // GROUPLESS TIER
    "Ghorr",
    "AznUsagi",
    // Post-Group A: people i respect (-groups)
    "flyann",
    "shindigs",
    "mdxcai",
    "julieee22",
    "tyjiro",
    "sphaerophoria",
    "Jall",
    "heckmaybe",

    //! PROCEED TO "POST GROUP" IN TURQUOISECIRCLE
]

const TURQUOISECIRCLE = [
    // MAIN GROUP PASS 2
    // GROUP 1: =>GreenCircle+
      // gizmopeople
    "Meicha",
      // codepeople
    "cutenice",
    "skyisfine",
    "SlendiDev",
    "S9tPepper_",
    "K10ND1K3",
    "NEMUofthesleep",
    "techygrrrl",
    "CRTVHead",
    "AbsintheVT",
    "fiehra",
      // creativepeople
    "SunAlbionis",
    "GrimmGlassman",
      // gamepeople
    "hanbunVT",
    "PeetsEater",
    "DanteDaedalusCh",
    "KeitaroCh",
    "HinaBoBina",
    "chocojax",
    "henemimi",
    "LongLiveReya",
    "mostlymaxi",
    "finisfine",
      // jakecreates microcircle
    "DivyDii",
    "JDDoesDev",
      // mickynoon microcircle
    "wooqi",
      // cipherlunis microcircle
    "ManasongWriting",
    "anythingarax",
    "cogs_hq",
    // GROUP 1.5: =>Indie Game Devs
    "kani_dev",
    "meMaggatron",
    "CodeVoid0x25",
    "b3agz",
    "TheYagich",
    "PracticalNPC",
    "ColeSlawski",
    "haru_dev__",
    // GROUP 2: =>Normal About Computer
    "FixItFreb",
    "dogwithglasseson",
    // GROUP 3: =>SaladForrest
    "GothmirL",
    "WrongTypeOfHero",
    "TheGoofcat",
    "gyoglep",
    "derekruns",
      // inari/bug microcircle
    "YatanoHakuya",
    "kendra_branwen",
    // GROUP 4: =>BrighterMalphon/lala_amanita
      // malphon
    "teal_XavierCrow",
    "Kiji_The_Waffle",
      // lala
    "RachelNom",
    "tiraleafu",
    "KiritoNarukami_",
    "ReiRosenfeld",
    "SakuraMikage",
    "SwellTimeGPool",
    "RIHSURI",
    "OwenAeon",
    "Firosaa",
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
    "beebostrom",
    "NextTime000",

    // Post-Group A
    "UWOSLAB",
    "BigNoseBug",
    "MissLalaVT",
    "Geop",
    "Panic",
    "AlpineShowTime",
    "VtuberTalk",
    // Post-Group B: people i need to interact with (test groups)
    "SigridAndBird",
    "TheAnglerCh",
    "MurderVT",
    "sospuudding",
    "Katakoyo",
    "paradisesPP",
    "eurothug4000",
    "necauqua",
    "Yuushakun",
    "DealtADelta",
    "3DbyLeo",
    "sukadrii",
    "JBonds007",
    "Synchrophi",
    "aki_aspen",
    "TogeNebula",
    "garbage6",
    "KikiAsakura",
    "lydiapagefila",
    "Lisnezuko",
    "FirstHour777",
    "TheNyanBacon",
    "liar_adahn",
    "KamichanVT",
    "StuxMirai",
    "Beezul",
    "Kaat_VT",
    "Nanodan_",
    "epoch_smog",
    "sohakunni",
    "tzaro_ch",
    "bunzel_ch",
    "Momonga_Altosk",
    "purpur_lavandel",
    "MiloMolson",
    "itsybitsybones",
    "panda_doodles_",
    "SpooksyVT",
    "BoganBits",
    // Post-Group C: Alts/Bots of Existing Channels
    "PooltoyBot",
    "SetolyxBot",
    "tinymici",
    "CH47Says",
    "goodcop_",
    "podzprod"
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
    "digiko",
    "Aerze_the_Witch",
    "dumbmoths"
];