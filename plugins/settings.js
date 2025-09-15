const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions')
var { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb, storenumrepdata } = require("../lib/githubdb")

// ✅ desc2 define කරන එක
let desc2 = "Bot settings command for owner only";

// Settings command
cmd({
    pattern: "settings",
    react: "🛡️",
    alias: ["setting", "botsetting"],
    desc: desc2,
    category: "owner",
    use: '.settings',
    filename: __filename
},
async(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply("Owner only")
        if (!q) return reply("Please give me text")
        
        let numrep = []
        let pakaya = `1.1 SET PREFIX`
        numrep.push(`1.1 ${config.prefix || '.'}prefix ${q}`)  // prefix define කරලා නැත්තම් default '.'

        const mass = await conn.sendMessage(from, { 
            image: { url: `https://i.postimg.cc/zvpdnfsK/1727229710389.jpg` }, 
            caption: `${pakaya}\n\n` 
        }, { quoted: mek });

        const jsonmsg = {
            key: mass.key,
            numrep,
            method: 'decimal'
        }
        await storenumrepdata(jsonmsg)

    } catch (e) {
        console.log(e)
        reply(e)
    }
})

// Prefix update command
cmd({
    pattern: "prefix",
    dontAddCommandList: true,
    filename: __filename
},
async(conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!isMe) return await reply("Owner only")
        let gett = await get("PREFIX")
        if (gett === q) return await reply("Already Done")
        await input("PREFIX", q)

        await reply("*PREFIX updated: " + q + "*")

    } catch (e) {
        reply('*Error !!*')
        l(e)
    }
})
