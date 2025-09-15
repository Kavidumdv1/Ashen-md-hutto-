const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers,
    jidNormalizedUser,
    generateForwardMessageContent,
    generateWAMessageFromContent,
    prepareWAMessageMedia,
    proto
} = require('@whiskeysockets/baileys');

const l = console.log;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('./lib/functions');
const fs = require('fs');
const P = require('pino');
const config = require('./config');
const qrcode = require('qrcode-terminal');
const util = require('util');
const { sms, downloadMediaMessage } = require('./lib/msg');
const axios = require('axios');
const { File } = require('megajs');
var { updateCMDStore, isbtnID, getCMDStore, getCmdForCmdId, connectdb, input, get, updb, updfb } = require("./lib/githubdb");
const { mongodb_connection_start, start_numrep_process, upload_to_mongodb, get_data_from_mongodb, storenumrepdata, getstorednumrep } = require('./lib/nonbutton');

const ownerNumber = ['94789123880'];

//===================SESSION-AUTH============================
if (!fs.existsSync(__dirname + '/session/creds.json')) {
    if(!config.SESSION_ID) return console.log('Please add your session to SESSION_ID env !!')
    const sessdata = config.SESSION_ID.split("KAVIDU-MD=")[1];
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`)
    filer.download((err, data) => {
        if(err) throw err
        fs.writeFile(__dirname + '/session/creds.json', data, () => {
            console.log("Session downloaded ✅")
        })
    });
}

const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
//================================/
async function connectToWA() {
    //==================MONGODB===========================
    const connectDB = require('./lib/mongodb');
    connectDB();
    //==============================================

    console.log("Connecting ASITHA-MD 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/');
    var { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
        syncFullHistory: true,
        auth: state,
        version
    });
    
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if (lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut) {
                connectToWA();
            }
        } else if (connection === 'open') {
            console.log('😼 Installing... ');
            const path = require('path');
            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);
                }
            });
            console.log('Plugins installed successful ✅');
            await connectdb();
            await updb();
            await start_numrep_process();
            console.log('Bot connected to whatsapp ✅');

            let up = `*ASITHA-MD connected successful ✅`;
            await conn.sendMessage(ownerNumber + "@s.whatsapp.net", { image: { url: `https://i.postimg.cc/zvpdnfsK/1727229710389.jpg` }, caption: up });
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.getstorednumrep = async (quotedid, jid, num, conn, mek) => { 
        return await getstorednumrep(quotedid, jid, num, conn, mek);
    };

    conn.ev.on('messages.upsert', async (mek) => {
        if (config.ALLWAYS_OFFLINE === "true" && mek.key && mek.key.remoteJid !== 'status@broadcast') {
            await conn.readMessages([mek.key]);
        }
        mek = mek.messages[0];
        if (!mek.message) return;	
        mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
        if (mek.key && mek.key.remoteJid === 'status@broadcast' && config.AUTO_READ_STATUS === "true") {
            await conn.readMessages([mek.key]);
        }

        const prefix = config.PREFIX;
        const m = sms(conn, mek);
        const type = getContentType(mek.message);
        const content = JSON.stringify(mek.message);
        const from = mek.key.remoteJid;
        const quoted = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.quotedMessage || [] : [];
        const quotedid = type == 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo != null ? mek.message.extendedTextMessage.contextInfo.stanzaId || null : null;

        let body;
        if (type === 'conversation') body = mek.message.conversation;
        else if (type === 'extendedTextMessage') {
            const storedNumRep = await getstorednumrep(quotedid, from, mek.message.extendedTextMessage.text, conn, mek);
            body = storedNumRep ? storedNumRep : mek.message.extendedTextMessage.text;
        } else if (type == 'interactiveResponseMessage') {
            body = mek.message.interactiveResponseMessage && mek.message.interactiveResponseMessage.nativeFlowResponseMessage && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson) && JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id;
        } else if (type == 'templateButtonReplyMessage') {
            body = mek.message.templateButtonReplyMessage && mek.message.templateButtonReplyMessage.selectedId;
        } else if (type == 'imageMessage' && mek.message.imageMessage && mek.message.imageMessage.caption) {
            body = mek.message.imageMessage.caption;
        } else if (type == 'videoMessage' && mek.message.videoMessage && mek.message.videoMessage.caption) {
            body = mek.message.videoMessage.caption;
        } else body = '';

        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(' ');
        const isGroup = from.endsWith('@g.us');
        const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net' || conn.user.id) : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];

        //======================BAN USER FIX========================
        const banbnRaw = await fetchJson(`https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Banduser.json`);
        const banbnString = Array.isArray(banbnRaw) ? banbnRaw.join(",") : (typeof banbnRaw === 'string' ? banbnRaw : "");
        const plynYnna = banbnString.split(",").map(v => v.trim()).filter(v => v);
        const isBanUser = plynYnna
            .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
            .includes(sender);

        const isCreator = ["94743381623", "94714857323"]
            .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
            .includes(sender);

        if(isCmd && isBanUser) return conn.sendMessage(from, { text: "❌ *You are banned from using Commands.....*\n\n*_Please contact ASITHA-MD Bot Owner <94743381623> Remove your Ban_* 👨‍🔧" });

        //... rest of your logic untouched
    });
}

app.get("/", (req, res) => {
    res.send("hey, bot started✅");
});
app.listen(port, () => console.log(`Server listening on port http://localhost:${port}`));
setTimeout(() => {
    connectToWA();
}, 4000);
