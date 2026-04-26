/**
 * WeatherSkill.js
 * Weather skill for OpenClaw
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

async function getForecast(city, days = 3) {
    const weather = await getWeather(city);
    return {
        city,
        forecast: weather.forecast || 'Sunny',
        days
    };
}

module.exports = { getWeather, getForecast };