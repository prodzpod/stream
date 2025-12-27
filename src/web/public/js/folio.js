let PORTFOLIO, TAG_DESCRIPTION;
let gl, program, sprites = [], _buffers = [];
let WIDTH, HEIGHT, TEX_WIDTH, TEX_HEIGHT;
const TEX_TILE = [16, 16];
let engineLoaded = false;
addEvent("onload", async () => {
    e("tex").src = "//prod.kr/images/folio.png";
    await new Promise(resolve=>{ e("tex").onload = resolve });
    PORTFOLIO = WASD.unpack(await (await fetch("//prod.kr/data/portfolio.wasd")).text())[0];
    TAG_DESCRIPTION = WASD.unpack(await (await fetch("//prod.kr/data/tags.wasd")).text())[0];
    const c = e("main");
    WIDTH = c.width; HEIGHT = c.height;
    TEX_WIDTH = e("tex").width / TEX_TILE[0]; TEX_HEIGHT = e("tex").height / TEX_TILE[1];
    setCSS("tex-width", TEX_WIDTH + "px"); setCSS("tex-height", TEX_HEIGHT + "px");
    gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    if (!gl) location.href = "//prod.kr/folio";
    const VERTEX_SHADER = createShader(gl, `
        attribute vec4 a_position;
        attribute vec2 a_midpoint;
        attribute vec2 a_sprite;
        attribute float a_darkness;
        attribute float a_size;
        varying vec2 v_position;
        varying float v_darkness;
        void main() {
            gl_Position = a_position;
            v_position = (a_sprite + vec2(0.5, 0.5)) / vec2(16, 16) + vec2((a_position.x - a_midpoint.x) / a_size / 8.0, -(a_position.y - a_midpoint.y) / a_size / 5.25);
            v_darkness = a_darkness;
        }
    `, "VERTEX_SHADER");
    const FRAGMENT_SHADER = createShader(gl, `
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_position;
        varying float v_darkness;
        void main() {
            gl_FragColor = texture2D(u_texture, v_position) * vec4(v_darkness, v_darkness, v_darkness, v_darkness);
        }
    `, "FRAGMENT_SHADER");
    program = gl.createProgram();
    gl.attachShader(program, VERTEX_SHADER);
    gl.attachShader(program, FRAGMENT_SHADER);
    gl.linkProgram(program);
    let tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, e("tex"));
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.useProgram(program);
    _buffers[0] = addBuffer(gl, "a_position", 2);
    _buffers[1] = addBuffer(gl, "a_midpoint", 2);
    _buffers[2] = addBuffer(gl, "a_sprite", 2);
    _buffers[3] = addBuffer(gl, "a_darkness", 1);
    _buffers[4] = addBuffer(gl, "a_size", 1);
    sprites = [];
    for (let y = TEX_TILE[1] - 1; y >= 0; y--) for (let x = TEX_TILE[0] - 1; x >= 0; x--)
        sprites.push({pos: [-WIDTH, -HEIGHT], sprite: [x, y], size: 0.25, darkness: 1});
    engineInit();
    engineLoaded = true;
    move(random(1024));
    update();
});

function update() {
    let buffers = [[], [], [], [], []];
    for (let sprite of sprites) {
        let l = ((sprite.pos[0] - (TEX_WIDTH * sprite.size)) / (WIDTH / 2)) - 1,
            u = (((HEIGHT - sprite.pos[1]) - (TEX_HEIGHT * sprite.size)) / (HEIGHT / 2)) - 1,
            r = ((sprite.pos[0] + (TEX_WIDTH * sprite.size)) / (WIDTH / 2)) - 1,
            d = (((HEIGHT - sprite.pos[1]) + (TEX_HEIGHT * sprite.size)) / (HEIGHT / 2)) - 1;
        let midx = sprite.pos[0] / (WIDTH / 2) - 1,
            midy = (HEIGHT - sprite.pos[1]) / (HEIGHT / 2) - 1;
        buffers[0].push(l, u, r, u, l, d, r, u, l, d, r, d);
        buffers[1].push(midx, midy, midx, midy, midx, midy, midx, midy, midx, midy, midx, midy);
        buffers[2].push(...sprite.sprite, ...sprite.sprite, ...sprite.sprite, ...sprite.sprite, ...sprite.sprite, ...sprite.sprite);
        buffers[3].push(sprite.darkness, sprite.darkness, sprite.darkness, sprite.darkness, sprite.darkness, sprite.darkness);
        buffers[4].push(sprite.size, sprite.size, sprite.size, sprite.size, sprite.size, sprite.size);
    } 
    buffers = buffers.map(x => new Float32Array(x));
    _buffers.map((x, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, x);
        gl.bufferData(gl.ARRAY_BUFFER, buffers[i], gl.STATIC_DRAW);
    });
    gl.drawArrays(gl.TRIANGLES, 0, buffers[4].length);
}

function createShader(gl, source, type) {
    const shader = gl.createShader(gl[type]);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(type, gl.getShaderInfoLog(shader));
    return shader;
}

function addBuffer(gl, name, number) {
    const INDEX = gl.getAttribLocation(program, name);
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(INDEX, number, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(INDEX);
    return vbo;
}

let lastPosition = null;
let hovered = -1;
let clicked = false;
addEvent("onpointermove", (event) => {
    if (!engineLoaded) return;
    let bbox = e("main").getBoundingClientRect()
    let position = [(event.clientX - bbox.x) / bbox.width * WIDTH, (event.clientY - bbox.y) / bbox.height * HEIGHT];
    if (lastPosition) move(Math.dist(lastPosition[0] - position[0], lastPosition[1] - position[1]));
    lastPosition = position;
    if (clicked) return;
    let _hovered = -1;
    for (let i = sprites.length - 1; i >= 0; i--) {
        const sprite = sprites[i];
        if (sprite.pos[0] === -WIDTH || sprite.darkness >= 1) continue;
        let l = sprite.pos[0] - (TEX_WIDTH  * sprite.size),
            u = sprite.pos[1] - (TEX_HEIGHT * sprite.size),
            r = sprite.pos[0] + (TEX_WIDTH  * sprite.size),
            d = sprite.pos[1] + (TEX_HEIGHT * sprite.size);
        if (Math.between(l, position[0], r) && Math.between(u, position[1], d)) {
            _hovered = i;
            break;
        }
    }
    updateHover(_hovered);
});
addEvent("onpointerup", (event) => {
    lastPosition = null;
});
addEvent("onclick", (event) => {
    if (!engineLoaded) return;
    if (clicked) { updateClick(-1); return; }
    if (hovered === -1) return;
    updateClick(hovered);
    updateHover(-1);
});
addEvent("onresize", (event) => {
    if (!currentData || postfade) return;
    recalculateSizes();
});

let tick = 0;
function move(distance) {
    tick += distance * distance / 40;
    engineUpdate();
    update();
}

function debugSpawn() {
    // sprites.push({pos: [-WIDTH, -HEIGHT], sprite: [random(0, 4), random(-0.5, 0.5)], size: 0.25, darkness: 1});
}

let slopeLUT = {};
let circles = {};
function circle(start = 0, end = sprites.length, cx = WIDTH/2, cy = HEIGHT/2, xscale = TEX_WIDTH, yscale = TEX_HEIGHT, angle = 0, size = 0.1, speed = 1, circleColor = "white") {
    if (angle < 0 || angle >= 360) angle = Math.posmod(angle, 360);
    if (angle >= 90) { circle(start, end, cx, cy, yscale, xscale, angle - 90, size, speed, circleColor); return }
    if (xscale === 0 || yscale === 0) return;
    if (!circles[start]) {
        insertElement("ellipse", "underlay")
            .with("stroke", circleColor).with("stroke-width", 20).with("fill", "transparent")
            .with("cx", cx).with("cy", cy).with("rx", xscale).with("ry", yscale)
            .with("style", `transform: rotate(${angle}deg); transform-origin: ${cx}px ${cy}px;`)
            .with("index", start);
        resetUnderlay();
    }
    let temp = sprites.length - end; end = sprites.length - start; start = temp;
    for (let i = start; i < end; i++) {
        let tx = xscale * Math.cos((tick * speed) + (Math.PI * 2 / (end - start) * i));
        let ty = yscale * Math.sin((tick * speed) + (Math.PI * 2 / (end - start) * i));
        let r = Math.hypot(tx, ty);
        let theta = Math.atan2(ty, tx) + (angle / 180 * Math.PI);
        sprites[i].pos[0] = cx + r * Math.cos(theta);
        sprites[i].pos[1] = cy + r * Math.sin(theta);
        const slope = slopeLUT[xscale/yscale + "," + angle] ?? getSlope(xscale/yscale, angle);
        function getSlope(slope, angle) {
            function dtan(x) { return Math.tan(x / 180 * Math.PI); }
            let gx = Math.sqrt((1+Math.pow(dtan(-angle), 2))/((1/slope/slope)+(Math.pow(dtan(-angle), 2))));
            let gy = Math.sqrt((1+Math.pow(dtan(-90-angle), 2))/((1/slope/slope)+(Math.pow(dtan(-90-angle), 2))));
            function slopedness(x) { return Math.sqrt(Math.abs((1 / (1 + Math.exp(-x/2)) - 0.5) * 2)); }
            let xslopedness = slopedness((gx - gy) / gx);
            let yslopedness = slopedness((gy - gx) / gy);
            let ret = [Math.max(xslopedness, yslopedness), xslopedness > yslopedness];
            slopeLUT[slope + "," + angle] = ret;
            return ret;
        }
        let osc = (Math.cos(theta + (slope[1] ? 0 : Math.PI / 2)));
        sprites[i].size = Math.clamp(0.2 * (1 + size * -osc), 0, 1);
        sprites[i].darkness = 1 - (Math.lerp(0, 1, osc / 2 + 0.5) * (1 - Math.lerp(0.2, 0, size * 2)));
        // if (i === sprites.length - 9) console.log(size, sprites[i].size, sprites[i].darkness);
    }
}
function resetUnderlay() {
    e("underlay").innerHTML += " "; // RESET SVG;
    for (let el of q("#underlay ellipse")) circles[el.getAttribute("index")] = el;
}

function engineInit() {
    // nothing for now
}

function engineUpdate() {
    function getEnd(start, limit = -1) { let ret = PORTFOLIO.slice(start).findIndex(x => !nullish(x.title)) + start; return limit === -1 ? ret : Math.min(ret, limit); }
    circle(0x00, getEnd(0x00, 0x10), 1024,  256, 200, 100,   5, 0.2 , 0.15 , "orange" ); //  0 ~ 10 (stream, stell, looksy, ghabi, chambers)
    circle(0x10, getEnd(0x10, 0x20), 1024,  512, 400, 100, -10, 0.4 , 0.2  , "cyan"   ); // 10 ~ 20 (hacknet, secretdoctah, xau, rorg, corekeeper, urobot, ccrots, pa, gheat)
    circle(0x20, getEnd(0x20, 0x40), 1024,  850, 600, 100,  12, 0.5 , 0.075           ); // 20 ~ 40 (ch, minor gizmos, standalone web pages)
    circle(0x40, getEnd(0x40, 0x50), 1024, 1175, 250,  50, -14, 0.4 , 0.2  , "#006fff"); // 40 ~ 50 sammi extensions
    circle(0x50, getEnd(0x50, 0x70), 1024, 1450, 800, 100, - 5, 0.7 , 0.125           ); // 50 ~ 70 (risk of rain (original))
    circle(0x70, getEnd(0x70, 0x90), 1024, 1650, 700, 100,   7, 0.3 , 0.1             ); // 70 ~ 90 (risk of rain (contrib/port) )
    circle(0x90, getEnd(0x90, 0xB0), 1024, 2100, 650, 100,  23, 0.3 , 0.175, "yellow" ); // 90 ~ B0 (music)
    circle(0xB0, getEnd(0xB0, 0xD0), 1024, 2200, 500, 100, -12, 0.1 , 0.1  , "lime"   ); // B0 ~ D0 (other (video, etc))
    circle(0xD0, getEnd(0xD0, 0xF0), 1024, 2600, 420, 100,   0, 0.05, 0.1  , "magenta"); // D0 ~ F0 (rd/adofai)
    circle(0xF0, getEnd(0xF0, 0x100), 1024, 2950, 250, 100,  19, 0.05, 0.075           ); // F0 ~ FF (1d1ps, le)
}

function updateHover(_hovered) {
    if (hovered !== _hovered) {
        hovered = _hovered;
        if (hovered === -1) {
            e("hover").style.cursor = "default";
            e("hover-inner").style.display = "none";
        } else {
            e("hover").style.cursor = "pointer";
            e("hover-inner").style.display = "block";
            let data = PORTFOLIO[sprites.length - hovered - 1] ?? {};
            e("hover-text").innerText = data.title ?? "EMPTY TITLE (ELEMENT " + (sprites.length - hovered) + ")";
        }
    }
    if (hovered !== -1) {
        e("hover-inner").style.left = (e("main").clientWidth / WIDTH * sprites[hovered].pos[0]) + "px";
        e("hover-inner").style.top = (e("main").clientHeight / HEIGHT * sprites[hovered].pos[1]) + "px";
    }
}

let postfade;
let currentData = null, currentImage = 0;
function updateClick(hovered) {
    if (hovered === -1) {
        clicked = false; 
        e("overlay").style.opacity = 0;
        e("overlay").style.transform = `translate(0, 64px) rotate(0deg)`;
        e("profile").style.paddingTop = "32px";
        e("profile").style.opacity = 0;
        e("next-image").style.marginBottom = "-66px";
        e("next-image").style.opacity = 0;
        e("next-image").style.cursor = "default";
        if (currentData.featured) {
            e("overlay").classList.remove("featured");
            e("overlay").classList.remove("featured-" + currentData.featured);
            e("featuredtag").style.display = "none";
        }
        if (postfade) { clearTimeout(postfade); postfade = null; }
    } else {
        clicked = true;
        e("overlay").style.opacity = 1;
        e("overlay").style.transform = `translate(0, 0) rotate(${random(2, -2)}deg)`;
        let rect = e("overlay").getBoundingClientRect();
        window.scrollTo(0, rect.y + window.scrollY - 128);
        let data = PORTFOLIO[sprites.length - hovered - 1] ?? {};
        currentData = data;
        for (const el of q("#title")) el.innerText = data.title ?? "EMPTY TITLE (ELEMENT " + (sprites.length - hovered) + ")";
        e("subtitle").innerText = data.subtitle ? bootlegMarkdown(data.subtitle) : "";
        removeAllChildren("tags");
        e("date").innerHTML = data.date ? `<i>O</i> ${formatDate2(data.date)}` : "";
        e("url").with("prehref", "//" + data.url).innerHTML = data.url ? `<i>O</i> ${data.url}` : "";
        e("url").removeAttribute("href"); // block insta teleport
        e("description").innerText = bootlegMarkdown(data.description);
        setCSS("profile-x", `${sprites[hovered].sprite[0] / (TEX_TILE[0] - 1) * 100}%`);
        setCSS("profile-y", `${sprites[hovered].sprite[1] / (TEX_TILE[1] - 1) * 100}%`);
        removeAllChildren("images");
        insertElement("img", "images", "noflashy image")
            .with("src", "//prod.kr/images/folio.png")
            .with("width", 4096).with("height", 4096).with("id", "profile");
        setTimeout(() => { 
            e("profile").style.opacity = 1;
            e("profile").style.paddingTop = "0px";
        }, 20);
        postfade = setTimeout(() => updateTags(data), 500);
    }
}
function updateTags(data) {
    for (let el of q("#overlay a")) el.with("href", el.getAttribute("prehref"));
    data.images = (data.images ?? []).map(x => {
        if (!/^https?:\/\//.test(x)) x = "https://" + x;
        return x;
    });
    if (data.images?.length) {
        // image
        e("next-image").style.marginBottom = "16px";
        e("next-image").style.opacity = 1;
        e("next-image").style.cursor = "pointer";
        for (let i = data.images.length - 1; i >= 0; i--) insertImage(data.images[i], "images").with("id", `image-${i+1}`);
        setLastSibling("profile");
    }
    // tags
    data.tags = (data.tags ?? []).filter(x => x.length);
    for (let i = 0; i < data.tags.length; i++) {
        let row = insertElement("div", "tags", "tag taggroup").with("id", `tag-${i}`);
        for (let j = data.tags[i].length - 1; j >= 0; j--) 
            insertElement("img", row, "tag").with("title", TAG_DESCRIPTION[data.tags[i][j]]).with("src", `//prod.kr/images/tags/${data.tags[i][j]}.png`).with("id", `tag-${i}-${j}`).with("style", `transform: rotate(${random(-5, 5)}deg)`).with("onerror", "this.src = \"//prod.kr/images/tags/test.png\"");
    }
    // featured
    if (data.featured) {
        e("overlay").classList.add("featured");
        e("overlay").classList.add("featured-" + currentData.featured);
        e("featuredtag").with("title", TAG_DESCRIPTION[`Featured - ${currentData.featured[0].toUpperCase() + currentData.featured.slice(1)}`]).with("src", `//prod.kr/images/tags/Featured - ${currentData.featured[0].toUpperCase() + currentData.featured.slice(1)}.png`).style.display = "block";
    }
    tagtick = 0;
    postfade = setTimeout(() => tickTagAnimation(data.tags), 50);
}
function insertImage(url, el) {
    let key = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/?.exec(url)?.[0];
    if (key) key = url.slice(key.length, key.length + "6b0xI_dqM-w".length + (key.endsWith("/") ? 1 : 0));
    if (key) return insertElement("iframe", el, "noflashy image").with("src", `https://www.youtube.com/embed/${key}`)
            .with("frameborder", 0).with("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share")
            .with("referrerpolicy", "strict-origin-when-cross-origin").with("allowfullscreen", "true");
    key = /.(mp4|avi|flv|mkv|mov|wmv|webm)($|\?|\#)/.exec(url)?.[1];
    if (key) return insertElement("source", insertElement("video", el, "noflashy image").with("controls", "true"))
            .with("src", url).with("type", "video/" + key);
    key = /.(mp3|wav|ogg|midi|flac|wma)($|\?|\#)/.exec(url)?.[1];
    if (key) return insertElement("source", insertElement("audio", el, "noflashy image").with("controls", "true"))
            .with("src", url);
    return insertElement("img", el, "noflashy image").with("src", url);
}
let tagtick = 0;
let tagHeight = 0;
function tickTagAnimation(tags) {
    let TOTAL_IMAGES_HEIGHT_OFFSET = Math.min(currentData.images.length * 80, 50 + 32 + (document.body.scrollWidth >= 1500 ? Math.max(...q("#title").map(x => x.clientHeight)) : 0));
    if (tagtick === 0) { // image
        currentImage = 0;
        for (let i = 1; i <= currentData.images.length; i++) {
            let el = e(`image-${i}`);
            el.style.opacity = Math.max(0.2, 1 / (i + 1));
            el.style.top = (TOTAL_IMAGES_HEIGHT_OFFSET / currentData.images.length * i) + "px";
            el.style.transform = `rotate(${random(-10, 10)}deg)`;
        }
    }
    tagtick++;
    if (tagtick % 2 === 0) {
        let selected = tagtick / 2 - 1;
        for (let i = selected; i < tags.length; i++) {
            let el = e(`tag-${i}`);
            if (i === selected) {
                el.style.opacity = 1;
                e(`tag-${i}-0`).style.opacity = 1;
            }
            el.style.left = 80 + (Math.min(e("tags").clientWidth / tags.length, 160) * i) + "px";
        }
    }
    if (tagtick >= (tags.length + 2)) {
        let selected = tagtick - tags.length - 2;
        if (selected === 0) {
            let margin = Number(e("next-image").style.marginBottom.slice(0, -2));
            let maxlen = Math.max(...tags.map(x => x.length));
            tagHeight = (e("tags").parentElement.clientHeight - margin - 66 - e("meta-wrapper").clientHeight - 32) / maxlen;
            if (tagHeight < 60) {
                tagHeight += (66+16) / maxlen;
                if (tagHeight > 60) e("next-image").style.marginBottom = ((tagHeight - 60) * maxlen - 66) + "px";
                else e("next-image").style.marginBottom = "16px";
            } else e("next-image").style.marginBottom = "-66px";
            tagHeight *= maxlen;
        }
        for (let i = 1; i < tags[selected].length; i++) {
            let el = e(`tag-${selected}-${i}`);
            el.style.opacity = 1;
            el.style.top = (16 + (Math.min(tagHeight / tags[selected].length, 60) * i)) + "px";
        }
    }
    if (tagtick < (tags.length * 2 + 1)) postfade = setTimeout(() => tickTagAnimation(tags), 50);
    else postfade = null;
}
function nextImage(event) {
    let TOTAL_IMAGES_HEIGHT_OFFSET = Math.min(currentData.images.length * 80, 50 + 32 + (document.body.scrollWidth >= 1500 ? Math.max(...q("#title").map(x => x.clientHeight)) : 0));
    if (!currentData.images?.length) return;
    event.stopPropagation();
    if (postfade) return;
    currentImage = (currentImage + 1) % (currentData.images.length + 1);
    let el = e("images").lastElementChild;
    el.style.opacity = 0;
    el.style.top = "-128px";
    el.style.transform = `rotate(${random(-45, 45)}deg)`;
    for (let i = 0; i <= e("images").childElementCount - 2; i++) {
        let el = e("images").children[e("images").childElementCount - 2 - i];
        el.style.opacity = 1 / (i + 1);
        el.style.top = (TOTAL_IMAGES_HEIGHT_OFFSET / currentData.images.length * i) + "px";
        if (i === 0) el.style.transform = `rotate(0deg)`
    }
    postfade = setTimeout(() => {
        let el = e("images").lastElementChild;
        setFirstSibling(el);
        el.style.top = (TOTAL_IMAGES_HEIGHT_OFFSET + 64) + "px";
        el.style.transform = `rotate(${random(-10, 10)}deg)`;
        postfade = setTimeout(() => {
            el.style.opacity = 1 / (currentData.images.length + 1);
            el.style.top = TOTAL_IMAGES_HEIGHT_OFFSET + "px";
            postfade = null;
        }, 50);
    }, 500);
}
function recalculateSizes() {
    {
        let margin = Number(e("next-image").style.marginBottom.slice(0, -2));
        let maxlen = Math.max(...currentData.tags.map(x => x.length));
        tagHeight = (e("tags").parentElement.clientHeight - margin - 66 - e("meta-wrapper").clientHeight - 32) / maxlen;
        if (tagHeight < 60) {
            tagHeight += (66+16) / maxlen;
            if (tagHeight > 60) e("next-image").style.marginBottom = ((tagHeight - 60) * maxlen - 66) + "px";
            else e("next-image").style.marginBottom = "16px";
        } else e("next-image").style.marginBottom = "-66px";
        tagHeight *= maxlen;
    }
    let TOTAL_IMAGES_HEIGHT_OFFSET = Math.min(currentData.images.length * 80, 50 + 32 + (document.body.scrollWidth >= 1500 ? Math.max(...q("#title").map(x => x.clientHeight)) : 0))
    const width = e("tags").clientWidth;
    for (let i = 0; i < currentData.tags.length; i++) {
        e(`tag-${i}`).style.left = 80 + (Math.min(width / currentData.tags.length, 160) * i) + "px";
        for (let j = 1; j < currentData.tags[i].length; j++)
            e(`tag-${i}-${j}`).style.top = (16 + (Math.min(tagHeight / currentData.tags[i].length, 60) * j)) + "px";
    }
    for (let i = 0; i <= e("images").childElementCount - 1; i++)
        e("images").children[e("images").childElementCount - 1 - i].style.top = 
            (TOTAL_IMAGES_HEIGHT_OFFSET / currentData.images.length * i) + "px";
}
function bootlegMarkdown(txt) {
    txt ??= "";
    txt = txt.replaceAll("\n", "<br>");
    txt = txt.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, `<a prehref="$2">$1</a>`); // links
    return txt;
}
function formatDate2(date) {
    if (typeof date === "string") return date;
    if (!date) return null;
    return "Created " + formatDate(date, "YYYY/MM/DD");
}