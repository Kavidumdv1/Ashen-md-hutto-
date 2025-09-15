const fetch = require('node-fetch');

const userName = 'Kavidumdv1';
const repoName = 'Ashen-md-hutto-';

//================ GitHub API =====================//

async function githubApiRequest(url, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js'
      },
    };

    if (data && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(data);
    }

    const res = await fetch(url, options);
    return await res.json();
  } catch (error) {
    console.error('GitHub API request failed:', error.message);
    return null;
  }
}

// Check if folder/file exists
async function githubSearchFile(filePath, fileName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}`;
  const files = await githubApiRequest(url);
  if (!files) return null;
  return files.find(f => f.name === fileName);
}

// Get file content
async function githubGetFileContent(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) return null;

  const response = await fetch(file.download_url);
  return await response.text();
}

//================ Database functions =====================//

async function updateCMDStore(MsgID, CmdID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json')) || [];
    olds.push({ [MsgID]: CmdID });
    return await githubClearAndWriteFile('Non-Btn', 'data.json', JSON.stringify(olds, null, 2));
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isbtnID(MsgID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json')) || [];
    return olds.some(item => item[MsgID]);
  } catch (e) {
    return false;
  }
}

async function getCMDStore(MsgID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", 'data.json')) || [];
    const found = olds.find(item => item[MsgID]);
    return found ? found[MsgID] : null;
  } catch (e) {
    console.log(e);
    return null;
  }
}

//================ Settings =====================//

async function get(setting) {
  const data = JSON.parse(await githubGetFileContent("settings", "settings.json")) || {};
  return data[setting] || null;
}

async function input(setting, value) {
  const data = JSON.parse(await githubGetFileContent("settings", "settings.json")) || {};
  data[setting] = value;
  return await githubClearAndWriteFile("settings", "settings.json", JSON.stringify(data, null, 2));
}

// Clear and overwrite file content (public repo, unauthenticated)
async function githubClearAndWriteFile(filePath, fileName, content) {
  console.warn(`⚠️ Cannot write to GitHub repo without authentication. Operation skipped for ${filePath}/${fileName}`);
  return false;
}

module.exports = { updateCMDStore, isbtnID, getCMDStore, get, input };
