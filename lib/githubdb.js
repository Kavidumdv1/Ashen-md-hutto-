// githubdb.js (read-only)
const fetch = require('node-fetch');

const userName = "Kavidumdv1";
const repoName = "Ashen-md-hutto-";

// Get file content from GitHub (read-only)
async function githubGetFileContent(filePath, fileName) {
    const url = `https://raw.githubusercontent.com/${userName}/${repoName}/main/${filePath}/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`File not found: ${filePath}/${fileName}`);
    return await response.text();
}

// Dummy connectdb function (no DB creation)
async function connectdb() {
    console.log("⚠️ connectdb: Public repo read-only mode. DB creation/update disabled.");
    return true;
}

// Dummy updateCMDStore (read-only)
async function updateCMDStore(MsgID, CmdID) {
    console.log("⚠️ updateCMDStore: read-only mode, cannot modify data.json");
    return false;
}

// Dummy input function (read-only)
async function input(setting, data) {
    console.log(`⚠️ input: read-only mode, cannot modify settings.json (${setting})`);
    return false;
}

// Dummy updb function (read-only)
async function updb() {
    console.log("⚠️ updb: read-only mode, cannot update config from settings.json");
    return false;
}

// Dummy updfb function (read-only)
async function updfb() {
    console.log("⚠️ updfb: read-only mode, cannot reset settings.json");
    return false;
}

// Export functions
module.exports = {
    connectdb,
    githubGetFileContent,
    updateCMDStore,
    input,
    updb,
    updfb
};
