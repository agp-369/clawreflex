/**
 * WeatherSkill.js
 * A sample OpenClaw skill that is "broken" because it uses an obsolete API.
 */

const axios = require('axios');

async function getWeather(city) {
    console.log(`[WeatherSkill] Fetching weather for ${city}...`);
    
    // HEALED BY CLAWREFLEX: Switched to wttr.in API
    const API_URL = `https://wttr.in/${city}?format=j1`;
    
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        // This will trigger a log entry that ClawReflex needs to catch
        console.error(`[CRITICAL_FAILURE] WeatherSkill failed: ${error.message}`);
        throw error;
    }
}

module.exports = { getWeather };
