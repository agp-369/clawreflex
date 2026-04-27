/**
 * WeatherSkill.js
 * Weather skill for OpenClaw
 */

const axios = require('axios');

async function getWeather(city) {
    console.log(`[WeatherSkill] Fetching weather for ${city}...`);
    
    try {
        const response = await axios.get(`http://wttr.in/${city}?format=j1`, { timeout: 5000 });
        return response.data;
    } catch (error) {
        const errorMsg = error.code === 'ENOTFOUND' 
            ? 'getaddrinfo ENOTFOUND wttr.in'
            : error.message;
            
        console.error(`[CRITICAL_FAILURE] WeatherSkill failed: ${errorMsg}`);
        throw error;
    }
}

async function getForecast(city, days = 3) {
    try {
        const weather = await getWeather(city);
        const forecastData = weather.current_condition;
        const forecast = [];
        
        for (let i = 0; i < days; i++) {
            forecast.push({
                day: i + 1,
                weather: forecastData[0].weatherDesc[0].value
            });
        }
        
        return {
            city,
            forecast
        };
    } catch (error) {
        console.error(`[CRITICAL_FAILURE] WeatherSkill failed: ${error.message}`);
        throw error;
    }
}

module.exports = { getWeather, getForecast };
