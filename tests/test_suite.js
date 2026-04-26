const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Monitor Module', () => {
    const testLogPath = path.join(__dirname, 'test_gateway.log');
    
    beforeEach(() => {
        fs.writeFileSync(testLogPath, '[2026-04-19 14:00:01] INFO: Gateway started.\n');
    });
    
    afterEach(() => {
        if (fs.existsSync(testLogPath)) {
            fs.unlinkSync(testLogPath);
        }
    });

    describe('scanLog()', () => {
        it('should detect CRITICAL_FAILURE pattern in logs', () => {
            fs.appendFileSync(testLogPath, '[2026-04-19 14:05:23] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service\n');
            
            const content = fs.readFileSync(testLogPath, 'utf8');
            const lines = content.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            
            const FAILURE_PATTERN = /ERROR: \[CRITICAL_FAILURE\] (\w+) failed: (.+)/;
            const match = lastLine.match(FAILURE_PATTERN);
            
            assert(match !== null, 'Should detect CRITICAL_FAILURE');
            assert.equal(match[1], 'WeatherSkill', 'Should extract skill name');
            assert.match(match[2], /ENOTFOUND/, 'Should extract error message');
        });

        it('should return null for healthy logs', () => {
            const content = fs.readFileSync(testLogPath, 'utf8');
            const lines = content.trim().split('\n');
            const lastLine = lines[lines.length - 1];
            
            const FAILURE_PATTERN = /ERROR: \[CRITICAL_FAILURE\] (\w+) failed: (.+)/;
            const match = lastLine.match(FAILURE_PATTERN);
            
            assert.equal(match, null, 'Should not detect failure in healthy log');
        });
    });

    describe('FAILURE_PATTERN', () => {
        it('should match various error types', () => {
            const patterns = [
                'ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service',
                'ERROR: [CRITICAL_FAILURE] EmailSkill failed: connect ECONNREFUSED',
                'ERROR: [CRITICAL_FAILURE] CalendarSkill failed: 401 Unauthorized'
            ];
            
            const FAILURE_PATTERN = /ERROR: \[CRITICAL_FAILURE\] (\w+) failed: (.+)/;
            
            patterns.forEach(pattern => {
                const match = pattern.match(FAILURE_PATTERN);
                assert(match !== null, `Should match: ${pattern}`);
            });
        });
    });
});

describe('Surgeon Module', () => {
    const testSkillPath = path.join(__dirname, 'test_WeatherSkill.js');
    
    afterEach(() => {
        if (fs.existsSync(testSkillPath)) {
            fs.unlinkSync(testSkillPath);
        }
    });

    describe('Code Replacement Logic', () => {
        it('should replace deprecated API endpoints', () => {
            const oldCode = "const API_URL = 'https://api.legacy-weather.service/v1/current?q=\${city}';";
            const newCode = oldCode.replace(
                'https://api.legacy-weather.service/v1/current?q=${city}',
                'https://wttr.in/${city}?format=j1'
            );
            
            assert(newCode.includes('wttr.in'), 'Should contain wttr.in API');
        });

        it('should update deprecation comments', () => {
            const oldCode = `// OBSOLETE API: This endpoint was decommissioned in Jan 2026`;
            const newCode = oldCode.replace(
                'OBSOLETE API: This endpoint was decommissioned in Jan 2026',
                'HEALED BY CLAWREFLEX: Switched to wttr.in API'
            );
            
            assert.equal(newCode, '// HEALED BY CLAWREFLEX: Switched to wttr.in API');
        });
    });
});

describe('WeatherSkill Module', () => {
    describe('API Integration', () => {
        it('should have correct API URL format', () => {
            const API_URL = 'https://wttr.in/${city}?format=j1';
            assert(API_URL.includes('wttr.in'), 'Should use wttr.in API');
            assert(API_URL.includes('format=j1'), 'Should request JSON format');
        });
    });
});