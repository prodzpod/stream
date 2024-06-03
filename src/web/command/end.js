const { end } = require("../app");

module.exports.execute = async () => {
    await end();
    return [0, ""];
}