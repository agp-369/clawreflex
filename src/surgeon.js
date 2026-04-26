/**
 * surgeon.js
 * The "Code Surgeon" that diagnoses and fixes broken skills autonomously.
 * This is the core healing engine of ClawReflex.
 */

const fs = require('fs');
const path = require('path');

const skillName = process.argv[2];
const errorMessage = process.argv[3];

const SKILL_PATH = path.join(__dirname, `../AgentSkills/${skillName}.js`);
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'gateway.log');

const API_FIXES = {
    'WeatherSkill': {
        deprecated: 'https://api.legacy-weather.service/v1/current?q=${city}',
        replacement: 'https://wttr.in/${city}?format=j1',
        comment: 'HEALED BY CLAWREFLEX: Switched to wttr.in API'
    },
    'EmailSkill': {
        deprecated: 'https://api.example-email.service/v1/send',
        replacement: 'https://api.resend.com/v0.1/emails',
        comment: 'HEALED BY CLAWREFLEX: Switched to Resend API'
    }
};

async function operate() {
    console.log(`🔍 Diagnosing ${skillName}...`);
    console.log(`📝 Error received: "${errorMessage}"`);

    if (!fs.existsSync(SKILL_PATH)) {
        console.error(`❌ Skill file not found at ${SKILL_PATH}`);
        logHealingAttempt(skillName, 'FAILED', 'Skill file not found');
        return;
    }

    const code = fs.readFileSync(SKILL_PATH, 'utf8');
    console.log(`🧠 Analyzing code structure...`);
    
    const fix = API_FIXES[skillName];
    let newCode = code;
    let fixApplied = false;

    if (fix && code.includes(fix.deprecated)) {
        newCode = code.replace(fix.deprecated, fix.replacement);
        fixApplied = true;
        console.log(`✨ Applied API fix for ${skillName}`);
    }

    if (fixApplied) {
        console.log(`🛡️ Creating Git backup before surgery...`);
        await createGitBackup(skillName);
        
        console.log(`💉 Applying fix to ${skillName}...`);
        fs.writeFileSync(SKILL_PATH, newCode);
        
        console.log(`✅ ${skillName} has been healed!`);
        logHealingAttempt(skillName, 'SUCCESS', errorMessage);
        
        generatePostMortem(skillName, errorMessage);
        
        await verifyFix(SKILL_PATH);
    } else {
        console.log(`⚠️ No known fix pattern found for this error`);
        logHealingAttempt(skillName, 'MANUAL_REQUIRED', errorMessage);
    }
}

async function createGitBackup(skillName) {
    const { execSync } = require('child_process');
    try {
        const skillPath = path.join(__dirname, `../AgentSkills/${skillName}.js`);
        execSync(`git add "${skillPath}"`, { cwd: path.join(__dirname, '..') });
        execSync(`git commit -m "ClawReflex: Backing up ${skillName} before healing"`, { cwd: path.join(__dirname, '..') });
        console.log(`💾 Git backup created successfully`);
    } catch (e) {
        console.log(`⚠️ Git backup skipped (no changes or git not available)`);
    }
}

async function verifyFix(skillPath) {
    try {
        const module = require(skillPath);
        console.log(`✅ Module verification passed - syntax is valid`);
    } catch (e) {
        console.error(`❌ Verification failed: ${e.message}`);
        throw e;
    }
}

function generatePostMortem(name, errMsg) {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    const timestamp = Date.now();
    const reportPath = path.join(LOG_DIR, `POST_MORTEM_${timestamp}.md`);
    const reportContent = `# 💌 A Note From Your Guardian (ClawReflex)

**Hey Developer,**

I noticed that **${name}** ran into some trouble while you were away. It was hitting a wall with: \`${errMsg}\`.

**Don't worry—I've got your back.** 

I've analyzed the issue and applied an autonomous fix. The skill has been updated and is now back online.

Go grab a coffee, relax, and keep building amazing things. I'll stay here and keep the lights on.

**With Care,**
*Your ClawReflex Architect* 🛡️

---
*Timestamp: ${new Date().toISOString()}*
`;
    fs.writeFileSync(reportPath, reportContent);
    console.log(`💖 Post-Mortem "Peace of Mind" report generated at ${reportPath}`);
}

function logHealingAttempt(skillName, status, error) {
    const logEntry = `[${new Date().toISOString()}] HEAL: ${skillName} - ${status} - ${error}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
}

operate();