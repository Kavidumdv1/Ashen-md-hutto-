// githubdb.js (read-only, no token required)
const fetch = require('node-fetch');

const userName = "Kavidumdv1";
const repoName = "Ashen-md-hutto-";

// Function to get GitHub file content
async function githubGetFileContent(filePath, fileName) {
    const url = `https://raw.githubusercontent.com/${userName}/${repoName}/main/${filePath}/${fileName}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`File not found: ${filePath}/${fileName}`);
    return await response.text();
}

// Dummy connectdb function for read-only
async function connectdb() {
    console.log("⚠️ connectdb: Public repo read-only mode. No DB creation possible without token.");
    return true;
}

// Export functions
module.exports = { 
    connectdb,             // function to simulate DB connection
    githubGetFileContent   // function to fetch content of files from public repo
};
