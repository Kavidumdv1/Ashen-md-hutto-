const commands = [];

/**
 * Command register function
 */
function cmd(info, func) {
    let data = {
        pattern: info.pattern,
        react: info.react || "",
        alias: info.alias || [],
        desc: info.desc || "",
        category: info.category || "general",
        use: info.use || "",
        filename: info.filename || __filename,
        dontAddCommandList: info.dontAddCommandList || false,
        function: func
    };
    commands.push(data);
    return data;
}

module.exports = {
    cmd,
    commands
};
