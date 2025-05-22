const { _report } = require("../api/WS/brain");

module.exports.execute = (module, name, id, code, res, token, stack) => {
    _report(module, name, id, code, res, token, stack);
    return [0, ""];
}