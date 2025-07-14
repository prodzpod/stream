let gl, program, sprites = [], _buffers = [];
addEvent("onload", () => {
    const c = e("main");
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
            v_position = (a_sprite + vec2(a_position.x, -a_position.y) + vec2(0.5, 0.5) + vec2(-a_midpoint.x, a_midpoint.y)) / vec2(16, 16);
            v_darkness = a_darkness;
        }
    `, "VERTEX_SHADER");
    const FRAGMENT_SHADER = createShader(gl, `
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_position;
        varying float v_darkness;
        void main() {
            gl_FragColor = texture2D(u_texture, v_position) * vec4(v_darkness, v_darkness, v_darkness, 1);
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
    for (let i = 0; i < 15; i++) spawn();
    update();
});

// sprites = [...{ sprite: [1, 0], pos: [256, 256], size: 1, darkness: 1 }]

function update() {
    let buffers = [[], [], [], [], []];
    for (let sprite of sprites) {
        let l = ((sprite.pos[0] - (256 * sprite.size)) / 512) - 1,
            u = ((sprite.pos[1] - (256 * sprite.size)) / 512) - 1,
            d = ((sprite.pos[1] + (256 * sprite.size)) / 512) - 1,
            r = ((sprite.pos[0] + (256 * sprite.size)) / 512) - 1;
        let midx = sprite.pos[0] / 512 - 1,
            midy = sprite.pos[1] / 512 - 1;
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

let lastPosition = [0, 0];
addEvent("onpointermove", (event) => {
    let position = [event.layerX, event.layerY];
    move(Math.dist(lastPosition[0] - position[0], lastPosition[1] - position[1]));
    lastPosition = position;
});

let tick = 0;
function move(distance) {
    tick += distance * distance / 40;
    circle(0, sprites.length, 512, 512, 400, 100, 10);
    update();
}

function spawn() {
    sprites.push({pos: [512, 512], sprite: [random(0, 4), random(-0.5, 0.5)], size: 0.25, darkness: 1});
}

let slopeLUT = {};
function circle(start = 0, end = sprites.length, cx = 512, cy = 512, xscale = 256, yscale = 256, angle = 0) {
    if (angle < 0 || angle >= 360) angle = Math.posmod(angle, 360);
    if (angle >= 90) { circle(start, end, cx, cy, yscale, xscale, angle - 90); return }
    if (xscale < 0) xscale = -xscale; if (yscale < 0) yscale = -yscale;
    if (xscale === 0 || yscale === 0) return;
    for (let i = start; i < end; i++) {
        let tx = xscale * Math.cos(tick + (Math.PI * 2 / (end - start) * i));
        let ty = yscale * Math.sin(tick + (Math.PI * 2 / (end - start) * i));
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
        sprites[i].size = (0.25 - slope[0] * 0.1) + (slope[0] * 0.1 * Math.cos(theta + (slope[1] ? 0 : Math.PI / 2)));
        sprites[i].darkness = 1 - slope[0] * 0.4 + slope[0] * 0.4 * Math.cos(theta + (slope[1] ? 0 : Math.PI / 2));
    }
}