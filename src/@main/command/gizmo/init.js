const { send, src } = require("../..")

module.exports.execute = () => {
    src().marker.sendInfo();
    return [0, ""];
}