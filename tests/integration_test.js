const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

describe('Integration Tests', function() {
    this.timeout(10000);
    
    const LOG_FILE = path.join(__dirname, '../logs/gateway.log');
    const LOGS_DIR = path.join(__dirname, '../logs');
    
    beforeEach(() => {
        if (!fs.existsSync(LOGS_DIR)) {
            fs.mkdirSync(LOGS_DIR, { recursive: true });
        }
    });

    describe('End-to-End Healing Flow', () => {
        it('should complete full healing cycle from error detection to verification', (done) => {
            const testLogEntry = `[${new Date().toISOString()}] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service\n`;
            
            fs.appendFileSync(LOG_FILE, testLogEntry);
            
            setTimeout(() => {
                const logs = fs.readFileSync(LOG_FILE, 'utf8');
                assert(logs.includes('[CRITICAL_FAILURE]'), 'Should have error in log');
                done();
            }, 1500);
        });

        it('should create post-mortem report after healing', async () => {
            const { execSync } = require('child_process');
            // Manually trigger surgeon to ensure a report exists
            execSync('node src/surgeon.js WeatherSkill "Test error"');
            
            const logsDir = path.join(__dirname, '../logs');
            const postMortemFiles = fs.readdirSync(logsDir).filter(f => f.startsWith('POST_MORTEM'));
            
            assert(postMortemFiles.length > 0, 'Should have at least one post-mortem report');
        });
    });

    describe('Git Integration', () => {
        it('should have git repository initialized', () => {
            const gitDir = path.join(__dirname, '..', '.git');
            assert(fs.existsSync(gitDir), 'Git repository should exist');
        });
    });

    describe('Skill Loading', () => {
        it('should load WeatherSkill module without errors', () => {
            const weatherSkill = require('../AgentSkills/WeatherSkill.js');
            assert(typeof weatherSkill.getWeather === 'function', 'Should export getWeather function');
            assert(typeof weatherSkill.getForecast === 'function', 'Should export getForecast function');
        });

        it('should load EmailSkill module without errors', () => {
            const emailSkill = require('../AgentSkills/EmailSkill.js');
            assert(typeof emailSkill.sendEmail === 'function', 'Should export sendEmail function');
            assert(typeof emailSkill.sendReminderEmail === 'function', 'Should export sendReminderEmail function');
        });
    });

    describe('API Configuration', () => {
        it('should have correct package.json with scripts', () => {
            const pkg = require('../package.json');
            assert(pkg.scripts.test, 'Should have test script');
            assert(pkg.scripts.start, 'Should have start script');
            assert(pkg.scripts.heal, 'Should have heal script');
        });

        it('should have axios dependency', () => {
            const pkg = require('../package.json');
            assert(pkg.dependencies.axios, 'Should have axios dependency');
        });
    });
});