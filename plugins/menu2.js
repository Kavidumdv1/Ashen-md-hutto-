cmd({
  pattern: "menu2",
  react: "💙",
  alias: ["panel","list","commands"],
  desc: "Get bot\'s command list.",
  category: "main",
  use: '.menu',
  filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
  
const config = await readEnv();
  
if(os.hostname().length == 12 ) hostname = 'replit'
else if(os.hostname().length == 36) hostname = 'heroku'
else if(os.hostname().length == 8) hostname = 'koyeb'
else hostname = os.hostname()
let monspace ='```'

const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data
            let LOGO = ownerdata.imageurl;
            let BTN = ownerdata.button;
            let FOOTER = ownerdata.footer;
            let BTNURL = ownerdata.buttonurl;
            let HEADER = ownerdata.header;
let prefix = config.PREFIX;

let buttons = [{
                    name: "cta_url",
                    buttonParamsJson: JSON.stringify({
                        display_text: BTN,
                        url: BTNURL,
                        merchant_url: BTNURL
                    }),
                },
                 {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
            display_text: "GITHUB",
            url: "https://github.com/ASITHA-MD/ASITHA-MD",
            merchant_url: "https://github.com/ASITHA-MD/ASITHA-MD"
        }),},
                { name: 'single_select',
            buttonParamsJson: JSON.stringify({
               title: 'Select A Category :)',                        
            sections: [{                            
              title: 'Please select a category',
              highlight_label: '𝙰𝚂𝙸𝚃𝙷𝙰-𝙼𝙳',
                  rows: [{
                     title: 'DOWNLOAD MENU 📥',
                     //description: ``,
                     id: prefix + `downmenu`
                  }, {
                     title: 'MAIN MENU 🎀',
                    //description: ``,
                     id: prefix + `mainmenu`
                  }, {
                     title: 'MOVIE MENU 🎬',
                    //description: ``,
                     id: prefix + `extra`
                  }, {
                     title: 'SEARCH MENU 🔎',
                     //description: ``,
                     id: prefix + `searchmenu`
                  }, {
                     title: 'CONVERT MENU 🌀',
                     //description: ``,
                     id: prefix + `convertmenu`
                  }, {
                     title: 'GROUP MENU 🎩',
                     //description: ``,
                     id: prefix + `groupmenu`
                  }, {
                     title: 'OTHER MENU 👾',
                     //description: ``,
                     id: prefix + `othermenu`
                  }, {
                     title: 'OWNER MENU 👨‍💻',
                     //description: ``,
                     id: prefix + `ownermenu`
                  }, {
                     title: 'AI MENU 👨‍🔧',
                     //description: ``,
                     id: prefix + `aimenu`
                  }, {
                    title: 'FUN MENU 👨‍🔧',
                    //description: ``,
                    id: prefix + `funmenu`
                 }]
               }]
            })
         }]
  
let msg = `
*☠️ A S I T H A - M D ☠ -  LIST MENU ☠️*

   *HELLO* ${pushname}
*╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」*
*│◈ 𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴 -* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(require('os').totalmem / 1024 / 1024)}MB
*│◈ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 -* ${runtime(process.uptime())}
*╰──────────●●►*
`

let message = {
                    image: LOGO,
                    header: HEADER,
                    footer: FOOTER,
                    body: msg

                }
return conn.sendButtonMessage(from, buttons, m, message)
} catch (e) {
const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json'))
await conn.sendMessage(from, { react: { text: `❌`, key: mek.key } })
console.log(e)
reply(msr.replyMsg.erro)
}
})
