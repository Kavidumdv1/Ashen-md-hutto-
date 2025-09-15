// plugins_Asitha.js

// අවශ්‍ය modules require කිරීම
const { storenumrepdata } = require('../lib/nonbutton'); // path නිවැරදිද කියලා check කරන්න
const fs = require('fs');
const path = require('path');

// Example function - ඔයාට අවශ්‍ය logic එකට modify කරන්න
function saveUserData(userId, data) {
    try {
        // storenumrepdata function එක භාවිතා කරලා data save කරනවා
        storenumrepdata(userId, data);
        console.log(`Data saved for user: ${userId}`);
    } catch (err) {
        console.error(`Error saving data for user ${userId}:`, err);
    }
}

// Another example function
function readUserData(userId) {
    try {
        const data = storenumrepdata(userId); // assume it returns saved data
        return data;
    } catch (err) {
        console.error(`Error reading data for user ${userId}:`, err);
        return null;
    }
}

// Export functions
module.exports = {
    saveUserData,
    readUserData,
    storenumrepdata
};
