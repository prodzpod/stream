module.exports.execute = () => {
    require("../index").ws()?.terminate();
    return [0, ""];
}