/**
 * WeatherSkill.js
 * Weather skill using deprecated API
 */

const axios = require('axios');

async function getWeather(city) {
    console.log(`[WeatherSkill] Fetching weather for ${city}...`);
    
    const API_URL = `https://api.legacy-weather.service/v1/current?q=${city}`;
    
    try {
        const response = await axios.get(API_URL, { timeout: 5000 });
        return response.data;
    } catch (error) {
        const errorMsg = error.code === 'ENOTFOUND' 
            ? 'getaddrinfo ENOTFOUND api.legacy-weather.service'
            : error.message;
            
        console.error(`[CRITICAL_FAILURE] WeatherSkill failed: ${errorMsg}`);
        throw error;
    }
}

module.exports = { getWeather };