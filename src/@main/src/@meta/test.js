const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math, time, formatDate, numberish, delay, split, unique } = require("../../common");
const { log, path, fetch, listFiles, info, download, debug } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
  for (let k in FOLIO) data(`portfolio.${k}`, FOLIO[k]);
  _reply(":3");
  return [0, ""];
}

const FOLIO = {
0x0: /* twitch.tv/prodzpod */ {
    images: [
        "youtube.com/watch?v=DMyBksPMbps",
    ].filter(x => x.length),
    description: nullish(`
        Experimental interactive live broadcast program with a custom frontend
        Recorded over <b>10,000</b> hours watched and counting
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x1: /* Startellers */ {
    images: [
        "//img.itch.zone/aW1hZ2UvMjI0NTE3MS8xMzMwMjYzOS5wbmc=/original/vOUlL4.png",
        "//img.itch.zone/aW1hZ2UvMjI0NTE3MS8xMzMwMjYzNi5wbmc=/original/kvKgm5.png",
        "//img.itch.zone/aW1hZ2UvMjI0NTE3MS8xMzMwMjYzOC5wbmc=/original/4F0dJI.png",
        "//img.itch.zone/aW1hZ2UvMjI0NTE3MS8xMzMwMjYzNS5qcGc=/original/n8LBjR.jpg",
    ].filter(x => x.length),
    description: nullish(`
        A Co-op platformer where one person controls a mouse, and one controls a keyboard
        Features a custom physics engine and peer-to-peer networking protocol built from the ground up 
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2: /* looksy */ {
    images: [
        "//prod.kr/images/folio/looksy1.png",
        "//prod.kr/images/folio/looksy2.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x3: /* Ghabi's Forest */ {
    images: [
        "//prod.kr/images/folio/ghabi1.png",
        "//prod.kr/images/folio/ghabi2.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4: /* Chambers of L */ {
    images: [
        "//prod.kr/images/folio/chambers1.png",
        "//prod.kr/images/folio/chambers2.png",
        "//prod.kr/images/folio/chambers3.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x10: /* SAMMI Extensions */ {
    images: [
        "//prod.kr/images/folio/sammi.mp4",
        "//prod.kr/images/folio/sammi1.png",
        "//prod.kr/images/folio/sammi2.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x11: /* ZeroDayToolKit */ {
    images: [
        "youtube.com/watch?v=RvjEALgUff0",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x12: /* 2023 Secret Doctah */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x13: /* HOW */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x14: /* RRrroohrrRGHHhhh!! */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x15: /* BepInEx for Core Keeper */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x16: /* urobot */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x17: /* Creepy Castle: Ribbon of the Strategist */ {
    images: [
        "youtube.com/watch?v=LeW8HZaZFN4",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x18: /* Planar Artifice */ {
    images: [
        "//prod.kr/images/folio/pa.gif",
        "//prod.kr/images/folio/pa1.png",
        "//prod.kr/images/folio/pa2.png",
        "//prod.kr/images/folio/pa3.png",
        "//prod.kr/images/folio/pa4.png",
        "//prod.kr/images/folio/pa5.png",
        "//prod.kr/images/folio/pa6.png",
        "//prod.kr/images/folio/pa7.png",
        "//prod.kr/images/folio/pa8.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x20: /* Clayheads */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x21: /* Kalimba */ {
    images: [
        "youtube.com/watch?v=Qk6x0T2C940",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x22: /* Yamame */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x23: /* Tosim Elementia */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x24: /* Canonize */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x25: /* /card */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x26: /* Woggle Solver */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x27: /* lala/chat */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x28: /* BlessScript */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x29: /* The Screen */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2A: /* !song */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2B: /* stargen */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2C: /* /rdtutorial */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2D: /* /adofaitimeline */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x2E: /* Yume Nikki Blogs */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x40: /* Downpour */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x41: /* Recovered and Reformed */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x42: /* Radiant Malignance */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x43: /* Huntress Momentum */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x44: /* Eclipse Selector */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x45: /* Nemesis Rising Tides */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x46: /* Nemesis Spikestrip */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x47: /* Faster Boss Wait 2 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x48: /* Consistent Stage Features */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x49: /* Proper Loop */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4A: /* Better Moon Pillars */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4B: /* Limited Interactables */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4C: /* Achievement Pins */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4D: /* Fall Damage Changes */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4E: /* Resume Music Post Teleporter */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x4F: /* Ultrakill Skin Mod 17 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x50: /* Link Paladin */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x51: /* Realer Stage Tweaker */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x52: /* Modpack Debugger */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x53: /* Miner Skill Returns */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x54: /* Better Jade Elephant */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x55: /* Realer Config Aspect Drop Chance */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x56: /* Sqwaky Goose */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x57: /* TILER2 No Poll */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x58: /* Zet Aspect Highlander */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x59: /* Misc Modpack Utils */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x5A: /* White Guillotine */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x5B: /* WRB Standalone */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x5C: /* Cracked Slab */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x5D: /* Multichested */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x60: /* Stage Aesthetic */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x61: /* Inferno */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x62: /* Hypercrit 2 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x63: /* Realer Cheat Unlock */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x64: /* Realer Mystic's Items */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x65: /* Realer Rising Tides */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x66: /* Realer Extra Challenge Shrines */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x67: /* Realer Bulwark's Haunt */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x68: /* Realer Elite Variety */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x69: /* Prodzpod Spikestrip Content */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6A: /* Realer Hex3Mod */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6B: /* Templar Returns Returns */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6C: /* Bandit Dynamite Toss */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6D: /* Sunken Tombs */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6E: /* Ephemeral Coins */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x6F: /* Groove Salad vs the Game */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x70: /* Realer Void Fart Reverb */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x71: /* Sandswept */ {
    images: [
        "youtube.com/watch?v=XnAgXBzBKyI",
        "//i.postimg.cc/Qxwf7yLw/booook-1.gif",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x72: /* Starstorm 2 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x73: /* Well Rounded Balance */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x74: /* Lazy Bastard Engineer */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x80: /* stell ost */ {
    images: [
        "youtube.com/watch?v=hpZ6dGeR6jA",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x81: /* sdswgame ost */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x82: /* br ost */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x83: /* windup */ {
    images: [
        "youtube.com/watch?v=Kh7RUSyJdCc",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x84: /* ccrots ost */ {
    images: [
        "youtube.com/watch?v=K48gDh5lW_c",
        "youtube.com/watch?v=Prna1IdgYmo",
        "youtube.com/watch?v=MllQQJzs81A",
        "youtube.com/watch?v=qrE_jNurSwE",
        "youtube.com/watch?v=MRcK34-HwS0",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x85: /* bitcat  */ {
    images: [
        "youtube.com/watch?v=BHP8XIwrhYU",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x86: /* krdrpg */ {
    images: [
        "youtube.com/watch?v=LU0pt6lHnZY",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x87: /* unakite */ {
    images: [
        "youtube.com/watch?v=J9o64Bjtsgs",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x88: /* grifa */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x89: /* blackstreet */ {
    images: [
        "youtube.com/watch?v=0ZxlYLiHIjY",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x8A: /* :) */ {
    images: [
        "youtube.com/watch?v=qDw_DETNgVE",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x8B: /* mickynoon */ {
    images: [
        "youtube.com/watch?v=-QWLY4yim8k",
        "youtube.com/watch?v=bBAhT_hersA",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0x8C: /* phonk */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA0: /* the prod[v]pod experience */ {
    images: [
        "youtube.com/watch?v=mzi5EmdsbXU",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA1: /* Season 0 Ending */ {
    images: [
        "youtube.com/watch?v=Ks-_1JssKYQ",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA2: /* Season 1 Opening */ {
    images: [
        "youtube.com/watch?v=4ZUqRyJNn2s",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA3: /* Season 1 Ending */ {
    images: [
        "youtube.com/watch?v=DMyBksPMbps",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA4: /* ZeroDayToolKit 1.0 Release Trailer */ {
    images: [
        "youtube.com/watch?v=RvjEALgUff0",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA5: /* Creepy Castle: Ribbon of the Strategist Release Trailer */ {
    images: [
        "youtube.com/watch?v=LeW8HZaZFN4",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA6: /* SAMMI Extensions Release Promo */ {
    images: [
        "//prod.kr/images/folio/sammi.mp4"
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA7: /* previously on mickynoon */ {
    images: [
        "youtube.com/watch?v=bBAhT_hersA",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA8: /* /malphon/startingsoon */ {
    images: [
        "//prod.kr/images/folio/malphon.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xA9: /* Yume 2kki Planetarium Wallpaper */ {
    images: [
        "//prod.kr/images/folio/planetarium.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xAA: /* Jesus is Lit */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xAB: /* Bit Cat Rangers Soundtrack [001] */ {
    images: [
        "youtube.com/watch?v=BHP8XIwrhYU",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xAC: /* Downpour Speed Comparison */ {
    images: [
        "youtube.com/watch?v=W0VlysVaudI",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xAD: /* ★■▲🌺▲■★ (Instrumental) */ {
    images: [
        "youtube.com/watch?v=eUjz0A97Y54",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC0: /* x0o0x - ------ */ {
    images: [
        "youtube.com/watch?v=rIAnNpPL-hE",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC1: /* FantomenK - The Massacre */ {
    images: [
        "youtube.com/watch?v=N04OXvxr0mM",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC2: /* artifact - Pure_Heart */ {
    images: [
        "youtube.com/watch?v=ZUgimaDoNvM",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC3: /* prodzpod - It Takes Two */ {
    images: [
        "youtube.com/watch?v=ZuH4Sap1EKc",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC4: /* そして悔いを改めるのでしょう。- アナフェマ */ {
    images: [
        "youtube.com/watch?v=kM1W6PG_y6Q",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC5: /* Inverted Silence - Vista (but there's a banana) */ {
    images: [
        "youtube.com/watch?v=iG4392zxYVg",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC6: /* 夏毛 - あさやけもゆうやけもないんだ */ {
    images: [
        "youtube.com/watch?v=oUIziGyDN80",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC7: /* Shirobon - Take Me to Pleasure Island */ {
    images: [
        "youtube.com/watch?v=QLd2XGOkTgQ",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC8: /* Carly Rae Jepsen - Run Away With Me */ {
    images: [
        "youtube.com/watch?v=rFzsgRpt_-I",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xC9: /* Green Wisteria - 英雄 / 虚数 (選択 mix) */ {
    images: [
        "youtube.com/watch?v=_NNUBbm62U0",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCA: /* Xack - ? */ {
    images: [
        "youtube.com/watch?v=7Ok28xsrV2U",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCB: /* "Hello, my Name is..." */ {
    images: [
        "youtube.com/watch?v=KXejw_SZiU8",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCC: /* Speder2 - 無常 */ {
    images: [
        "youtube.com/watch?v=rFNo9xpQ8yw",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCD: /* Bossfight - Pomodoro */ {
    images: [
        "youtube.com/watch?v=kcboleO0snU",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCE: /* 井荷麻奈実 - パープル・パラソルのパラドックス */ {
    images: [
        "youtube.com/watch?v=R06b9Hddxyc",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xCF: /* 左右白 - relix[short] */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xD0: /* Random Guy JCI - chimken.mp3 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xD1: /* NY Channel - 没 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xD2: /* NY Channel - ジャズっぽくてカッコいいリリースカットピアノの曲 */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xD3: /* FantomenK - Gee */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE0: /* le */ {
    images: [
        "//prod.kr/images/folio/le.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE1: /* dlo */ {
    images: [
        "//prod.kr/images/folio/dlo.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE2: /* Down Your Spine */ {
    images: [
        "youtube.com/watch?v=V0U6Yp77Wow",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE3: /* Playing by Ear */ {
    images: [
        "",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE4: /* Aquarium Seoul */ {
    images: [
        "youtube.com/watch?v=8wtwV6ioUjw",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE5: /* /octaduction */ {
    images: [
        "//prod.kr/images/folio/octaduction.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
},
0xE6: /* Witmini #26 */ {
    images: [
        "//prod.kr/images/folio/witmini.png",
    ].filter(x => x.length),
    description: nullish(`
        
    `.split("\n").map(x => x.trim()).join("\n").trim())
}
}