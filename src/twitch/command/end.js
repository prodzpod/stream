const { end } = require("../eventsub")

module.exports.execute = () => {
    end();
    return [0, ""];
}