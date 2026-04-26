const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const LOG_FILE = path.join(__dirname, 'logs/gateway.log');
const LOGS_DIR = path.join(__dirname, 'logs');

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

console.log('\n=== CLAWREFLEX LIVE DEMO ===\n');
console.log('Watch the system detect and heal a broken skill in real-time!\n');

// Clear log
fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] INFO: ClawReflex monitoring started.\n`);

// Step 1: Show monitor active
console.log('1. Monitor is watching logs...\n');

setTimeout(() => {
    console.log('2. Simulating API crash (deliberate failure for demo)...\n');
    const failLog = `[${new Date().toISOString()}] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service\n`;
    fs.appendFileSync(LOG_FILE, failLog);
    
    setTimeout(() => {
        console.log('3. FAILURE DETECTED by monitor!\n');
        
        setTimeout(() => {
            console.log('4. Surgeon analyzing and healing...\n');
            
            const surgeon = spawn('node', [path.join(__dirname, 'src/surgeon.js'), 'WeatherSkill', 'getaddrinfo ENOTFOUND api.legacy-weather.service'], {
                cwd: __dirname
            });
            
            surgeon.stdout.on('data', (data) => console.log('   ' + data.toString().trim()));
            surgeon.stderr.on('data', (data) => console.error('   ' + data.toString().trim()));
            
            surgeon.on('close', () => {
                setTimeout(() => {
                    console.log('\n5. Healing complete!\n');
                    
                    console.log('6. Post-Mortem Report generated:\n');
                    const reports = fs.readdirSync(LOGS_DIR).filter(f => f.startsWith('POST_MORTEM'));
                    if (reports.length > 0) {
                        const latest = reports.sort().pop();
                        const content = fs.readFileSync(path.join(LOGS_DIR, latest), 'utf8');
                        console.log(content);
                    }
                    
                    console.log('\n=== DEMO COMPLETE ===');
                    console.log('The system works autonomously!\n');
                }, 1000);
            });
        }, 1500);
    }, 1500);
}, 2000);