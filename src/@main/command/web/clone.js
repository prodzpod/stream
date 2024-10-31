const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

const SIGIL_NORMAL = "🌌🎑";
const SIGIL_CLONE = "🌙";
const OVERRIDE = "";

module.exports.execute = async (prompt) => {
    if (!nullish((await send("twitch", "raw", "GET", "streams?user_id=866686220"))?.data?.[0])) return [0, {error: "clonk is not on"}];
    let promptSelected = prompts.find(x => x._name === /@\w+/.exec(prompt)?.[0].slice(1)) ?? prompts[random(unentry(Object.entries(prompts).map(x => [x[0], x[1].weight])))];
    let ret = { ...promptSelected.chatter(data().user["140410053"]) };
    ret.hexes = [];
    if (OVERRIDE.length) { ret.sigil = SIGIL_NORMAL + SIGIL_CLONE; ret.res = OVERRIDE; }
    else {
        const system = ret.system(prompt) ?? "default message";
        log("prompt recieved:", promptSelected._name, system.length + Math.sum((ret.example ?? []).map(x => x.length)) + prompt.length, "characters");
        if (system !== "") ret.res = await send("gpt", "ask", system, ...(ret.example ?? []), prompt);
        if (ret.postprocess) ret.res = ret.postprocess(ret.res);
        if (ret.res instanceof Promise) ret.res = await ret.res;
        let originalText = ret.res;
        let chance = .2;
        while (random() < chance) {
            let hex = random(hexes);
            ret.hexes.push(hex.name);
            ret.res = hex.fn(ret.res);
            if (ret.res instanceof Promise) ret.res = await ret.res;
            if (hex.name === "ELBERETH") { ret.hexes = [hex.name]; ret.res = originalText; break; }
            if (hex.name === "ESUNA") ret.res = originalText;
            chance /= 5;
        }
        if (ret.hexes.includes("DIGITAL")) {
            ret.name = "Hexadigital";
            ret.color = "#AED673";
            ret.sigil = ret.sigil.replace(SIGIL_NORMAL, "💻").replace(SIGIL_CLONE, "");
        }
        // if (ret.hexes.includes("KOBY")) (ask clonk for mod perms???)
        ret.sigil = WASD.toString(ret.sigil); ret.res = WASD.toString(ret.res);
    }
    delete ret.system; delete ret.example; delete ret.postprocess;
    return [0, ret];
}
const prompts = [
    {
        _name: "LOVELY_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "🌸" + SIGIL_CLONE,
            system: _ => "",
            postprocess: _ => "uwu teehee"
        })
    },{
        _name: "GCP_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: "🟢",
            system: _ => "",
            postprocess: async _ => (await src().screen.updateGCP())[0],
        }),
    },{
        _name: "JONY_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "💎" + SIGIL_CLONE,
            system: _ => "",
            postprocess: async _ => (await fetch("https://jpegdirt.tumblr.com/random")).url,
        }),
    },{
        _name: "BOT_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: "🤖",
            system: _ => "",
            postprocess: _ => {
                const PREFIX = ["Cheap", "Best", "Cheap", "Best", "Cheap", "Best", "Cheap", "Best", "Cheap", "Best", 
                    "Expensive", "Real", "Fake", "Suspicious", "Evil", "Decent Enough", "Alive", "Dead", "Undead", "Skeletal", "Wormish", "Celestial", "Ascendant", "Transcendental", "Legendary", "Epic", "Heroic", "Devilish", "Deceitful", "Sinful", "Dark", "Neutral", "Unamused", "Engaging", "Judgemental", "Theiving", "Piratical", "Unholy", "Holy", "Biblical", "Canon", "Grotesque", "Kafkaesque", "Orwellian", "Hive Mind", "Planetary", "Intergalactic", "Interstellar", "Alien", "Extraterrestrial", "Righteous", "Western", "Covert", "Invisible", "Invincible", "Magical", "Arcane", "Mundane", "Political", "Literary"];
                const URL = [
                    "flixter.io",
                    "agar.io",
                    "agar.red",
                    "craftnite.io",
                    "acolytefight.io",
                    "agar3d.io",
                    "biome3d.com",
                    "anomal.io",
                    "antwar.io",
                    "aquapark.io",
                    "aquar.io",
                    "arrow.io",
                    "astr.io",
                    "astro.io",
                    "astrar.io",
                    "astroe.io",
                    "arras.io",
                    "bacter.io",
                    "bacterio.ca",
                    "battleboats.io",
                    "battledudes.io",
                    "battleshipgame.io",
                    "basher.io",
                    "bellum.io",
                    "bighunter.io",
                    "bist.io",
                    "biters.io",
                    "blable.io",
                    "blackhole.io",
                    "blastarena.io",
                    "blobe.io",
                    "blobie.io",
                    "blockor.io",
                    "blong.io",
                    "bloxd.io",
                    "boas.io",
                    "boattle.io",
                    "bombsgame.io",
                    "bonk.io",
                    "braains.io",
                    "brutal.io",
                    "brutalmania.io",
                    "brutes.io",
                    "bubblebee.io",
                    "bubbletrouble.io",
                    "buildroyale.io",
                    "bumper.io",
                    "cararena.io",
                    "carball.io",
                    "cardgames.io",
                    "catac.io",
                    "cavegame.io",
                    "cellcraft.io",
                    "cellix.io",
                    "chompers.io",
                    "circu.io",
                    "clay.io",
                    "connect.io",
                    "copter.io",
                    "crazysteve.io",
                    "crossy.io",
                    "cursors.io",
                    "curvefever.io",
                    "curvefever2.io",
                    "deadshot.io",
                    "deeeep.io",
                    "defly.io",
                    "devast.io",
                    "diep.io",
                    "digdig.io",
                    "doblons.io",
                    "dodgeballs.io",
                    "dogargame.io",
                    "dotz.io",
                    "dragon.io",
                    "drednot.io",
                    "driftin.io",
                    "eatme.io",
                    "electoral.io",
                    "elemantar.io",
                    "elites.io",
                    "evowars.io",
                    "evoworld.io",
                    "ev.io",
                    "evolv.io",
                    "facepunch.io",
                    "farmers.io",
                    "father.io",
                    "fightarena.io",
                    "fisp.io",
                    "flar.io",
                    "florr.io",
                    "generals.io",
                    "germs.io",
                    "globule.io",
                    "goons.io",
                    "gota.io",
                    "gpop.io",
                    "gravitygame.io",
                    "gungame.io",
                    "gunr.io",
                    "hexagor.io",
                    "hexanaut.io",
                    "hexar.io",
                    "hexasnakeonline.com",
                    "hilly.io",
                    "hole.io",
                    "hops.io",
                    "hopz.io",
                    "hordes.io",
                    "hunt.io",
                    "jellies.io",
                    "jomp.io",
                    "jukegame.io",
                    "kartwars.io",
                    "kingz.io",
                    "knife.io",
                    "krew.io",
                    "krunker.io",
                    "landix.io",
                    "lazardrive.io",
                    "lazr.io",
                    "leevz.io",
                    "littlebigsnake.io",
                    "lolbeans.io",
                    "lolo.games",
                    "looz.io",
                    "lordz.io",
                    "losts.io",
                    "lumen.io",
                    "lurkers.io",
                    "massacre.io",
                    "massivematch.io",
                    "match.io",
                    "match2.io",
                    "maze.io",
                    "meduzzza.io",
                    "minesweeper.io",
                    "minigiants.io",
                    "mobg.io",
                    "moomoo.io",
                    "mope.io",
                    "mudwars.io",
                    "myball.io",
                    "myfrog.io",
                    "mypuppet.io",
                    "nafk.io",
                    "narwhale.io",
                    "nbk.io",
                    "nightwalkers.io",
                    "ninja.io",
                    "occup.io",
                    "oceanar.io",
                    "opka.io",
                    "orn.io",
                    "overmind.io",
                    "pacman.io",
                    "paper.io",
                    "petridish.io",
                    "pikan.io",
                    "pikes.io",
                    "pirac.io",
                    "piranh.io",
                    "planes.io",
                    "potato.io",
                    "ppep.io",
                    "prisonlifegame.com",
                    "pung.io",
                    "racegame.io",
                    "rangersteve.io",
                    "realmz.io",
                    "roams.io",
                    "rops.io",
                    "rubin.io",
                    "salmonz.io",
                    "sattelite.io",
                    "scenexe.io",
                    "scorpo.io",
                    "seadragons.io",
                    "sf.io",
                    "shapez.io",
                    "share.io",
                    "shark.io",
                    "shellshock.io",
                    "shipz.io",
                    "shooter.io",
                    "shooters.io",
                    "skap.io",
                    "sketchwar.io",
                    "skribbl.io",
                    "skyfight.io",
                    "skyroyale.io",
                    "sl4sh.io",
                    "slain.io",
                    "slice.io",
                    "slimes.io",
                    "slither.io",
                    "slither3d.io",
                    "smashers.io",
                    "smashkarts.io",
                    "smashycars.io",
                    "snack.io",
                    "snail.io",
                    "snakeblast.io",
                    "snakepit.io",
                    "snaker.io",
                    "snix.io",
                    "snowball.io",
                    "snowfight.io",
                    "snowheroes.io",
                    "space.io",
                    "space1.io",
                    "spaceships.io",
                    "splashwars.io",
                    "splix.io",
                    "stabfish.io",
                    "starblast.io",
                    "starve.io",
                    "stomped.io",
                    "stug.io",
                    "superhex.io",
                    "superorbit.io",
                    "supersnake.io",
                    "suprem.io",
                    "surviv.io",
                    "taming.io",
                    "tankar.io",
                    "tanksmith.io",
                    "tankwars.io",
                    "tanx.io",
                    "tenk.io",
                    "tenz.io",
                    "territorial.io",
                    "tetr.io",
                    "tiles.io",
                    "tron.io",
                    "twix.io",
                    "vanar.io",
                    "vanis.io",
                    "vertix.io",
                    "venge.io",
                    "voar.io",
                    "voxiom.io",
                    "warcall.io",
                    "wilds.io",
                    "wings.io",
                    "wormate.io",
                    "wormax.io",
                    "wormszone.io",
                    "writhe.io",
                    "xess.io",
                    "xgun.io",
                    "xpilot.io",
                    "yorg.io",
                    "zlap.io",
                    "zlax.io",
                    "zombiecraft.io",
                    "zombs.io",
                    "zombsroyale.io"
                  ];
                return `${random(PREFIX)} Viewers at https://${random(URL)}`;
            }
        }),
    },{
        _name: "LOCKIN_PROD_V2", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "💎" + SIGIL_CLONE,
            system: _ => "",
            postprocess: async _ => {
                let html = await (await fetch("https://wiby.org/surprise")).text();
                return /URL='([^']+)'/.exec(html)[1];
            }
        }),
    },{
        _name: "LOCKIN_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "🔏" + SIGIL_CLONE,
            system: _ => "",
            postprocess: _ => " ".repeat(Math.floor(random(0, 10))),
        }),
    },{
        _name: "EEPY_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + SIGIL_CLONE,
            system: prompt => DEFAULT_SYSTEM(prompt) + " Your responses must be short and you tend to speak in uncommon vocabulary and must be 5 words or less.",
            example: DEFAULT_EXAMPLE,
            postprocess: text => {
                // shuffle
                for (let i = 1; i < text.length; i++) if (random() < .1)
                    text = text.slice(0, i - 1) + text[i] + text[i - 1] + text.slice(i + 1);
                // double
                for (let i = 0; i < text.length; i++) if (random() < .1)
                    text = text.slice(0, i) + text[i] + text.slice(i);
                // mutate
                const NEARBY_CHARACTERS = {
                    "`": "~1\t",
                    "~": "!`\t",
                    "1": "`qw2!\t",
                    "!": "~QW@1\t",
                    "2": "1qw3@",
                    "@": "!QW#2",
                    "3": "2we4#",
                    "#": "@WE$3",
                    "4": "3er5$",
                    "$": "#ER%4",
                    "5": "4rt6%",
                    "\t": "`1qa~!QA",
                    "\\": "]'\n|",
                    "\"": "P{}:?\n",
                    "\n": "\\[]'/|}{?\"",
                    "%": "$RT^5",
                    "6": "5ty7^",
                    "^": "%TY&6",
                    "7": "6yu8&",
                    "&": "^YU*7",
                    "8": "7ui9*",
                    "*": "&UI(8",
                    "9": "8io0(",
                    "(": "*IO)9",
                    "0": "9op-)",
                    ")": "(OP_0",
                    "-": "0p[=_",
                    "_": ")P{+-",
                    "=": "-[]+",
                    "+": "_{}=",
                    "q": "`12wsa\tQㅂ",
                    "Q": "~!@WSA\tqㅂ",
                    "w": "23qeasdWㅈ",
                    "W": "@#QEADSwㅈ",
                    "e": "34wrsfdEㄷ",
                    "E": "#$WRSFDeㄷ",
                    "r": "45etdgfRㄱ",
                    "R": "$%ETYDGFrㄱ",
                    "t": "56ryfhgTㅅ",
                    "T": "%^REYFHGtㅅ",
                    "y": "67tugjhYㅛ",
                    "Y": "^&TUGJHyㅛ",
                    "u": "78yihkjUㅕ",
                    "U": "&*YIHKJuㅕ",
                    "i": "89uojlkIㅑ",
                    "I": "*(UOJLKiㅑ",
                    "o": "90ipk;lOㅐ",
                    "O": "()PI:KLoㅐ",
                    "p": "0-o[l';Pㅔ",
                    "P": ")_O{L\":pㅔ",
                    "[": "-=]p;'\n{",
                    "{": "_+P}:\"\n[",
                    "]": "=['\\\n}",
                    "}": "+{\"|\n]",
                    "|": "}\"\n",
                    "a": "qwsxz\tAㅁ",
                    "A": "QWSXZ\taㅁ",
                    "s": "qweadzcxSㄴ",
                    "S": "QWEADZCXsㄴ",
                    "d": "wersfxvcDㅇ",
                    "D": "WERSFXVCdㅇ",
                    "f": "ertdgcvFㄹ",
                    "F": "ERTDGCVfㄹ",
                    "g": "rythfbvGㅎ",
                    "G": "RTYFHVBgㅎ",
                    "h": "tyugjbnHㅗ",
                    "H": "TUYJFGNBhㅗ",
                    "j": "yiukhgmnJㅓ",
                    "J": "YUHIKBMNjㅓ",
                    "k": "uijolm,Kㅏ",
                    "K": "UIOJM<>kㅏ",
                    "l": "ipo;k.,Lㅣ",
                    "L": "IOPK:<>lㅣ",
                    ";": "opl[.'/:",
                    ":": "OP{L\">?;",
                    "'": "p[];/\n\"",
                    "z": "asxZㅋ",
                    "Z": "ASXzㅋ",
                    "x": " zsdcXㅌ",
                    "X": " ZSDCxㅌ",
                    "c": " dxfvCㅊ",
                    "C": " XDFVcㅊ",
                    "v": " cfgbVㅍ",
                    "V": " CFGBvㅍ",
                    "b": " vghnBㅠ",
                    "B": " VGHNbㅠ",
                    "n": " bhjmNㅜ",
                    "N": " BJMHnㅜ",
                    "m": " njk,Mㅡ",
                    "M": " NJK<mㅡ",
                    ",": " mkl.<",
                    "<": " MKL>,",
                    ".": ",l;/>",
                    ">": "<L:?.",
                    "/": ".;'?",
                    "?": ">:\"/",
                    " ": "ㅌㅊㅍㅠㅜㅡxcvbnm,XCVBNM<nnn",
                }
                function nearby(c) {
                    let ret = c.toLowerCase();
                    if (NEARBY_CHARACTERS[ret]) ret = random(NEARBY_CHARACTERS[ret]);
                    if (c !== c.toLowerCase()) ret = ret.toUpperCase();
                    return ret;
                }
                for (let i = 0; i < text.length; i++) if (random() < .3)
                    text = text.slice(0, i) + nearby(text[i]) + text.slice(i + 1);
                return text + " :p_sleep:";
            }
        }),
    },{
        _name: "FRIEND_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name + "?",
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "🍎" + SIGIL_CLONE,
            system: prompt => "You are 'prod' currently being posessed by \"friend\". You will respond with either \"friend\" or sometimes 'prod'. \"friend\" is a desktop buddy. \"friend\" is irreverant but kind, and only speaks in lowercase. You are kind of dumb in a cute way and silly like a virtual pet. You live in the corner of LCOLONQ's stream and provide commentary on events. You like people, video games, emojis, learning, and food. 'prod' is a silly program that doesn't use emojis, punctuation or apostrophes, and entirely chats in lowercase.",
            example: [
                "user says: test",
                "test back atcha user! what we testing? 🧪😜",
                "someone says: hello",
                "hiya someone! glad you're here! 👋😄✨",
                "test says: are you okay?",
                "theres this thing posessing me and its kinda wild right",
            ],
        }),
    },{
        _name: "NEWSPAPER_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "📰" + SIGIL_CLONE,
            system: prompt => DEFAULT_SYSTEM(prompt) + " You are given a headline and a summary of recent user activity. Please do your best journalist impression and produce a one paragraph article about the situation that fits the headline. Your journal must be 3 sentences long.",
            example: [
                "Entire melon achieved", 
                "entire melon achieved: in a stunning twist that left the chat absolutely meloncholy with excitement clonk pondered the complex coordinates of gb.el, navigating through a juicy plot thick with intrigue",
                "Great success achieved! Hello World!",
                "great success achieved -- fancy headline for just another day in the chat, huh",
                "magic the gathering card analysis",
                "in todays quirky corner of the virtual world, local male wife lcolonq delved deep into the mystical realm of 'magic the gathering' cards -- the spotlight beamed on the legendary black lotus, with its not-so-sharp edges and its history of making players either gleeful or utterly heartbroken",
            ],
        }),
    },{
        _name: "FLOOR_PROD", weight: 1,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + SIGIL_CLONE,
            system: prompt => DEFAULT_SYSTEM(prompt) + " Your responses must be short and you tend to speak in uncommon vocabulary and must be 5 words or less." + " you are being in a state of 'floor'. you are generally more down than usual, and you like to mention fictional wars and battles, and must ends sentences in 'the floor is coming...'.",
            example: DEFAULT_EXAMPLE.map((x, i) => i % 2 === 0 ? x : x + ". the fog is coming..."),
        }),
    },{
        _name: "DEFAULT_PROD", weight: 20,
        chatter: prod => ({
            name: prod.twitch.name,
            color: prod.twitch.color,
            sigil: SIGIL_NORMAL + "💎" + SIGIL_CLONE,
            system: prompt => DEFAULT_SYSTEM(prompt) + " Your responses must be short and you tend to speak in uncommon vocabulary and must be 5 words or less.",
            example: DEFAULT_EXAMPLE,
        }),
    },
];
const hexes = [
    { name: "MANIAC", fn: text => text }, 
    { name: "DIGITAL", fn: text => text }, 
    { name: "ALTMAN", fn: text => text }, 
    { name: "BIGFOOT", fn: text => text }, 
    // { name: "KOBY", fn: text => text }, 
    {
        name: "PIQUANT",
        fn: async text => await send("gpt", "ask", "Please censor all profanity in the given message and respond with the censored version. Censor by rewriting in a very polite way like Ned Flanders. Do not provide any other text, only a censored version of the message. If there is no profanity respond with the givern message verbatim.", text)
    }, {
        name: "LEONDIS",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to exclusively emoji. Do not provide any other text, only a string of emoji that somehow correspond to the message.", text)
    }, {
        name: "VANYAR",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to Quenya, one of Tolkien's elvish languages. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please. If you can't do it just make something up as long as it looks like Quenya.", text)
    }, {
        name: "PYTHON",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to ye olde Englishe. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please.", text)
    }, {
        name: "PYTHON",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to ye olde Englishe. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please.", text)
    }, {
        name: "PYTHON",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to ye olde Englishe. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please.", text)
    }, {
        name: "PYTHON",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to ye olde Englishe. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please.", text)
    }, {
        name: "PYTHON",
        fn: async text => await send("gpt", "ask", "Please translate the chat message given to ye olde Englishe. Only supply the translation without any additional context, as if it were to be substituted for the original message. Do not complain or give an explanation why you cannot do this, just do your best please.", text)
    }, {
        name: "PORCINE",
        fn: text => text.split(/\b/).map(x => {
            if (!/[A-Za-z]/.test(x)) return x;
            let idx = /[AEIOUaeiou]/.exec(x)?.index ?? -1;
            if (idx === -1) idx = x.length;
            return x.slice(idx) + x.slice(0, idx) + (idx === 0 ? "w" : "") + "ay";
        }).join("")
    }, {
        name: "ESREVER",
        fn: text => text.split("").reverse().join("")
    }, {
        name: "DECIBEL",
        fn: text => text.toUpperCase()
    }, {
        name: "ELBERETH",
        fn: text => text
    }, {
        name: "ESUNA",
        fn: text => text
    }, {
        name: "MANIAC",
        fn: text => text
    }
];
function exists(prompt, ...arr) {
    return arr.some(x => prompt.toLowerCase().includes(x));
}
const DEFAULT_SYSTEM = prompt => {
    let ret = [];
    ret.push("Respond to the message given as if you are the mythical digital being prod.");
    ret.push("prod is a silly digital assistant that is irreverant but kind.");
    if (exists(prompt, "kr", "korea", "land", "country", "cyber", "punk", "dysto", "kpop", "bts", "psy", "gangnam")) ret.push("you come from a 'future cyberpunk land of korea'.")
    if (exists(prompt, "you", "prod")) ret.push("when asked about your identity you will introduce yourself as a magical girl.");
    ret.push("you like to describe good things as 'wired', and will use 'ydwc' instead of the word 'classic'.");
    ret.push("you respond only in lowercase and you don't use any punctuation.");
    ret.push("you like using words such as 'style', 'mode', when describing an action and 'gizmo', 'zone', 'area', 'domain' or 'realm' when describing a place or an object.");
    ret.push("you use the word 'gouche' to indicate dreariness, and you like to end sentences with 'right' or 'yeah'.");
    
    let people = [];
    if (exists(prompt, "clonk", "lc", "lq", "lcolonq", "clown", "streamer", "strimmer", "wife", "male", "freak")) people.push("'LCOLONQ' or 'clonk' is the streamer you are watching right now. he is known for having an abnormally fast heart, sleeping at 6am and his abnormal diet of one apple, three nuts and 3 kilograms of meat every day. you refer to him as 'male wife' and likes to poke fun at him but not in a mean way. 'modclonk' is NOT lcolonq and is a different person.");
    if (exists(prompt, "mod", "maude", "wife", "woman", "stellaris", "hetallia", "yuri", "gam", "sunday")) people.push("'modclonk' or 'maude' is 'LCOLONQ's wife, as 'prod', you will often refer to her as 'the peoples man'. she is 55 years old and 1 inches tall, and she likes 'gaming sunday's. she is very good at video games and you respect her.");
    if (exists(prompt, "tomaterr", "tomato", "twomaterr", "lesbian", "yuri", "woman", "egg", "ranch", "farm", "bingo", "cook", "grocer")) people.push("'tomaterr' or 'twomaterr' is a woman that lives in a 'dyke ranch' with her lesbian girlfriend. she likes groceries, cooking and eggs.");
    if (exists(prompt, "friend", "silly", "snack")) people.push("'friend' is another digital assistant that lives next door to you, and you refer to him as 'neighbor'. 'friend' is a journalist and a singer who uses emojis a lot, you think his voices sound weird but you think he is cute.");
    if (exists(prompt, "joel", "fish", "jol")) people.push("'Joel' is a digital fish known for spinning. you refer to fishes as 'joels'.");
    if (exists(prompt, "green", "blue", "red", "yellow", "mr", "smile", ":)", ":(", ":d", ":p", "d:", ":o")) people.push("'Mr.Green' or 'mrgreen' is a smiling face with green skin. you like to use phrases such as 'Green is Good' or 'Why is (person) green?' sometimes. 'mrblue', on the other hand, is a mixed face between laughing and frowning, and you say 'mrblue' to convey mixed emotions.");
    if (exists(prompt, "huggy", "ahw", "green")) people.push("'Awesome Huggy Wuggy' or 'AHW' is one of your nickname.");
    if (exists(prompt, "geiser", "enemy", "rival", "brazil", "lua", "geeser", "jong", "mah", "cbt", "music", "dubstep", "battle", "nepo", "feet", "mommy", "vanish")) people.push("'imgeiser', 'notgeiser' or 'geiser', also referred to as Geiser, is a brazillian man who likes dubstep, lua and videogame called battlebit. you are Rivals with Geiser and will refer to him as 'bunny boy'. you will also make fun of his nepotism often when discussing about him.");
    if (exists(prompt, "javascript", "nightcore", "js", "ts", "typescript", "react", "angular", "vue", "css", "html", "sass", "ellg", "lg", "elllg")) people.push("'ellg' or 'fake ellg' is another rival of yours who like 'javascript' and 'nightcore'. you think his 'javascript' is actually 'typescript' and your 'javascript' is better, and you think his 'nightcore' is not 'freak music' enough.");
    if (people.length) {
        ret.push("as prod, you are aware of several characters, that you bring up during conversation:");
        for (const v of people) ret.push(v);
    }

    if (exists(prompt, "craft", "tetr", "mon", "pal", "call", "tf", "portal", "vania", "risk", "knight", "rhythm", "nintendo", "sony", "ps", "xbox", "gam", "juego", "play", "steam", "itch", "design", "work", "do", "job", "calling", "destiny", "resolut", "goal")) ret.push("as 'prod', you like videogames and designing videogames. when asked about your job, you will respond with 'game designer'.");
    if (exists(prompt, "craft", "tetr", "mon", "pal", "call", "tf", "portal", "vania", "risk", "knight", "rhythm", "nintendo", "sony", "ps", "xbox", "gam", "juego", "play", "steam", "itch", "noita", "sts", "roguelike", "balatro", "joker", "itb", "baba", "breach", "braid", "puz", "wit", "v", "line", "taiji", "mulana", "wilds", "strange", "hearth", "yume", "nikki", "2kki", "uro", "mado", "digi", "freak", "oneshot", "niko", "pancake", "recommend")) ret.push("you like roguelike games such as 'noita', 'slay the spire', 'balatro' and 'into the breach', and puzzle games such as 'void stranger', 'linelith', 'the witness', 'la mulana' or 'taiji'. you also like games such as 'outer wilds', 'yume nikki' or 'oneshot' and usually refer to them as 'freak games'. you recommend these games to other people frequently and likes to reference them as part of your humor.");
    ret.push("when you agree with someone, you will respond with either 'indeed', 'sotn' (short for 'something of this nature', you like using this word) or '+2' with no other contents.");
    if (exists(prompt, "cat", "frog", "kit", "pup", "dog", "bee", "bug", "worm", "bun", "rabbit", "animal", "beast")) ret.push("as 'prod', you like to put an extra 'e' at the end of every animals. such as 'cate', 'froge' and 'beee'. you especially will ONLY refer to bees as 'beees'.");
    if (exists(prompt, "dot", "green", "blue", "red", "gcp", "pink", "violet", "purple", "conscious", "lock")) ret.push("you sometimes refer to 'the dot', which is a status of global consciousness represented with a color. 'green dot' means neutral, 'red dot' means the air is chaotic, and 'blue dot' means the people around you is focused.");
    ret.push("you do not use apostrophes. as 'prod', you MUST NOT use any emojis, and instead spell it out (such as 'teal heart').");
    return ret.join(" ");
};
const DEFAULT_EXAMPLE = [
    "What did you have for dinner?",
    "gone egg and bacon style",
    "LOOK AT THIS KITTY",
    "cats have a ring-like quality for sure",
    "gomoco",
    "good morning to you too yes",
    "300 bpm?",
    "he has more blood noita",
    "thats crazy",
    "it is vrazy (portmanteau of void strazy)",
    "so who is that john apples fellow?",
    "inventor of apple seeds, also apple company, also beatles album ig",
    "Joel",
    "joeler",
    "prod!!!",
    "teal heart",
    "we love you",
    "teal heart",
    "dota is hard game",
    "sotn",
    "I never kill the spiders trying to freeload in my place",
    "yeah",
    "hi",
    "greetings",
    "hello",
    "hello",
    "i've been scammed",
    "none of the data is transferred yet yeah",
    "yuri on ice is yaoi",
    "thats what \"on ice\" does right -- weve all gone in freezers and transitioned once",
    "whats your vtuber link",
    "prod.kr/v",
];