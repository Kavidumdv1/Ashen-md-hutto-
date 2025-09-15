const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    getContentType,
    fetchLatestBaileysVersion,
    Browsers,
    jidNormalizedUser
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const P = require('pino');
const path = require('path');
const config = require('./config');
const { sms } = require('./lib/msg');
const { fetchJson } = require('./lib/functions');
const { connectdb, updb } = require("./lib/githubdb");
const { start_numrep_process, getstorednumrep } = require('./lib/nonbutton');
const { cmd, commands } = require("./command");   // ✅ handler import

const ownerNumber = ['94767054052'];

async function connectToWA() {
    console.log("Connecting ASITHA-MD 🧬...");
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/');
    var { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket({
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: Browsers.macOS("Firefox"),
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
            console.log('😼 Installing Plugins...');

            fs.readdirSync("./plugins/").forEach((plugin) => {
                if (path.extname(plugin).toLowerCase() == ".js") {
                    require("./plugins/" + plugin);  // ✅ plugins load
                }
            });

            console.log('Plugins installed successful ✅');
            await connectdb();
            await updb();
            await start_numrep_process();
            console.log('Bot connected to whatsapp ✅');
        }
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('messages.upsert', async (mek) => {
        mek = mek.messages[0];
        if (!mek.message) return;

        const from = mek.key.remoteJid;
        const type = getContentType(mek.message);
        const m = sms(conn, mek);

        let body;
        if (type === 'conversation') body = mek.message.conversation;
        else if (type === 'extendedTextMessage') {
            const quotedid = mek.message.extendedTextMessage.contextInfo?.stanzaId || null;
            const storedNumRep = await getstorednumrep(quotedid, from, mek.message.extendedTextMessage.text, conn, mek);
            body = storedNumRep ? storedNumRep : mek.message.extendedTextMessage.text;
        } else body = '';

        const prefix = config.PREFIX || ".";
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const sender = mek.key.fromMe ? conn.user.id : (mek.key.participant || mek.key.remoteJid);
        const senderNumber = sender.split('@')[0];
        const isGroup = from.endsWith('@g.us');

        // === Command Handler Run ===
        if (isCmd) {
            const cmdObj = commands.find(c =>
                c.info.pattern === command ||
                (c.info.alias && c.info.alias.includes(command))
            );
            if (cmdObj) {
                try {
                    await cmdObj.func(conn, mek, m, {
                        from, body, isCmd, command, args, q,
                        isGroup, sender, senderNumber
                    });
                } catch (e) {
                    console.log("❌ Command Error:", e);
                    conn.sendMessage(from, { text: "⚠️ Error while running command" });
                }
            }
        }
    });
}

setTimeout(() => {
    connectToWA();
}, 4000);
