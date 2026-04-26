/**
 * monitor.js
 * The "Guardian" - watches gateway logs and triggers autonomous healing when failures are detected.
 * This is the core monitoring engine of ClawReflex.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const LOG_FILE = path.join(__dirname, '../logs/gateway.log');
const LOGS_DIR = path.join(__dirname, '../logs');
const FAILURE_PATTERN = /ERROR: \[CRITICAL_FAILURE\] (\w+) failed: (.+)/;

if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

console.log('🛡️ ClawReflex Monitor is active. Watching logs...');

let lastPosition = 0;

function initialize() {
    if (fs.existsSync(LOG_FILE)) {
        const stats = fs.statSync(LOG_FILE);
        lastPosition = stats.size;
    } else {
        fs.writeFileSync(LOG_FILE, `[${new Date().toISOString()}] INFO: Gateway started.\n`);
        lastPosition = 0;
    }
}

function scanForFailures() {
    if (!fs.existsSync(LOG_FILE)) {
        return;
    }
    
    const stats = fs.statSync(LOG_FILE);
    if (stats.size < lastPosition) {
        lastPosition = 0;
    }
    
    if (stats.size > lastPosition) {
        const stream = fs.createReadStream(LOG_FILE, {
            start: lastPosition,
            encoding: 'utf8'
        });
        
        let buffer = '';
        stream.on('data', (chunk) => {
            buffer += chunk;
        });
        
        stream.on('end', () => {
            processBuffer(buffer);
        });
        
        lastPosition = stats.size;
    }
}

function processBuffer(content) {
    const lines = content.trim().split('\n');
    
    for (const line of lines) {
        const match = line.match(FAILURE_PATTERN);
        if (match) {
            const skillName = match[1];
            const errorMessage = match[2];
            
            console.log(`\n🚨 FAILURE DETECTED in ${skillName}!`);
            console.log(`📝 Error: ${errorMessage}`);
            
            triggerHealing(skillName, errorMessage);
        }
    }
}

function triggerHealing(skillName, errorMessage) {
    console.log(`🩹 Initiating autonomous healing for ${skillName}...`);
    
    const surgeon = spawn('node', [
        path.join(__dirname, 'surgeon.js'),
        skillName,
        errorMessage
    ], {
        cwd: path.join(__dirname, '..')
    });
    
    surgeon.stdout.on('data', (data) => {
        console.log(`[Surgeon] ${data}`);
    });
    
    surgeon.stderr.on('data', (data) => {
        console.error(`[Surgeon Error] ${data}`);
    });
    
    surgeon.on('close', (code) => {
        if (code === 0) {
            console.log(`✅ Healing process completed for ${skillName}`);
        } else {
            console.error(`❌ Healing process failed with code ${code}`);
        }
    });
}

initialize();

setInterval(scanForFailures, 2000);

fs.watchFile(LOG_FILE, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
        scanForFailures();
    }
});

console.log('👀 Continuous monitoring active. Press Ctrl+C to stop.');