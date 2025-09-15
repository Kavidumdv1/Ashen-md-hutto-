const fs = require("fs");
const path = require("path");
const configPath = path.join(__dirname, "../config/settings.json");

// settings.json read function
function readConfig() {
    return JSON.parse(fs.readFileSync(configPath));
}

// settings.json write function
function writeConfig(newConfig) {
    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));
    return true;
}

const { cmd } = require("../lib/cmd");

// 🛡️ Settings Panel Command
cmd({
    pattern: "settings",
    react: "🛡️",
    alias: ["setting", "botsetting"],
    desc: "Bot settings panel (Owner only).",
    category: "owner",
    use: ".settings",
    filename: __filename
},
async (conn, mek, m, { from, q, isMe, reply }) => {
    try {
        if (!isMe) return await reply("⚠️ *Owner only!*");

        let config = readConfig();

        let msg = `
*🤖 ${config.BOT_NAME} - SETTINGS PANEL 🤖*

╭──「 *Current Settings* 」
│◈ Prefix: ${config.PREFIX}
│◈ Owner: ${config.OWNER_NAME}
│◈ Number: ${config.OWNER_NUMBER}
│◈ Footer: ${config.FOOTER}
│◈ Auto React: ${config.AUTO_REACT}
│◈ Anti Delete: ${config.ANTI_DELETE}
│◈ Welcome: ${config.WELCOME_MESSAGE}
│◈ Goodbye: ${config.GOODBYE_MESSAGE}
╰───────────────●●►
`;

        await conn.sendMessage(from, {
            image: { url: config.IMAGE_URL },
            caption: msg
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Error in settings command");
    }
});

// 📝 Update Prefix Command
cmd({
    pattern: "prefix",
    react: "🔑",
    desc: "Change bot prefix (Owner only).",
    category: "owner",
    use: ".prefix <new_prefix>",
    filename: __filename
},
async (conn, mek, m, { q, isMe, reply }) => {
    try {
        if (!isMe) return await reply("⚠️ *Owner only!*");
        if (!q) return reply("❌ Please provide a new prefix!");

        let config = readConfig();
        config.PREFIX = q;
        writeConfig(config);

        reply(`✅ *Prefix updated to:* ${q}`);
    } catch (e) {
        console.log(e);
        reply("❌ Error updating prefix");
    }
});
