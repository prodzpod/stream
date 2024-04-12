// general
module.exports.INFORMATION = "prod's all in one client toolkit, automatically exported from @main/util_client to be able to be used from both sides. see github for more details"
module.exports.isNullish = x => {
    if (!x) return true;
    if (typeof x === 'string') x = this.unstringify(x);
    if (typeof x === 'object') {
        if (Array.isArray(x)) return !x.length;
        return !Object.keys(x).length;
    }
    return !x;
}
module.exports.delay = (ms=100) => new Promise(resolve => setTimeout(resolve, ms));
module.exports.rand = (a, b) => {
    switch (typeof a) {
        case 'undefined':
            return Math.random();
        case 'number':
            let min = 0, max = a;
            if (b !== undefined) { min = a; max = b; }
            return Math.random() * (max - min) + min;
        case 'string':
            a = a.split('');
        case 'object':
            if (Array.isArray(a)) return a[Math.floor(Math.random() * a.length)];
            let r = Math.random() * this.Math.sum(Object.values(a));
            for (let k in a) { if (r < a[k]) return k; r -= a[k]; }
            return Object.keys(a)[0];
    }
}
// number
module.exports.Math = {
    lerp: (a, b, t) => (b - a) * t + a,
    clamp: (x, a, b) => Math.min(Math.max(x, Math.min(a, b)), Math.max(a, b)),
    between: (a, b, c) => Math.min(a, c) <= b && b <= Math.max(a, c),
    div: (n, a) => Math.trunc(n / a),
    demod: (n, a) => n - (n % a),
    posmod: (n, a) => ((n % a) + a) % a,
    prec: (n, a=6) => Math.round(n * Math.pow(10, a)) / Math.pow(10, a),
    approxeq: (a, b, t=10) => this.prec(a, t) === this.prec(b, t),
    vectorToArray: a => { if (typeof a !== 'object' || Array.isArray(a)) return a; let ret = []; for (let k of ['x', 'X', 'y', 'Y', 'z', 'Z', 'w', 'W']) if (a[k] !== undefined) ret.push(a[k]); return ret; },
    arrayToVector: a => { if (a?.x !== undefined) return a; let ret = {}; const keys = ['x', 'y', 'z', 'w']; for (let i = 0; i < keys.length; i++) if (a[i] !== undefined) ret[k[i]] = a[i]; return ret; },
    dot: (a, b) => { a = this.vectorToArray(a); b = this.vectorToArray(b); let ret = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) ret += a[i] * b[i]; return ret; },
    cross: (a, b) => { let isVector = a?.x !== undefined; a = this.vectorToArray(a); b = this.vectorToArray(b); let ret = [(a[1] * b[2] - a[2] * b[1]), (a[2] * b[0] - a[0] * b[2]), (a[0] * b[1] - a[1] * b[0])]; if (isVector) ret = this.arrayToVector(ret); return ret; },
    hypot: (a, b) => { a = this.vectorToArray(a); b = this.vectorToArray(b); let ret = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) ret += Math.abs((a[i] * a[i]) - (b[i] * b[i])); return ret; },
    dist: (a, b) => Math.sqrt(this.hypot(a, b)),
    operateVectors: (a, b, fn) => { 
        if (typeof a === 'number' && typeof b === 'number') return fn(a, b);
        let isVector = a?.x !== undefined; 
        a = this.vectorToArray(a); b = this.vectorToArray(b); 
        if (typeof a === 'number') a = b.map(_ => a); // create equal length vector
        if (typeof b === 'number') b = a.map(_ => b);
        let ret = []; for (let i = 0; i < Math.min(a.length, b.length); i++) ret.push(fn(a[i], b[i])); 
        if (isVector) ret = this.arrayToVector(ret); return ret; 
    },
    addVectors: (a, b) => operateVectors(a, b, (_a, _b) => _a + _b),
    subtractVectors: (a, b) => operateVectors(a, b, (_a, _b) => _a - _b),
    timesVectors: (a, b) => operateVectors(a, b, (_a, _b) => _a * _b),
    divideVectors: (a, b) => operateVectors(a, b, (_a, _b) => _a / _b),
    sum: (...a) => { if (Array.isArray(a[0])) a = a[0]; return a.reduce((x, y) => x + y, 0); }
}
module.exports.pointInLine = (p, a, b) => {
    if (a.x === b.x) return p.x === a.x;
    if (a.y === b.y) return p.y === a.y;
    return ((p.x - a.x) / (b.x - a.x)) === ((p.y - a.y) / (b.y - a.y));
}
module.exports.pointInSegment = (p, a, b) => {
    return this.pointInLine(p, a, b) && ((a.x <= p.x && p.x <= b.x) || (a.x >= p.x && p.x >= b.x)) && ((a.y <= p.y && p.y <= b.y) || (a.y >= p.y && p.y >= b.y));
}
module.exports.pointToLine = (p0, p1, p2) => { // three Pair
    return Math.abs(((p2.x - p1.x) * (p1.y - p0.y)) - ((p1.x - p0.x) * (p2.y - p1.y))) / Math.sqrt(((p2.x - p1.x) * (p2.x - p1.x)) + ((p2.y - p1.y) * (p2.y - p1.y)));
}
module.exports.pointToSegment = (p, a, b) => {
    if (this.Math.dot(this.Math.subtractVectors(b, a), this.Math.subtractVectors(p, b)) >= 0) return this.Math.dist(p, b);
    else if (this.Math.dot(this.Math.subtractVectors(b, a), this.Math.subtractVectors(p, a)) <= 0) return this.Math.dist(p, a);
    else return this.pointToLine(p, a, b);
}
// string
module.exports.String = {
    toProperCase: function (_this) { return _this.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()) },
    hashCode: function (_this) { let hash = 0, i, chr; if (_this.length === 0) return hash; for (i = 0; i < 32; i++) { chr = _this.charCodeAt(i % _this.length); hash = ((hash << 5) - hash) + chr; hash |= 0; } return hash; }
}
module.exports.isNullOrWhitespace = str => !(str && str.trim?.().length);
module.exports.WASD = {
    pack: (...words) => {
        return words.map(x => {
            x = x?.toString().trim() ?? '';
            if (x == "") return '""';
            if (/\s/.test(x) || x.startsWith('"')) 
                return `"${x.replaceAll('"', '""')}"`;
            else return x;
        }).join(" ");
    },
    unpack: (str) => {
        if (typeof str !== 'string') str = str.toString();
        let ret = [];
        let newWord = true;
        let currentWord = null;
        let parseQuoted = false;
        for (let i = 0; i < str.length; i++) {
            let c = str[i];
            if (newWord) {
                if (/\s/.test(c)) continue; 
                newWord = false;
                parseQuoted = (c == '"');
                currentWord = parseQuoted ? "" : c;
            } else if (parseQuoted) {
                if (c == '"') {
                    if (i + 1 < str.length && str[i + 1] == '"') {
                        currentWord += c;
                        i++;
                    } else {
                        ret.push(currentWord);
                        newWord = true;
                        currentWord = null;
                    }
                } else currentWord += c;
            } else {
                if (/\s/.test(c)) {
                    ret.push(currentWord);
                    newWord = true;
                    currentWord = null;
                } else currentWord += c;
            }
        }
        if (currentWord !== null) ret.push(currentWord);
        return ret;
    }
}
module.exports.takeWord = (raw, len=2) => {
    let ret = [];
    let str = String(raw).trim();
    for (let i = 0; i < len - 1; i++) {
        let idx = str.search(/\s/);
        if (idx === -1) {
            ret.push(str);
            str = '';
        }
        else {
            ret.push(str.slice(0, idx));
            str = str.slice(idx + 1).trim();
        }
    }
    ret.push(str.trim());
    return ret;
}
module.exports.unstringify = str => {
    if (typeof str !== 'string') return str;
    str = str.trim();
    switch (str.toLowerCase()) {
        case '':
        case 'null':
            return null;
        case 'undefined':
            return undefined;
        case 'nan':
            return NaN;
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            if (str[0] == '{' || str[0] == '[') try { return JSON.parse(str); } catch (_) { return str; }
            if (!Number.isNaN(Number(str))) return Number(str);
            return str;
    }
}
module.exports.encodeQuery = query => {
    if (this.isNullish(query)) return '';
    c = [];
    for (q of Object.entries(query)) {
        if (q[1] === null || q[1] === undefined) continue
        c.push(encodeURIComponent(String(q[0])) + "=" + encodeURIComponent(String(q[1])));
    }
    return c.join("&");
}
module.exports.matchStrings = re => new RegExp(re.source.replace(/%STR/g, /(?:"(?:\\\\|\\\"|[^\"])*")|(?:'(?:\\\\|\\\'|[^\'])*')/.source), re.flags);
// collection
module.exports.remove = (arr, ...thing) => arr.filter(x => !thing.includes(x));
module.exports.unique = arr => { let found = []; for (let i = 0; i < arr.length; i++) if (!found.includes(arr[i])) found.push(arr[i]); return found; };
module.exports.transpose = arr => { if (typeof arr !== object) return arr;
    if (Array.isArray(arr)) {
        let ret = []; 
        for (let i in arr) for (let o of arr[i]) { 
            ret[o] ??= []; 
            ret[o].push(Number(i)); 
        } 
        return ret; 
    } else {
        let ret = {};
        for (let k in arr) ret[arr[k]] = k;
        return ret;
    }
};
module.exports.intersect = (a, b) => a.filter(k => b.includes(k));
module.exports.intersects = (a, b) => { if (a.length == 0 && b.length == 0) return false; if (a.length == 1) return b.includes(a[0]); if (b.length == 1) return a.includes(b[0]); return a.reduce((k, p) => { return k || b.includes(p);}, false); }
module.exports.safeAssign = (a, b) => {
    if (typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) return Object.assign(a, b);
    return b;
}
module.exports.unentry = kvpair => {
    let ret = {};
    for (let kv of kvpair) ret[kv[0]] = kv[1];
    return ret;
}
module.exports.traverse = (o, k) => {
    if (typeof k === 'string') k = k.replace(/\[(\d+)\]/g, '.$1').split(/[\/\\\.]/g).map(x => Number.isNaN(x) ? x : Number(x));
    let target = o;
    for (let i = 0; i < k.length - 1; i++) {
        target[k[i]] ??= {};
        target = target[k[i]];
    }
    return [target, k[k.length - 1]];
}
module.exports.superstringify = o => {
    //! DO NOT USE THIS ON USER INPUT !! its basically eval lol
    if (typeof o !== 'object') return o + '';
    let funcs = [], ret;
    if (Array.isArray(o)) ret = JSON.stringify(o.map(x => { if (this.isFunction(x)) { funcs.push(x + ''); return `%%%REPLACEME-${funcs.length - 1}%%%`; } return x; }));
    else ret = JSON.stringify(this.unentry(Object.entries(o).map(kv => { if (this.isFunction(kv[1])) { funcs.push(kv[1] + ''); return [kv[0], `%%%REPLACEME-${funcs.length - 1}%%%`]; } return kv; })));
    for (let i = 0; i < funcs.length; i++) ret = ret.replace(`"%%%REPLACEME-${i}%%%"`, funcs[i]);
    return ret;
}
module.exports.superparse = o => {
    //! DO NOT USE THIS ON USER INPUT !! its basically eval lol
    if (this.isFunction(o)) return (new Function(`return ${o}`))();
    o = JSON.parse(o);
    if (typeof o !== 'object') return o;
    if (Array.isArray(o)) return o.map(x => this.isFunction(x) ? (new Function(`return ${x}`))() : x);
    return this.unentry(Object.entries(o).map(kv => this.isFunction(kv[1]) ? [kv[0], (new Function(`return ${kv[1]}`))()] : kv));
}
module.exports.isFunction = o => {
    //! DO NOT USE THIS ON USER INPUT !! its basically eval lol
    try {
        if ((new Function(`return ${o}`))() instanceof Function) return true;
        return false; } catch { return false; }
}
// date
module.exports.toJSDate = (num) => {
    if (typeof(num) == 'string') {
        if (Number.isNaN(num)) num = new Date(num);
        else num = Number(num);
    }
    if (typeof(num) == 'number') num = new Date(num);
    return `${String(num.getFullYear()).padStart(4, '0')}-${String(num.getMonth()+1).padStart(2, '0')}-${String(num.getDate()).padStart(2, '0')}`
}
// color
module.exports.Color = {
    NAMES: {'aliceblue ': 'F0F8FFFF', 'antiquewhite ': 'FAEBD7FF', 'aqua ': '00FFFFFF', 'aquamarine ': '7FFFD4FF', 'azure ': 'F0FFFFFF', 'beige ': 'F5F5DCFF', 'bisque ': 'FFE4C4FF', 'black ': '000000FF', 'blanchedalmond ': 'FFEBCDFF', 'blue ': '0000FFFF', 'blueviolet ': '8A2BE2FF', 'brown ': 'A52A2AFF', 'burlywood ': 'DEB887FF', 'cadetblue ': '5F9EA0FF', 'chartreuse ': '7FFF00FF', 'chocolate ': 'D2691EFF', 'coral ': 'FF7F50FF', 'cornflowerblue ': '6495EDFF', 'cornsilk ': 'FFF8DCFF', 'crimson ': 'DC143CFF', 'cyan ': '00FFFFFF', 'darkblue ': '00008BFF', 'darkcyan ': '008B8BFF', 'darkgoldenrod ': 'B8860BFF', 'darkgray ': 'A9A9A9FF', 'darkgreen ': '006400FF', 'darkgrey ': 'A9A9A9FF', 'darkkhaki ': 'BDB76BFF', 'darkmagenta ': '8B008BFF', 'darkolivegreen ': '556B2FFF', 'darkorange ': 'FF8C00FF', 'darkorchid ': '9932CCFF', 'darkred ': '8B0000FF', 'darksalmon ': 'E9967AFF', 'darkseagreen ': '8FBC8FFF', 'darkslateblue ': '483D8BFF', 'darkslategray ': '2F4F4FFF', 'darkslategrey ': '2F4F4FFF', 'darkturquoise ': '00CED1FF', 'darkviolet ': '9400D3FF', 'deeppink ': 'FF1493FF', 'deepskyblue ': '00BFFFFF', 'dimgray ': '696969FF', 'dimgrey ': '696969FF', 'dodgerblue ': '1E90FFFF', 'firebrick ': 'B22222FF', 'floralwhite ': 'FFFAF0FF', 'forestgreen ': '228B22FF', 'fuchsia ': 'FF00FFFF', 'gainsboro ': 'DCDCDCFF', 'ghostwhite ': 'F8F8FFFF', 'gold ': 'FFD700FF', 'goldenrod ': 'DAA520FF', 'gray ': '808080FF', 'green ': '008000FF', 'greenyellow ': 'ADFF2FFF', 'grey ': '808080FF', 'honeydew ': 'F0FFF0FF', 'hotpink ': 'FF69B4FF', 'indianred ': 'CD5C5CFF', 'indigo ': '4B0082FF', 'ivory ': 'FFFFF0FF', 'khaki ': 'F0E68CFF', 'lavender ': 'E6E6FAFF', 'lavenderblush ': 'FFF0F5FF', 'lawngreen ': '7CFC00FF', 'lemonchiffon ': 'FFFACDFF', 'lightblue ': 'ADD8E6FF', 'lightcoral ': 'F08080FF', 'lightcyan ': 'E0FFFFFF', 'lightgoldenrodyellow ': 'FAFAD2FF', 'lightgray ': 'D3D3D3FF', 'lightgreen ': '90EE90FF', 'lightgrey ': 'D3D3D3FF', 'lightpink ': 'FFB6C1FF', 'lightsalmon ': 'FFA07AFF', 'lightseagreen ': '20B2AAFF', 'lightskyblue ': '87CEFAFF', 'lightslategray ': '778899FF', 'lightslategrey ': '778899FF', 'lightsteelblue ': 'B0C4DEFF', 'lightyellow ': 'FFFFE0FF', 'lime ': '00FF00FF', 'limegreen ': '32CD32FF', 'linen ': 'FAF0E6FF', 'magenta ': 'FF00FFFF', 'maroon ': '800000FF', 'mediumaquamarine ': '66CDAAFF', 'mediumblue ': '0000CDFF', 'mediumorchid ': 'BA55D3FF', 'mediumpurple ': '9370DBFF', 'mediumseagreen ': '3CB371FF', 'mediumslateblue ': '7B68EEFF', 'mediumspringgreen ': '00FA9AFF', 'mediumturquoise ': '48D1CCFF', 'mediumvioletred ': 'C71585FF', 'midnightblue ': '191970FF', 'mintcream ': 'F5FFFAFF', 'mistyrose ': 'FFE4E1FF', 'moccasin ': 'FFE4B5FF', 'navajowhite ': 'FFDEADFF', 'navy ': '000080FF', 'oldlace ': 'FDF5E6FF', 'olive ': '808000FF', 'olivedrab ': '6B8E23FF', 'orange ': 'FFA500FF', 'orangered ': 'FF4500FF', 'orchid ': 'DA70D6FF', 'palegoldenrod ': 'EEE8AAFF', 'palegreen ': '98FB98FF', 'paleturquoise ': 'AFEEEEFF', 'palevioletred ': 'DB7093FF', 'papayawhip ': 'FFEFD5FF', 'peachpuff ': 'FFDAB9FF', 'peru ': 'CD853FFF', 'pink ': 'FFC0CBFF', 'plum ': 'DDA0DDFF', 'powderblue ': 'B0E0E6FF', 'purple ': '800080FF', 'rebeccapurple ': '663399FF', 'red ': 'FF0000FF', 'rosybrown ': 'BC8F8FFF', 'royalblue ': '4169E1FF', 'saddlebrown ': '8B4513FF', 'salmon ': 'FA8072FF', 'sandybrown ': 'F4A460FF', 'seagreen ': '2E8B57FF', 'seashell ': 'FFF5EEFF', 'sienna ': 'A0522DFF', 'silver ': 'C0C0C0FF', 'skyblue ': '87CEEBFF', 'slateblue ': '6A5ACDFF', 'slategray ': '708090FF', 'slategrey ': '708090FF', 'snow ': 'FFFAFAFF', 'springgreen ': '00FF7FFF', 'steelblue ': '4682B4FF', 'tan ': 'D2B48CFF', 'teal ': '008080FF', 'thistle ': 'D8BFD8FF', 'tomato ': 'FF6347FF', 'turquoise ': '40E0D0FF', 'transparent': 'FF00FF00', 'none': 'FF00FF00', 'violet ': 'EE82EEFF', 'wheat ': 'F5DEB3FF', 'white ': 'FFFFFFFF', 'whitesmoke ': 'F5F5F5FF', 'yellow ': 'FFFF00FF', 'yellowgreen ': '9ACD32FF'},
    from: (o, g, b, a) => {
        if (g !== undefined) {
            o = [o, g, b];
            if (a !== undefined) o.push(a);
        }
        switch (typeof o) {
            case 'number':
                if (Number.isNaN(o)) o = '';
                else if (o < 0) o = 'FF00FF00';
                else o = o.toString(16); // passthrough to string
            case 'string':
                let name = this.NAMES[o.toLowerCase().trim()];
                if (name) o = name;
                else {
                    o = o.toUpperCase().replace(/[^0-9A-F]+/g, '');
                    switch (o.length) {
                        case 0: o = 'FF00FF00'; break; // magenta transparent because it's what's used for monogame model as well
                        case 1: o = o.repeat(6) + 'FF'; break;
                        case 2: o = o.repeat(3) + 'FF'; break;
                        case 3: o = o[0].repeat(2) + o[1].repeat(2) + o[2].repeat(2) + 'FF'; break;
                        case 4: o = o[0].repeat(2) + o[1].repeat(2) + o[2].repeat(2) + o[3].repeat(2); break;
                        case 5: o = '0' + o + 'FF'; break;
                        case 6: o = o + 'FF'; break;
                        case 7: o = '0' + o; break;
                        case 8: break;
                        default: o = o.slice(0, 8); break;
                    } 
                }
                o = [parseInt(o.slice(0, 2), 16), parseInt(o.slice(2, 4), 16), parseInt(o.slice(4, 6), 16), parseInt(o.slice(6, 8), 16)]
                break;
            case 'object':
                if (!Array.isArray(o)) {
                    let ret = [], ks = [
                        ['r', 'R', 'x', 'X', 'red', 'Red', 'RED'],
                        ['g', 'G', 'y', 'Y', 'green', 'Green', 'GREEN'],
                        ['b', 'B', 'z', 'Z', 'blue', 'Blue', 'BLUE'],
                        ['a', 'A', 'w', 'W', 'alpha', 'Alpha', 'ALPHA', 'transparency', 'Transparency', 'TRANSPARENCY', 'transp', 'Transp', 'TRANSP', 'trans', 'Trans', 'TRANS', 'opacity', 'Opacity', 'OPACITY']
                    ];
                    for (let i in ks) for (let k of ks[i]) if (o[k]) ret[i] = o[k];
                    o = ret;
                }
                o[0] ??= 0; o[1] ??= 0; o[2] ??= 0; o[3] ??= 255;
                o = o.map(parseInt);
                break;
        }
        return ((o[0] << 24) | (o[1] << 16) | (o[2] << 8) | o[3]) >>> 0;
    },
    toHex: color => '#' + color.toString(16).padStart(8, '0'),
    toArray: color => [(color & 0xFF000000) >>> 24, (color & 0x00FF0000) >>> 16, (color & 0x0000FF00) >>> 8, (color & 0x000000FF) >>> 0],
    toVector: color => {return {x: (color & 0xFF000000) >>> 24, y: (color & 0x00FF0000) >>> 16, z: (color & 0x0000FF00) >>> 8, w: (color & 0x000000FF) >>> 0}},
    fromHSV: (h, s, v, a=1) => {
        let r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            let temp = []
            if (Array.isArray(h)) temp = [...h];
            else {
                let ks = [
                    ['h', 'H', 'x', 'X', 'hue', 'Hue', 'HUE'],
                    ['s', 'S', 'y', 'Y', 'sat', 'Sat', 'SAT', 'saturation', 'Saturation', 'SATURATION'],
                    ['v', 'V', 'z', 'Z', 'val', 'Val', 'VAL', 'value', 'Value', 'VALUE'],
                    ['a', 'A', 'w', 'W', 'alpha', 'Alpha', 'ALPHA', 'transparency', 'Transparency', 'TRANSPARENCY', 'transp', 'Transp', 'TRANSP', 'trans', 'Trans', 'TRANS', 'opacity', 'Opacity', 'OPACITY']
                ];
                for (let i in ks) for (let k of ks[i]) if (h[k]) temp[i] = h[k];
            }
            if (temp[0]) h = temp[0];
            if (temp[1]) s = temp[1];
            if (temp[2]) v = temp[2];
            if (temp[3]) a = temp[3];
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return this.from(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), Math.round(a * 255));
    },
    toHSV: color => {
        let [r, g, b, a] = this.toArray(color);
        let max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;
    
        switch (max) {
            case min: h = 0; break;
            case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
            case g: h = (b - r) + d * 2; h /= 6 * d; break;
            case b: h = (r - g) + d * 4; h /= 6 * d; break;
        }
        return [h, s, v, a / 255];
    },
    fromHSL: (h, s, l, a=1) => {
        if (arguments.length === 1) {
            let temp = []
            if (Array.isArray(h)) temp = [...h];
            else {
                let ks = [
                    ['h', 'H', 'x', 'X', 'hue', 'Hue', 'HUE'],
                    ['s', 'S', 'y', 'Y', 'sat', 'Sat', 'SAT', 'saturation', 'Saturation', 'SATURATION'],
                    ['l', 'L', 'z', 'Z', 'lig', 'Lig', 'LIG', 'light', 'Light', 'LIGHT', 'lightness', 'Lightness', 'LIGHTNESS'],
                    ['a', 'A', 'w', 'W', 'alpha', 'Alpha', 'ALPHA', 'transparency', 'Transparency', 'TRANSPARENCY', 'transp', 'Transp', 'TRANSP', 'trans', 'Trans', 'TRANS', 'opacity', 'Opacity', 'OPACITY']
                ];
                for (let i in ks) for (let k of ks[i]) if (h[k]) temp[i] = h[k];
            }
            if (temp[0]) h = temp[0];
            if (temp[1]) s = temp[1];
            if (temp[2]) v = temp[2];
            if (temp[3]) a = temp[3];
        }
        let _s, _v;
        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        _v = (l + s) / 2;
        _s = (2 * s) / (l + s);
        return this.fromHSV(h, _s, _v, a);
    },
    toHSL: color => {
        let [h, s, v, a] = this.toHSV(color);
        let _s = s * v, l = (2 - s) * v;
        _s /= (l <= 1) ? l : 2 - l; l /= 2;
        return [h, _s, l, a];
    }
};
// crypto / compression
module.exports.randomHex = n => { let ret = ""; for (let i = 0; i < n; i++) ret += Math.floor(Math.random() * 16).toString(16).toLowerCase(); return ret; }
module.exports.ID_ADJECTIVE = ["acceptable", "accidental", "activate", "adamant", "alexa play", "alien", "among", "anime", "arcane", "ascended", "atomic", "awesome", "baba is", "baby", "bat", "big", "blazing", "blue", "boneless", "box", "buff", "chain", "chants of", "chill", "clear", "clown", "cold", "complex", "cooked", "cool", "copper", "corporate", "cracking the", "crazy", "crypt of the", "cryptic", "cute", "dawn of", "day", "dead", "deep", "diamond", "diary of a wimpy", "digital", "do the", "do the", "download", "dragon", "dumb", "dungeons and", "e", "electric", "eleventh", "environmentally friendly", "epic", "evil", "fake", "farming", "fe", "fifth", "fire", "first", "fishing", "flexible", "flying", "font of", "forth", "fourth", "freaky", "free", "fried", "fruit", "gnu", "gooning", "green", "grow", "heroes of the", "hollow", "holy", "horse", "hot", "how to", "http", "huge", "im at", "infinite", "insane", "internet", "iron", "island of", "je ne", "john", "jump", "kinning", "last", "legend of", "libre", "lil'", "live", "losing", "loud", "magic", "majjekal", "make some", "marvel", "mediocre", "meh", "metaphor for", "mighty morphin", "mine", "mister", "mithril", "mixed", "musical", "mythical", "negative", "nerf", "netherite", "nice", "node", "odd", "ok google define", "old", "online", "open", "open world", "order by", "pet", "piece of", "pirate", "play", "pocket", "poor", "positive", "potion of", "proud", "quiet", "quirky", "radical", "raw", "react", "reader x", "read", "real", "red", "regular", "rich", "risk of", "rogue", "rune", "second", "settlers of", "sharkboy and", "short", "shovel", "sick", "simple", "skill", "slug", "smart", "sonic", "space", "speed", "star", "steel", "stop seeing start", "straw", "strong", "summer", "super", "sussy", "tall", "test", "that", "the archives of", "there might be", "thinky", "third", "thirty dollar", "this", "this is", "tin", "tiny", "transcendental", "tricky", "twelveth", "twenty one", "typing", "uncut", "undertime", "unreal", "vampire", "vampire", "virtual", "warm", "weak", "weird", "what is", "when is", "where is", "who is", "why is", "wiccan", "winning", "winter", "wired", "wit", "x", "yellow", "you", "you are on", "young", "yume", "yung", "zombie", "zooted"];
module.exports.ID_NOUN = ["-factor", "-inator", "-man", ".assetbundle", ".bat", ".dll", ".el", ".exe", ".gd", ".html", ".js", ".json", ".lua", ".py", ".rs", ".sh", ".tar.gz", ".xnb", "age", "andy", "apple", "armor", "aspect", "avenue", "bakka", "balatro", "banban", "barrel roll", "battle advanced", "beats", "beee", "bender", "bird", "blow", "blue", "boston", "boxy boo", "boy", "broadcast", "browser", "cake", "castle", "cat", "celeste", "chair", "chamber", "cheese", "chicken", "church", "circus", "citizen", "club to the club go go to the club", "coffee", "combination pizza hut and taco bell", "cooking", "cord", "couple", "craft", "creation", "crew", "crossbow", "crossword", "crystals", "dance", "death", "dew", "dimension", "domain", "donkey", "dot", "duck", "eagle", "egg", "era", "escapade", "farms", "field", "fish", "fluttershy", "fly", "fog", "force", "forge", "games", "gang", "gear", "gems", "girl", "goose", "gpt", "green", "gun", "haiku", "haircut", "hard", "heart", "heaven", "hell", "hexagon", "hoe", "homestuck", "house", "huggy wuggy", "hunter", "in minecraft", "income tax", "in 4k", "insight", "internet", "irl", "is coming", "issue", "item", "joel", "juris prudence", "kickflip", "knight", "knowledge", "l", "language", "line", "linelith", "linux", "looking", "lore", "mail", "male", "man", "man", "man", "man", "man", "man", "man", "man", "man", "man", "mana", "metal", "minigame", "mmorpg", "mode", "money", "monster", "mouse", "necrodancer", "neopets", "news", "ngl", "nikki", "noise", "noita", "of fire and ice", "of the dead", "ong", "overdose", "palace", "paper", "party", "peace", "pet", "pickaxe", "pie", "pig", "plane", "plant", "plate", "playing", "pod", "portal", "prod", "puzzle", "rain", "realm", "red", "rise", "rn", "rock", "rod", "roguelike", "running", "sais quoi", "salad", "sauce", "scimitar", "scissor", "serpent", "session", "skin", "slopper", "solstice", "soup", "source", "speed", "staff", "storm", "street", "style", "sudoku", "survivor", "sus", "swimming", "sword", "symbolism", "taiji", "taxes", "tbf", "tbh", "tea", "tentacles", "the elements", "thing", "this", "thoughts", "time", "tissue", "tuber", "universe", "update", "us", "voices", "wagon", "wand", "war", "werewolf", "windows", "wisdom", "witness", "woman", "wordle", "words", "world", "worm", "wyvern", "yahtzee", "yellow", "zpod"];
module.exports.getIdentifier = () => {
    let number = Math.floor(this.rand(100));
    let adj = this.rand(this.ID_ADJECTIVE);
    let noun = this.rand(this.ID_NOUN);
    let isBack = Math.random() < 0.5;
    let txt = adj + (/^[A-Z0-9]$/i.test(noun[0]) ? ' ' : '') + noun;
    if (isBack) txt = txt + ' ' + number.toString();
    else txt = number.toString() + ' ' + txt;
    return txt;
}
module.exports.btow = str => btoa(str).replace(/\+/g, '.').replace(/\//g, '-').replace(/\=/g, '_');
module.exports.wtob = str => atob(str.replace(/\./g, '+').replace(/\-/g, '/').replace(/\_/g, '='));
module.exports.utoa = str => btoa(Array.from(new TextEncoder().encode(str), x => String.fromCodePoint(x)).join(''));
module.exports.atou = str => new TextDecoder().decode(Uint8Array.from(atob(str), x => x.codePointAt(0)));
module.exports.utow = str => this.btow(Array.from(new TextEncoder().encode(str), x => String.fromCodePoint(x)).join(''));
module.exports.wtou = str => new TextDecoder().decode(Uint8Array.from(this.wtob(str), x => x.codePointAt(0)));
module.exports.RLE_KEYSTR = " 123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-0";
module.exports.runLength = str => {
    let res = "", cur = '', rep = 0;
    str += '!'; // terminate
    for (let i = 0; i < str.length; i++) {
        if (rep == 64) {
            res += '~0' + cur;
            rep = 0;
        }
        if (cur != str[i]) {
            if (rep > 3) {
                res += '~' + this.RLE_KEYSTR[rep] + cur;
            } else res += cur.repeat(rep);
            cur = str[i];
            rep = 1;
        } else rep++;
    }
    return res;
}
module.exports.derunLength = str => {
    let res = ""
    for (let i = 0; i < str.length; i++) {
        if (str[i] == '~') {
            res += str[i + 2].repeat(this.RLE_KEYSTR.indexOf(str[i + 1]));
            i += 2;
        } else res += str[i];
    }
    return res;
}
module.exports.runLengthV2 = str => {
    let res = "";
    let cur = '';
    let rep = 0;
    str += '!'; // terminate
    //* STAGE 1: SINGLE LETTER RLE
    for (let i = 0; i < str.length; i++) {
        if (rep == 64) {
            res += '~~0' + cur;
            rep = 0;
        }
        if (cur != str[i]) {
            if (rep > 4) {
                res += '~~' + this.RLE_KEYSTR[rep] + cur;
            } else res += cur.repeat(rep);
            cur = str[i];
            rep = 1;
        } else rep++;
    }
    //* STAGE 2: 4 LETTER RLE
    str = res;
    res = "";
    cur = '';
    rep = 0;
    str += '!!!!'; // terminate
    for (let i = 0; i < str.length - 3;) {
        if (rep == 64) {
            res += '~0' + cur;
            rep = 0;
        }
        if (rep) {
            if (cur == str.slice(i, i + 4)) {
                rep++;
                i += 4;
            } else {
                res += '~' + this.RLE_KEYSTR[rep] + cur
                cur = '';
                rep = 0;
            }
        } else {
            if (str.slice(i, i + 4) == str.slice(i + 4, i + 8)) {
                cur = str.slice(i, i + 4)
                rep = 1;
                i += 4;
            } else {
                res += str[i];
                i++;
            }
        }
    }
    res = res.replace(/\!+/g, '');
    return res;
}
module.exports.derunLengthV2 = str => {
    let res = ""
    for (let i = 0; i < str.length; i++) {
        if (str.slice(i, i + 2) == '~~') {
            res += '~~';
            i++;
        } else if (str[i] == '~') {
            res += str.slice(i + 2, i + 6).repeat(this.RLE_KEYSTR.indexOf(str[i + 1]));
            i += 5;
        } else res += str[i];
    }
    str = res;
    res = "";
    for (let i = 0; i < str.length; i++) {
        if (str.slice(i, i + 2) == '~~') {
            res += str[i + 3].repeat(this.RLE_KEYSTR.indexOf(str[i + 2]));
            i += 3;
        } else res += str[i];
    }
    return res;
}
module.exports.IDN_KEYSTR = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzゝぁあぃいぅうぇえぉおゕかきくゖけこさしすせそたちっつてとなにぬねのはひふへほまみむめもゃやゅゆょよらりるれろゎわゐゑをんヽァアィイゥウェエォオヵカキㇰクヶケコサㇱシㇲスセソタチッツテㇳトナニㇴヌネノㇵハㇶヒㇷフㇸヘㇹホマミㇺムメモャヤュユョヨㇻラㇼリㇽルㇾレㇿロヮワヰヱヲンㄅㆠㄆㆴㄇㄈㄪㄉㄊㆵㄋㄌㄍㆣㄎㆶㄫㆭㄏㆷㄐㆢㄑㄒㄬㄓㄔㄕㄖㄗㆡㄘㄙㄚㆩㄛㆧㆦㄜㄝㆤㆥㄞㆮㄟㄠㆯㄡㄢㄣㄤㆲㄥㆰㆱㆬㄦㄧㆪㆳㄨㆫㆨㄩæɓƃƈđɖɗƌðǝəɛƒǥɠɣƣƕħıɨɩƙłƚɲƞŋœøɔɵȣƥʀʃŧƭʈɯʊʋƴƶȥʒƹȝþƿƨƽƅʔɐɑɒʙƀɕʣʥʤɘɚɜɝɞʚɤʩɡɢʛʜɦɧɪʝɟʄʞʪʫʟɫɬɭɮƛʎɱɴɳɶɷɸʠĸɹɺɻɼɽɾɿʁʂƪʅʆʨƾʦʧƫʇʉɥɰʌʍʏƍʐʑƺʓƻʕʡʢʖǀǁǂǃʗʘʬʭαβγδεϝϛζηθικλμνξοπϟϙρστυφχψωϡϳϗаәӕбвгґғҕдԁђԃҙеєжҗзԅѕӡԇиҋіјкқӄҡҟҝлӆљԉмӎнӊңӈҥњԋоөпҧҁрҏсԍҫтԏҭћуүұѹфхҳһѡѿѽѻцҵчҷӌҹҽҿџшщъыьҍѣэюяѥѧѫѩѭѯѱѳѵҩӀ҃҄҅҆֊ᐁᐂᐃᐄᐅᐆᐇᐈᐉᐊᐋᐌᐍᐎᐏᐐᐑᐒᐓᐔᐕᐖᐗᐘᐙᐚᐛᐜᐝᐞᐟᐠᐡᐢᐣᐤᐥᐦᐧᐨᐩᐪᐫᐬᐭᐮᐯᐰᐱᐲᐳᐴᐵᐶᐷᐸᐹᐺᐻᐼᐽᐾᐿᑀᑁᑂᑃᑄᑅᑆᑇᑈᑉᑊᑋᑌᑍᑎᑏᑐᑑᑒᑓᑔᑕᑖᑗᑘᑙᑚᑛᑜᑝᑞᑟᑠᑡᑢᑣᑤᑥᑦᑧᑨᑩᑪᑫᑬᑭᑮᑯᑰᑱᑲᑳᑴᑵᑶᑷᑸᑹᑺᑻᑼᑽᑾᑿᒀᒁᒂᒃᒄᒅᒆᒇᒈᒉᒊᒋᒌᒍᒎᒏᒐᒑᒒᒓᒔᒕᒖᒗᒘᒙᒚᒛᒜᒝᒞᒟᒠᒡᒢᒣᒤᒥᒦᒧᒨᒩᒪᒫᒬᒭᒮᒯᒰᒱᒲᒳᒴᒵᒶᒷᒸᒹᒺᒻᒼᒽᒾᒿᓀᓁᓂᓃᓄᓅᓆᓇᓈᓉᓊᓋᓌᓍᓎᓏᓐᓑᓒᓓᓔᓕᓖᓗᓘᓙᓚᓛᓜᓝᓞᓟᓠᓡᓢᓣᓤᓥᓦᓧᓨᓩᓪᓫᓬᓭᓮᓯᓰᓱᓲᓳᓴᓵᓶᓷᓸᓹᓺᓻᓼᓽᓾᓿᔀᔁᔂᔃᔄᔅᔆᔇᔈᔉᔊᔋᔌᔍᔎᔏᔐᔑᔒᔓᔔᔕᔖᔗᔘᔙᔚᔛᔜᔝᔞᔟᔠᔡᔢᔣᔤᔥᔦᔧᔨᔩᔪᔫᔬᔭᔮᔯᔰᔱᔲᔳᔴᔵᔶᔷᔸᔹᔺᔻᔼᔽᔾᔿᕀᕁᕂᕃᕄᕅᕆᕇᕈᕉᕊᕋᕌᕍᕎᕏᕐᕑᕒᕓᕔᕕᕖᕗᕘᕙᕚᕛᕜᕝᕞᕟᕠᕡᕢᕣᕤᕥᕦᕧᕨᕩᕪᕫᕬᕭᕮᕯᕰᕱᕲᕳᕴᕵᕶᕷᕸᕹᕺᕻᕽᙯᕾᕿᖀᖁᖂᖃᖄᖅᖆᖇᖈᖉᖊᖋᖌᖍᙰᖎᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖗᖘᖙᖚᖛᖜᖝᖞᖟᖠᖡᖢᖣᖤᖥᖦᕼᖧᖨᖩᖪᖫᖬᖭᖮᖯᖰᖱᖲᖳᖴᖵᖶᖷᖸᖹᖺᖻᖼᖽᖾᖿᗀᗁᗂᗃᗄᗅᗆᗇᗈᗉᗊᗋᗌᗍᗎᗏᗐᗑᗒᗓᗔᗕᗖᗗᗘᗙᗚᗛᗜᗝᗞᗟᗠᗡᗢᗣᗤᗥᗦᗧᗨᗩᗪᗫᗬᗭᗮᗯᗰᗱᗲᗳᗴᗵᗶᗷᗸᗹᗺᗻᗼᗽᗾᗿᘀᘁᘂᘃᘄᘅᘆᘇᘈᘉᘊᘋᘌᘍᘎᘏᘐᘑᘒᘓᘔᘕᘖᘗᘘᘙᘚᘛᘜᘝᘞᘟᘠᘡᘢᘣᘤᘥᘦᘧᘨᘩᘪᘫᘬᘭᘮᘯᘰᘱᘲᘳᘴᘵᘶᘷᘸᘹᘺᘻᘼᘽᘾᘿᙀᙁᙂᙃᙄᙅᙆᙇᙈᙉᙊᙋᙌᙍᙎᙏᙐᙑᙒᙓᙔᙕᙖᙗᙘᙙᙚᙛᙜᙝᙞᙟᙠᙡᙢᙣᙤᙥᙦᙧᙨᙩᙪᙫᙬᚁᚂᚃᚄᚅᚆᚇᚈᚉᚊᚋᚌᚍᚎᚏᚐᚑᚒᚓᚔᚕᚖᚗᚘᚙᚚᚠᚡᚢᚤᚥᚦᚧᛰᚨᚩᚬᚭᚮᚯᚰᚱᚲᚳᚴᚵᚶᚷᚹᛩᚺᚻᚼᚽᚾᚿᛀᛁᛂᛃᛄᛅᛆᛮᛇᛈᛕᛉᛊᛋᛪᛌᛍᛎᛏᛐᛑᛒᛓᛔᛖᛗᛘᛙᛯᛚᛛᛜᛝᛞᛟᚪᚫᚣᛠᛣᚸᛤᛡᛢᛥᛦᛧᛨ᠐᠑᠒᠓᠔᠕᠖᠗᠘᠙ᢀᢁᢂᢃᢄᢅᢆᡃᠠᢇᠡᡄᡝᠢᡅᡞᡳᢈᡟᠣᡆᠤᡇᡡᠥᡈᠦᡉᡠᠧᠨᠩᡊᡢᢊᢛᠪᡋᠫᡌᡦᠬᡍᠭᡎᡤᢚᡥᠮᡏᠯᠰᠱᡧᢜᢝᢢᢤᢥᠲᡐᡨᠳᡑᡩᠴᡒᡱᡜᢋᠵᡓᡪᡷᠶᡕᡲᠷᡵᠸᡖᠹᡫᡶᠺᡗᡣᡴᢉᠻᠼᡔᡮᠽᡯᡘᡬᠾᡙᡭᠿᡀᡁᡂᡚᡛᡰᢌᢞᢍᢎᢟᢏᢐᢘᢠᢑᢡᢒᢓᢨᢔᢣᢕᢙᢖᢗᢦᢧᢩաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆՙ፩፪፫፬፭፮፯፰፱ሀሁሂሃሄህሆለሉሊላሌልሎሏሐሑሒሓሔሕሖሗመሙሚማሜምሞሟሠሡሢሣሤሥሦሧረሩሪራሬርሮሯሰሱሲሳሴስሶሷሸሹሺሻሼሽሾሿቀቁቂቃቄቅቆቈቊቋቌቍቐቑቒቓቔቕቖቘቚቛቜቝበቡቢባቤብቦቧቨቩቪቫቬቭቮቯተቱቲታቴትቶቷቸቹቺቻቼችቾቿኀኁኂኃኄኅኆኈኊኋኌኍነኑኒናኔንኖኗኘኙኚኛኜኝኞኟአኡኢኣኤእኦኧከኩኪካኬክኮኰኲኳኴኵኸኹኺኻኼኽኾዀዂዃዄዅወዉዊዋዌውዎዐዑዒዓዔዕዖዘዙዚዛዜዝዞዟዠዡዢዣዤዥዦዧየዩዪያዬይዮደዱዲዳዴድዶዷዸዹዺዻዼዽዾዿጀጁጂጃጄጅጆጇገጉጊጋጌግጎጐጒጓጔጕጘጙጚጛጜጝጞጠጡጢጣጤጥጦጧጨጩጪጫጬጭጮጯጰጱጲጳጴጵጶጷጸጹጺጻጼጽጾጿፀፁፂፃፄፅፆፈፉፊፋፌፍፎፏፐፑፒፓፔፕፖፗፘፙፚᎠᎡᎢᎣᎤᎥᎦᎧᎨᎩᎪᎫᎬᎭᎮᎯᎰᎱᎲᎳᎴᎵᎶᎷᎸᎹᎺᎻᎼᎽᎾᎿᏀᏁᏂᏃᏄᏅᏆᏇᏈᏉᏊᏋᏌᏍᏎᏏᏐᏑᏒᏓᏔᏕᏖᏗᏘᏙᏚᏛᏜᏝᏞᏟᏠᏡᏢᏣᏤᏥᏦᏧᏨᏩᏪᏫᏬᏭᏮᏯᏰᏱᏲᏳᏴ𐌀𐌁𐌂𐌃𐌄𐌅𐌆𐌇𐌈𐌉𐌊𐌋𐌌𐌍𐌎𐌏𐌐𐌑𐌒𐌓𐌔𐌕𐌖𐌗𐌘𐌙𐌚𐌛𐌜𐌝𐌞𐌰𐌱𐌲𐌳𐌴𐌵𐌶𐌷𐌸𐌹𐌺𐌻𐌼𐌽𐌾𐌿𐍀𐍁𐍂𐍃𐍄𐍅𐍆𐍇𐍈𐍉𐍊";
module.exports.idn = o => {
    let req = [];
    switch (typeof o) {
        case 'number':
            while (o >= 0x10000) { req.push(o & 0xFFFF); o = Math.trunc(o / 0x10000); } // doing this to preserve big number
            req.push(o);
            req.reverse();
            break;
        case 'bigint':
            while (o >= 0x10000) { req.push(Number(o & 0xFFFFn)); o >>= 16n; } // already big number :)
            req.push(Number(o));
            req.reverse();
            break;
        case 'object':
            req = o.map(o => Number(o));
            if (req.some(x => x === NaN)) req = o.map(o => Number(o, 16));
            break;
        case 'string':
            let ret = "";
            for (let i = 0; i < o.length; i += 2) { ret += idnChar((Number.isNaN(o.charCodeAt(i)) ? 0 : o.charCodeAt(i) << 8) + (Number.isNaN(o.charCodeAt(i + 1)) ? 0 : o.charCodeAt(i + 1))); }
            return ret;
    }
    return req.map(this.idnChar).join('');
}
module.exports.deidn = str => {
    let ret = "";
    for (let i = 0; i < str.length; i++) {
        let temp = deidn(str[i], str[i + 1]);
        if (temp[1]) i++;
        ret += String.fromCharCode(((temp[0] & 0xFF00) >>> 8), temp[0] & 0xFF);
    }
    return ret;
}
module.exports.idnChar = x => {
    if (x < this.IDN_KEYSTR.length) return this.IDN_KEYSTR[x];
    x -= this.IDN_KEYSTR.length;
    if (x <= 0x2BA3) return String.fromCodePoint(0xAC00 + x); // Hangul Syllable
    x -= 0x2BA4;
    if (x <= 0x19B5) return String.fromCodePoint(0x3400 + x); // CJK Extension A
    x -= 0x19B6;
    if (x <= 0x5145) return String.fromCodePoint(0x4E00 + x); // CJK Ideograph
    x -= 0x5146;
    if (x <= 0x048C) return String.fromCodePoint(0xA000 + x); // Yi Letters
    x -= 0x048D;
    if (x <= 0xA6D6) return String.fromCodePoint(0x20000 + x); // CJK Extension B+
    throw Error('x is over 0xFFFF; WTF?');
}
module.exports.deidnChar = (x, next) => {
    let c = x.charCodeAt(0);
    let isSurrogate = (0xD800 <= c && c <= 0xDFFF);
    if (isSurrogate) c = 0x10000 + ((x.charCodeAt(0) - 0xD800) * 0x400) + (next.charCodeAt(0) - 0xDC00);
    let ret = this.IDN_KEYSTR.length;
    if (0xAC00 <= c && c <= 0xD7A3) return [ret + c - 0xAC00, isSurrogate];
    ret += 0x2BA4;
    if (0x3400 <= c && c <= 0x4DB5) return [ret + c - 0x3400, isSurrogate];
    ret += 0x19B6;
    if (0x4E00 <= c && c <= 0x9F45) return [ret + c - 0x4E00, isSurrogate];
    ret += 0x5146;
    if (0xA000 <= c && c <= 0xA48C) return [ret + c - 0xA000, isSurrogate];
    ret += 0x048D;
    if (0x20000 <= c && c <= 0x2A6D6) return [ret + c - 0x20000, isSurrogate];
    return [this.IDN_KEYSTR.indexOf(x), isSurrogate];
}
module.exports.md5 = inputString => { // epic stackoverflow copypaste GO
    let hc="0123456789abcdef";
    function rh(n) {let j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {let l=(x&0xFFFF)+(y&0xFFFF);let m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        let i;let nblk=((x.length+8)>>6)+1;let blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    let i,x=sb(""+inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}