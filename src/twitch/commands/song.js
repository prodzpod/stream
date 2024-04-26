const fs = require('fs');
const path = require('path');
const { takeWord, WASD } = require('../../@main/util_client');
const { send, log, warn, error } = require('../include');
const { getSocketsServer } = require('../../@main/include');
module.exports.condition = '!song'
module.exports.permission = true
module.exports.execute = async (args, user, data, message) => {
    let remaining = takeWord(message)[1] + "|`";
    let fname = `_${user}_${new Date().getTime()}`;
    let song = [];
    // get things
    const isNote = /[A-Na-nXSRTQYUOPWxsrtqyuopw\[\?\/]/;
    const isModifier = /[\#\'\"\,\-\=\;\:\+\~\_\@\d\<\>\!\&]/;
    const isGlobalModifier = /[\'\"\,\-\=\;\:\%\.\&]/;
    const defaultGlobalModifier = {
        BPM: 75,
        octave: -1,
        EDO: 12
    };
    const defaultModifier = {
        totalBeat: 0,
        beats: 1,
        octave: 0,
        head: true,
        feet: true,
        nostaff: false
    };
    // 
    let staff = 0, state = "instrument", instrument = "", global = {...defaultGlobalModifier}, lastGlobal = {...defaultGlobalModifier};
    let char = ""; let chords = false; let minus = false; let notes = []; let modifier = {...defaultModifier}; let lastModifier = {...defaultModifier};
    while (eatChar()) {
        switch (state) {
            case "instrument":
                if (char == "|" || /\d/.test(char)) { // default bells syntax; give default instrument and read as notes
                    if (char == "|") {
                        lastGlobal = global;
                        global = {...defaultGlobalModifier};
                        state = "notes";
                    } else state = "globalmodifier";
                    remaining = instrument + char + remaining;
                    instrument = "sine"; // default instrument
                } else if (isGlobalModifier.test(char)) { // instrument name over
                    remaining = char + remaining;
                    instrument = instrument.replace(/[^\w]/g, "");
                    state = "globalmodifier";
                } else instrument += char;
                break;
            case "globalmodifier":
                switch (char) {
                    case "'":
                        global.octave += 2;
                        break;
                    case "\"":
                        global.octave += 1;
                        break;
                    case ",":
                        global.octave -= 2;
                        break;
                    case "-":
                        global.BPM *= 2;
                        break;
                    case "=":
                        global.BPM *= 3;
                        break;
                    case ";":
                        global.BPM /= 2;
                        break;
                    case ":":
                        global.BPM /= 3;
                        break;
                    case "%":
                        global.EDO = eatNumber() ? Number(char) : 12;
                        log("is this being called:", char);
                        break;
                    case "&":
                        global = {...lastGlobal};
                        break;
                    default:
                        remaining = char + remaining;
                        if (eatNumber()) global.BPM = Number(char);
                        state = "notes";
                        break;
                }
                break;
            case "notes":
                if (char == "[") {
                    chords = true;
                } else if (char == "|" || char == "?" || isModifier.test(char)) {
                    remaining = char += remaining;
                    state = "modifier";
                } else {
                    let note = 'JYKULMONPHWICXDSEFRGTAQBcxdsefrgtaqbjykulmonphwi'.indexOf(char);
                    if (note != -1) {
                        notes.push(note - 12);
                        if (!chords) state = "modifier";
                    } else if (char == "/" && !chords) state = "modifier";
                }
                break;
            case "modifier":
                switch (char) {
                    case "#":
                        modifier.octave += 1 / global.EDO;
                        break;
                    case "'":
                        modifier.octave += 2;
                        break;
                    case "\"":
                        modifier.octave += 1;
                        break;
                    case ",":
                        modifier.octave -= 2;
                        break;
                    case "-":
                        modifier.beats *= 2;
                        break;
                    case "=":
                        modifier.beats *= 3;
                        break;
                    case ";":
                        modifier.beats /= 2;
                        break;
                    case ":":
                        modifier.beats /= 3;
                        break;
                    case "@":
                        modifier.beats = eatNumber() ? Number(char) : 1;
                        break;
                    case "+":
                    case "~":
                        modifier.totalBeat = minus ? modifier.totalBeat - modifier.beats : modifier.totalBeat + modifier.beats;
                        modifier.beats = 1;
                        minus = false;
                        break;
                    case "_":
                        modifier.totalBeat = minus ? modifier.totalBeat - modifier.beats : modifier.totalBeat + modifier.beats;
                        modifier.beats = 1;
                        minus = true;
                        break;
                    case "<":
                        modifier.head = false;
                        break;
                    case ">":
                        modifier.feet = false;
                        break;
                    case "!":
                        modifier.nostaff = true;
                        break;
                    case "&":
                        modifier = {...lastModifier};
                        break;
                    default:
                        if (isNote.test(char) || char == "|" || char == "?") {
                            modifier.totalBeat = minus ? modifier.totalBeat - modifier.beats : modifier.totalBeat + modifier.beats;
                            let duration = (15 / global.BPM) * modifier.totalBeat; // ms
                            log(notes, staff, duration, modifier);
                            for (let note of notes) { // add notes
                                let pitch = (note * global.EDO / 12) + ((global.octave + modifier.octave) * 12);
                                song.push(`${instrument};${staff};${duration};${pitch};${!modifier.head ? "t" : "f"};${!modifier.feet ? "t" : "f"}`);
                            }
                            notes = [];
                            if (!modifier.nostaff) staff += duration;
                            if (char == "|") {
                                staff = 0;
                                lastGlobal = global;
                                global = {...defaultGlobalModifier};
                                lastModifier = {...defaultModifier};
                                modifier = {...defaultModifier};
                                instrument = "";
                                state = "instrument";
                            } else if (char == "?") {
                                lastGlobal = global;
                                global = {...defaultGlobalModifier};
                                state = "globalmodifier";
                            } else if (isNote.test(char)) {
                                remaining = char + remaining;
                                lastModifier = modifier;
                                modifier = {...defaultModifier};
                                state = "notes"
                            }
                        }
                        else if (eatNumber()) modifier.octave = Number(char - 4) + (modifier.octave % 1);
                        break;
                }
                break;
        }
    }

    function eatChar(reset = true) {
        if (reset) char = "";
        char += remaining[0];
        remaining = remaining.slice(1);
        return remaining.length;
    }

    function eatNumber() {
        char = remaining.match(/^\d+/)?.[0] ?? "";
        remaining = remaining.slice(char.length);
        return char != "";
    }
    if (!song.length) {
        send("song is empty", user, data);
        return 1;
    }
    song = song.join('\n');
    // song = `sine;0;0.5;0\nsine;0.5;0.5;2\nsine;1;0.5;0\nsine;1;0.5;4`;
    // save song
    log("Song Generated", fname);
    fs.writeFileSync(path.join(__dirname, '../../@main/data/song', fname + ".wmid"), song);
    // send song (disable when making transpiler !!)
    getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'song', user, fname));
    return 0;
}