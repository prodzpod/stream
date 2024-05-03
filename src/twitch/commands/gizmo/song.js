const fs = require('fs');
const path = require('path');
const { takeWord, WASD, isNullOrWhitespace, Math } = require('../../../@main/util_client');
const { send, log, warn, error } = require('../../include');
const { getSocketsServer } = require('../../../@main/include');
const { listFiles } = require('../../../@main/util_server');
module.exports.condition = '!song'
module.exports.permission = true
module.exports.execute = async (args, user, data, message) => {
    if ((await listFiles(__dirname, '../../../@main/data/song')).includes(args[1] + ".wmid")) {
        getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'song', args[1] + ".wmid", args[1]));
        return;
    }
    const isNumber = /^\d*\.\d+|^\d+/; // sorry scientific notationbros but No
    const isNote = /[A-Na-nXSRTQYUOPWxsrtqyuopw\[\?\/]/;
    const isModifier = /[\'\"\,\-\=\;\:\+\~\_\@\<\>\!\&\]]/;
    const isGlobalModifier = /[\'\"\,\-\=\;\:\%\.\&]/;
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
    let remaining = takeWord(message)[1] + "|";
    let fname = `_${user}_${new Date().getTime()}`;
    let song = [];
    let char = "";
    let staff = defaultStaff();
    // state
    const STATE = {
        INSTRUMENT: (char, staff) => {
            if (isGlobalModifier.test(char)) { // newsong: globalmodifier begin
                // if (isNullOrWhitespace(staff.instrument)) staff.instrument = "sine";
                staff.instrument = staff.instrument.replace(/[^\w]/g, "");
                return [STATE.GLOBAL_MODIFIER, staff, false];
            }
            if (char == "|" || !Number.isNaN(Number(char))) { // default bells syntax;
                remaining = staff.instrument + remaining;
                staff.instrument = "sine";
                return [STATE.NOTE, staff, false];
            } 
            staff.instrument += char;
            return [STATE.INSTRUMENT, staff, true];
        },
        GLOBAL_MODIFIER: (char, staff) => {
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
                if (!Number.isNaN(Number(char))) staff.global.BPM = Number(char.slice(1));
                return [STATE.GLOBAL_MODIFIER, staff, true];
            }
            if (!Number.isNaN(Number(char))) { // bpm
                staff.global.BPM = Number(char);
                return [STATE.GLOBAL_MODIFIER, staff, true];
            }
            if (isNullOrWhitespace(staff.instrument) && /[A-Za-z_]/.test(char)) return [STATE.SONG_NAME, staff, false];
            if (isNote.test(char)) return [STATE.NOTE, staff, false];
            return [STATE.GLOBAL_MODIFIER, staff, true]; // default: ignore other chars
        },
        NOTE: (char, staff) => {
            if (isModifier.test(char) || char == "|" || char == "?") return [STATE.MODIFIER, staff, false];
            if (char == "[") {
                staff.flags.chord = true;
                return [STATE.NOTE, staff, true];
            }
            if (isNote.test(char)) {
                let note = 'JYKULMONPHWICXDSEFRGTAQBcxdsefrgtaqbjykulmonphwi'.indexOf(char);
                if (note !== -1) staff.notes.push(note - 12);
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            }
            return [STATE.NOTE, staff, true]; // default: ignore other chars
        },
        NOTE_DESCRIPTOR: (char, staff) => {
            if (char == "#") {
                if (staff.notes.length) staff.notes[staff.notes.length - 1] += 1;
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            } 
            if (!Number.isNaN(Number(char))) {
                if (staff.notes.length) {
                    let note = Math.posmod(staff.notes[staff.notes.length - 1], staff.global.EDO);
                    staff.notes[staff.notes.length - 1] = note + (staff.global.EDO * (Number(char) - 4)); // c4 default
                }
                return [STATE.NOTE_DESCRIPTOR, staff, true];
            }
            if (isModifier.test(char) || char == "|" || char == "?" || char == "[") return [STATE.MODIFIER, staff, false];
            if (isNote.test(char)) return [staff.flags.chord ? STATE.NOTE : STATE.MODIFIER, staff, false];
            return [STATE.NOTE_DESCRIPTOR, staff, true]; // default: ignore other chars
        },
        MODIFIER: (char, staff) => {
            if (char == "|" || char == "?" || isNote.test(char)) { // submit notes
                if (staff.flags.subtractBeats) staff.modifier.totalBeat -= staff.modifier.currentBeat;
                else staff.modifier.totalBeat += staff.modifier.currentBeat;
                let duration = (15 / staff.global.BPM) * staff.modifier.totalBeat; // ms
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
            if (char == "|") {
                staff.instrument = "";
                staff.second = 0;
                staff.lastGlobal = staff.global;
                staff.global = defaultGlobalModifier();
                return [STATE.INSTRUMENT, staff, true];
            }
            if (char == "?") {
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
                    case "+":
                    case "~":
                        if (staff.flags.subtractBeats) staff.modifier.totalBeat -= staff.modifier.currentBeat;
                        else staff.modifier.totalBeat += staff.modifier.currentBeat;
                        staff.modifier.currentBeat = 1;
                        staff.flags.subtractBeats = false;
                        break;
                    case "_":
                        if (staff.flags.subtractBeats) staff.modifier.totalBeat -= staff.modifier.currentBeat;
                        else staff.modifier.totalBeat += staff.modifier.currentBeat;
                        staff.modifier.currentBeat = 1;
                        staff.flags.subtractBeats = true;
                        break;
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
            if (char == "|") {
                fname = staff.instrument;
                staff.instrument = "";
                return [STATE.INSTRUMENT, staff, true];
            }
            return [STATE.SONG_NAME, staff, true];
        }
    };
    function takeAdditionalNumber() {
        let num = remaining.slice(char.length).match(isNumber)?.[0] ?? "";
        char += num;
        return num == "" ? null : Number(num);
    }
    // main loop
    let expecting = STATE.INSTRUMENT;
    while (remaining.length) {
        char = remaining.match(isNumber)?.[0] ?? remaining[0];
        // log("processing note: ", char, Object.keys(STATE).find(x => STATE[x] == expecting), staff);
        let [next, _staff, consume] = expecting(char, staff);
        staff = _staff;
        if (consume) remaining = remaining.slice(char.length);
        expecting = next;
    }
    if (!song.length) {
        send("song is empty", user, data);
        return 1;
    }
    song = song.join('\n');
    log("Song Generated", fname);
    fs.writeFileSync(path.join(__dirname, '../../../@main/data/song', fname + ".wmid"), song);
    getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'song', fname + ".wmid", fname));
    return 0;
}