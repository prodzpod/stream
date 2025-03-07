module.exports.execute = async (author, color, message) => {
    require("../app").message(author, color, message);
    return [0, "done"];
};