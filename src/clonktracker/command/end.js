const { end } = require("../app");

module.exports.execute = () => {
    end();
    return [0, ""];
}