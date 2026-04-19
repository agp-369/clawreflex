/**
 * monitor.js
 * Watches the gateway logs and triggers the healing process when a failure is detected.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const LOG_FILE = path.join(__dirname, '../logs/gateway.log');
const FAILURE_PATTERN = /ERROR: \[CRITICAL_FAILURE\] (\w+) failed: (.+)/;

console.log('🛡️ ClawReflex Monitor is active. Watching logs...');

// Initial Scan
scanLog();

// Tail the log file
fs.watchFile(LOG_FILE, (curr, prev) => {
    if (curr.mtime <= prev.mtime) return;
    scanLog();
});

function scanLog() {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const lines = content.trim().split('\n');
    const lastLine = lines[lines.length - 1];

    const match = lastLine.match(FAILURE_PATTERN);
    if (match) {
        const skillName = match[1];
        const errorMessage = match[2];
        
        console.log(`\n🚨 FAILURE DETECTED in ${skillName}!`);
        console.log(`📝 Error: ${errorMessage}`);
        
        healSkill(skillName, errorMessage);
    }
}

function healSkill(name, error) {
    console.log(`🩹 Initiating healing for ${name}...`);
    // In a real scenario, this would call surgeon.js
    const surgeon = spawn('node', [path.join(__dirname, 'surgeon.js'), name, error]);

    surgeon.stdout.on('data', (data) => console.log(`[Surgeon] ${data}`));
    surgeon.stderr.on('data', (data) => console.error(`[Surgeon Error] ${data}`));
}
