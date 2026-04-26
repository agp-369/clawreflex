/**
 * WeatherSkill.js
 * A sample OpenClaw skill that demonstrates autonomous healing.
 * This skill intentionally uses a deprecated API to simulate a failure scenario.
 */

const axios = require('axios');

async function getWeather(city) {
    console.log(`[WeatherSkill] Fetching weather for ${city}...`);
    
    // Using the legacy API - this will eventually fail and trigger ClawReflex healing
    const API_URL = `https://api.legacy-weather.service/v1/current?q=${city}`;
    
    try {
        const response = await axios.get(API_URL, { timeout: 5000 });
        return response.data;
    } catch (error) {
        // This logs the failure that ClawReflex will detect
        const errorMsg = error.code === 'ENOTFOUND' 
            ? 'getaddrinfo ENOTFOUND api.legacy-weather.service'
            : error.message;
            
        console.error(`[CRITICAL_FAILURE] WeatherSkill failed: ${errorMsg}`);
        throw error;
    }
}

async function getForecast(city, days = 3) {
    const weather = await getWeather(city);
    return {
        city,
        forecast: weather.forecast || 'Sunny',
        days
    };
}

module.exports = { getWeather, getForecast };