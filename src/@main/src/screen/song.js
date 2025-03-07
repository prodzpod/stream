const fs = require("fs");
const { send, src } = require("../..");
const { nullish, Math, random, deidn, unbits, numberish, split } = require("../../common");
const { listFiles, log, path } = require("../../commonServer");
const GLOBAL_SPEEDUP = 120 / 106.5; // some kind of lag

module.exports.predicate = ["!song", "!sing", "!play", "!bell", "!bells", "!s"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text) => {
    if (!src().screen.isScreenOn(_reply)) return [1, ""];
    if (!src().user.cost(_reply, chatter, 100)) return [0, ""];
    let raw = split(text, /\s+/, 1)[1], x, y;
    if (typeof numberish(split(raw, /\s+/, 1)[0]) === "number") {
        [x, y, raw] = split(raw, /\s+/, 2);
        x = Math.clamp(Math.round(Number(x)), 0, 1920), y = Math.clamp(Math.round(Number(y)), 0, 1080);
    } else { x = Math.floor(random(1, 1919)); y = Math.floor(random(1, 1079)); }
    raw = raw.trim(); const _raw = split(raw, ".wmid")[0]
    if ((await listFiles("src/@main/data/song")).includes(split(_raw, ".wmid")[0] + ".wmid")) {
        log("Redeeming:", "song", x, y, _raw + ".wmid", _raw);
        send("gizmo", "song", x, y, _raw + ".wmid", _raw);
        _reply(`Playing ${_raw}.wmid`);
        return [0, _raw + ".wmid"];
    }
    const isNumber = /^\d*\.\d+|^\d+/; // sorry scientific notationbros but No
    const isNote = /[A-Na-nXSRTQYUOPWxsrtqyuopw\[\?\/]/;
    const isModifier = /[\"\"\,\-\=\;\:\+\~\_\@\<\>\!\&\]]/;
    const isGlobalModifier = /[\"\"\,\-\=\;\:\%\.\&]/;
    const defaultGlobalModifier = () => ({
        BPM: 75,
        octave: -1,
        EDO: 12
    });
    const defaultModifier = () => ({
        totalBeat: 0,
        currentBeat: 1,
        octave: 0,
        removeAttack: false,
        removeRelease: false,
        advanceStaff: true
    });
    const defaultStaff = () => ({
        instrument: "",
        global: defaultGlobalModifier(),
        second: 0,
        notes: [],
        modifier: defaultModifier(),
        flags: { chord: false, subtractBeats: false },
        lastGlobalModifier: defaultGlobalModifier(),
        lastModifier: defaultModifier()
    });
    // global vars
    let remaining = decompress(raw) + "|";
    let fname = `_${chatter.twitch.name}_${new Date().getTime()}`;
    let song = [];
    let char = "";
    let staff = defaultStaff();
    // state
    const STATE = {
        INSTRUMENT: (char, staff) => {
            if (char === "|" || (!/\w/.test(staff.instrument) && typeof numberish(char) === "number")) {
                remaining = staff.instrument + remaining;
                staff.instrument = "sine";
                return [STATE.GLOBAL_MODIFIER, staff, false];
            }
            if (typeof numberish(char) === "number") { // special handling bc periods gets captured lol
                const d = char.split("."); staff.instrument += d[0];
                if (nullish(d[1])) staff.global.BPM = Number(d[1]);
                return [d.length > 1 ? STATE.GLOBAL_MODIFIER : STATE.INSTRUMENT, staff, true];
            }
            if (isGlobalModifier.test(char)) {
                staff.instrument = staff.instrument.replace(/\W/g, "");
                return [STATE.GLOBAL_MODIFIER, staff, false];
            }
            staff.instrument += char;
            return [STATE.INSTRUMENT, staff, true];
        },
        GLOBAL_MODIFIER: (char, staff) => {
            if (typeof numberish(char) === "number") { // bpm
                staff.global.BPM = Number(char.startsWith(".") ? char.slice(1) : char);
                return [STATE.GLOBAL_MODIFIER, staff, true];
            }
            if (isGlobalModifier.test(char)) {
                switch (char) {
                    case "'": staff.global.octave += 2; break;
                    case "\"": staff.global.octave += 1; break;
                    case ",": staff.global.octave -= 2; break;
                    case "-": staff.global.BPM *= 2; break;
                    case "=": staff.global.BPM *= 3; break;
                    case ";": staff.global.BPM /= 2; break;
                    case ":": staff.global.BPM /= 3; break;
                    case "%": staff.global.EDO = takeAdditionalNumber() ?? 12; break;
                    case "&": staff.global = staff.lastGlobal; break;
                }
                return [STATE.GLOBAL_MODIFIER, staff, true];
            }
            if (!nullish(staff.instrument) && /[A-Za-z_]/.test(char)) return [STATE.SONG_NAME, staff, false];
            if (isNote.test(char)) return [STATE.NOTE, staff, false];
            return [STATE.GLOBAL_MODIFIER, staff, true]; // default: ignore other chars
        },
        NOTE: (char, staff) => {
            if (isModifier.test(char) || char === "|" || char === "?") return [STATE.MODIFIER, staff, false];
            if (char === "[") {
                staff.flags.chord = true;
                return [STATE.NOTE, staff, true];
            }
            if (isNote.test(char)) {
                const note = "JYKULMONPHWICXDSEFRGTAQBcxdsefrgtaqbjykulmonphwi".indexOf(char);
                if (note !== -1) staff.notes.push(note - 12);
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            }
            return [STATE.NOTE, staff, true]; // default: ignore other chars
        },
        NOTE_DESCRIPTOR: (char, staff) => {
            if (char === "#") {
                if (staff.notes.length) staff.notes[staff.notes.length - 1] += 1;
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            } 
            if (typeof numberish(char) === "number") {
                if (staff.notes.length) {
                    let note = Math.posmod(staff.notes[staff.notes.length - 1], staff.global.EDO);
                    staff.notes[staff.notes.length - 1] = note + (staff.global.EDO * (Number(char) - 4)); // c4 default
                }
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            }
            if (isModifier.test(char) || char === "|" || char === "?" || char === "[") return [STATE.MODIFIER, staff, false];
            if (isNote.test(char)) return [staff.flags.chord ? STATE.NOTE : STATE.MODIFIER, staff, false];
            return [STATE.NOTE_DESCRIPTOR, staff, true]; // default: ignore other chars
        },
        MODIFIER: (char, staff) => {
            if (char === "|" || char === "?" || isNote.test(char)) { // submit notes
                staff = addBeat(staff);
                staff.modifier.currentBeat = staff.modifier.totalBeat;
                staff.modifier.totalBeat = 0; // done for lastmodifier purposes
                let duration = (15 / staff.global.BPM) * staff.modifier.currentBeat / GLOBAL_SPEEDUP; // ms
                if (typeof numberish(duration.toString()) !== "number") {
                    _reply("invalid song (0 bpm?)");
                    return [1, ""];
                }
                for (let note of staff.notes) { // add notes
                    let pitch = (note * staff.global.EDO / 12) + ((staff.global.octave + staff.modifier.octave) * 12);
                    song.push(`${staff.instrument};${staff.second};${duration};${pitch};${staff.modifier.removeAttack ? "t" : "f"};${staff.modifier.removeRelease ? "t" : "f"}`);
                }
                if (staff.modifier.advanceStaff) staff.second += duration;
                staff.lastModifier = staff.modifier;
                staff.modifier = defaultModifier();
                staff.notes = [];
                staff.flags.chord = false;
                staff.flags.subtractBeats = false;
            }
            if (char === "|") {
                staff.instrument = "";
                staff.second = 0;
                staff.lastGlobal = staff.global;
                staff.global = defaultGlobalModifier();
                return [STATE.INSTRUMENT, staff, true];
            }
            if (char === "?") {
                staff.lastGlobal = staff.global;
                staff.global = defaultGlobalModifier();
                return [STATE.GLOBAL_MODIFIER, staff, true];
            }
            if (isNote.test(char)) return [STATE.NOTE, staff, false];
            if (isModifier.test(char)) {
                switch (char) {
                    case "'": staff.modifier.octave += 2; break;
                    case "\"": staff.modifier.octave += 1; break;
                    case ",": staff.modifier.octave -= 2; break;
                    case "-": staff.modifier.currentBeat *= 2; break;
                    case "=": staff.modifier.currentBeat *= 3; break;
                    case ";": staff.modifier.currentBeat /= 2; break;
                    case ":": staff.modifier.currentBeat /= 3; break;
                    case "@": staff.modifier.currentBeat = takeAdditionalNumber() ?? 1; break;
                    case "+": case "~": staff = addBeat(staff, false); break;
                    case "_": staff = addBeat(staff, true); break;
                    case "<": staff.modifier.removeAttack = true; break;
                    case ">": staff.modifier.removeRelease = true; break;
                    case "!": staff.modifier.advanceStaff = false; break;
                    case "&": staff.modifier = staff.lastModifier; break;
                }
                return [STATE.MODIFIER, staff, true];
            }
            return [STATE.MODIFIER, staff, true]; // default: ignore other chars
        },
        SONG_NAME: (char, staff) => {
            if (/[\w_]/.test(char)) {
                staff.instrument += char;
                return [STATE.SONG_NAME, staff, true];
            }
            if (char === "|") {
                fname = staff.instrument;
                staff.instrument = "";
                return [STATE.INSTRUMENT, staff, true];
            }
            return [STATE.SONG_NAME, staff, true];
        }
    };
    function takeAdditionalNumber() {
        const num = remaining.slice(char.length).match(isNumber)?.[0] ?? "";
        char += num;
        return num === "" ? null : Number(num);
    }
    function addBeat(staff, sub = false) {
        if (staff.flags.subtractBeats) staff.modifier.totalBeat -= staff.modifier.currentBeat;
        else staff.modifier.totalBeat += staff.modifier.currentBeat;
        staff.modifier.currentBeat = 1;
        staff.flags.subtractBeats = sub;
        return staff;
    }
    // main loop
    let expecting = STATE.INSTRUMENT;
    while (remaining.length) {
        char = remaining.match(isNumber)?.[0] ?? remaining[0];
        // log("processing note: ", char, Object.keys(STATE).find(x => STATE[x] === expecting), staff);
        let [next, _staff, consume] = expecting(char, staff);
        staff = _staff;
        if (consume) remaining = remaining.slice(char.length);
        expecting = next;
    }
    if (!song.length) { _reply("song is empty"); return [1, ""]; }
    song = song.join("\n");
    log("Song Generated", fname);
    fs.writeFileSync(path("src/@main/data/song", fname + ".wmid"), song);
    log("Redeeming:", "song", x, y, fname + ".wmid", fname);
    _reply(`saved as ${fname}.wmid`);
    send("gizmo", "song", x, y, fname + ".wmid", fname);
    return [0, fname + ".wmid"];
}

// funny compression
const MAIN = "[0123456789ABCDEFGHIJKLMNabcdefghijklmnXSRTQYUOPWxsrtqyuopw/@-=";
const MAIN_BITS = Math.log2(MAIN.length + 1);
const SURROGATE = "?'\".,;:]+_<>!&%";
const SURROGATE_BITS = Math.log2(SURROGATE.length + 1);
const END_BITS = 15;

function decompress(str) {
    let idx = str.indexOf("$");
    while (idx !== -1) {
        let end = str.indexOf("|", idx);
        if (end === -1) end = str.length;
        str = str.slice(0, idx) + _decompress(str.slice(idx + 1, end)) + str.slice(end);
        idx = str.indexOf("$");
    }
    return str;
}
function _decompress(str) {
    let ret = deidn(str).split("").map(x => x.codePointAt(0));
    for (let i = 0; i < ret.length; i += 2) { let temp = ret[i]; ret[i] = ret[i+1]; ret[i+1] = temp; }
    let ret2 = [];
    for (let i = 0; i < ret.length; i++) for (let j = 0; j < 8; j++) ret2.push((ret[i] & (1 << j)) ? 1 : 0);
    for (let i = Math.demod(ret2.length, 16) - 16; i >= 0; i -= 16) ret2.splice(i + END_BITS, 16 - END_BITS);
    let i = 0;
    let ret3 = "";
    while (i + MAIN_BITS < ret2.length) {
        let c = unbits(ret2.slice(i, i + MAIN_BITS))[0];
        if (c !== MAIN.length) {
            ret3 += MAIN[c];
            i += MAIN_BITS;
        } else {
            ret3 += SURROGATE[unbits(ret2.slice(i + MAIN_BITS, i + MAIN_BITS + SURROGATE_BITS))[0]];
            i += MAIN_BITS + SURROGATE_BITS;
        }
    }
    return ret3;
}