const easymidi = require('easymidi');
const { Math } = require('./common');
const { log } = require('./ws');
let output; 
module.exports.init = () => {
    output = new easymidi.Output('Gizmo');
}

module.exports.end = () => {
    output.close();
}

module.exports.send = (cc, v, channel = 0) => {
    output.send('cc', {
        controller: Math.floor(Math.clamp(cc, 0, 127)),
        value: Math.floor(Math.clamp(v, 0, 127)),
        channel: Math.floor(Math.clamp(channel, 0, 15))
    });
    return [0, ""];
}