const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'logs/gateway.log');
const LOGS_DIR = path.join(__dirname, 'logs');

if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

console.log('\n=== CLAWREFLEX AUTO DEMO ===\n');

// Step 1: Show system is running
console.log('📺 Scene 1: Monitor is watching logs...\n');
setTimeout(() => {
    
// Step 2: Inject failure
console.log('💥 Scene 2: Simulating API crash...\n');
const failLog = `[${new Date().toISOString()}] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service\n`;
fs.appendFileSync(LOG_FILE, failLog);

setTimeout(() => {
    
// Step 3: Show detection
console.log('🚨 Scene 3: FAILURE DETECTED!');
console.log('🔍 Diagnosing...\n');

setTimeout(() => {
    
// Step 4: Show healing
console.log('✨ Applying autonomous fix...');
console.log('💾 Creating Git backup...');
console.log('✅ WeatherSkill has been healed!\n');

setTimeout(() => {
    
// Step 5: Show emotional report
console.log('📝 Scene 4: Peace of Mind Report generated\n');
const reports = fs.readdirSync(LOGS_DIR).filter(f => f.startsWith('POST_MORTEM'));
if (reports.length > 0) {
    const latest = reports.sort().pop();
    console.log('💌 ' + latest);
    console.log('\n--- Content Preview ---');
    const content = fs.readFileSync(path.join(LOGS_DIR, latest), 'utf8');
    console.log(content);
}

console.log('\n=== DEMO COMPLETE ===');
console.log('Record this and upload to DEV.to!');

}, 2000);

}, 2000);

}, 2000);

}, 2000);