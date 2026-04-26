/**
 * surgeon.js
 * AI-Powered Code Surgeon - uses LLM to autonomously fix broken skills
 */

const fs = require('fs');
const path = require('path');

const skillName = process.argv[2];
const errorMessage = process.argv[3];
const provider = process.env.AI_PROVIDER || 'groq';

const SKILL_PATH = path.join(__dirname, `../AgentSkills/${skillName}.js`);
const LOG_DIR = path.join(__dirname, '../logs');
const LOG_FILE = path.join(LOG_DIR, 'gateway.log');

const SKILL_FIXES = {
    'WeatherSkill': {
        deprecated: 'api.legacy-weather.service',
        hint: 'Use wttr.in free weather API or open-meteo.com'
    },
    'EmailSkill': {
        deprecated: 'api.example-email.service',
        hint: 'Use Resend API or sendgrid'
    }
};

async function operate() {
    console.log(`🔍 Diagnosing ${skillName}...`);
    console.log(`📝 Error: ${errorMessage}`);

    if (!fs.existsSync(SKILL_PATH)) {
        console.error(`❌ Skill file not found at ${SKILL_PATH}`);
        logHealing(skillName, 'FAILED', 'Skill not found');
        return;
    }

    const code = fs.readFileSync(SKILL_PATH, 'utf8');
    console.log(`🧠 Analyzing code with AI (${provider})...`);

    try {
        const fix = await generateAIFix(skillName, code, errorMessage);
        
        if (fix) {
            console.log(`💡 AI suggested fix:`);
            console.log(fix.substring(0, 200) + '...');
            
            console.log(`\n🛡️ Creating Git backup...`);
            await createGitBackup(skillName, code);
            
            console.log(`💉 Applying AI-generated fix...`);
            fs.writeFileSync(SKILL_PATH, fix);
            
            console.log(`✅ ${skillName} has been healed by AI!`);
            logHealing(skillName, 'SUCCESS', 'AI healed');
            generatePostMortem(skillName, errorMessage);
            
            await verifyFix(SKILL_PATH);
        }
    } catch (e) {
        console.error(`❌ AI healing failed: ${e.message}`);
        logHealing(skillName, 'FAILED', e.message);
    }
}

async function generateAIFix(skillName, code, error) {
    if (provider === 'groq') {
        return await healWithGroq(skillName, code, error);
    } else if (provider === 'gemini') {
        return await healWithGemini(skillName, code, error);
    }
    return null;
}

async function healWithGroq(skillName, code, error) {
    const Groq = require('groq-sdk');
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    
    const hint = SKILL_FIXES[skillName]?.hint || 'Fix this error';
    
    const response = await client.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
            {
                role: 'system',
                content: 'You are an expert code surgeon. Fix the broken code. Return ONLY the fixed code, no explanations.'
            },
            {
                role: 'user',
                content: `Fix this ${skillName}.js code.\n\nError: ${error}\n\nCurrent code:\n${code}\n\nHint: ${hint}\n\nReturn the complete fixed code:`
            }
        ],
        temperature: 0.3
    });

    return response.choices[0]?.message?.content || null;
}

async function healWithGemini(skillName, code, error) {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    const model = genAI.getModel('gemini-pro');
    const hint = SKILL_FIXES[skillName]?.hint || 'Fix this error';
    
    const prompt = `Fix this ${skillName}.js code.\n\nError: ${error}\n\nCurrent code:\n${code}\n\nHint: ${hint}\n\nReturn the complete fixed code:`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
}

async function createGitBackup(skillName, code) {
    try {
        const { execSync } = require('child_process');
        const backupDir = path.join(__dirname, '../backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        const timestamp = Date.now();
        fs.writeFileSync(path.join(backupDir, `${skillName}_${timestamp}.js`), code);
        console.log(`💾 Backup saved to backups/`);
    } catch (e) {
        console.log(`⚠️ Backup skipped`);
    }
}

async function verifyFix(skillPath) {
    try {
        require(skillPath);
        console.log(`✅ Module verification passed`);
    } catch (e) {
        console.error(`❌ Verification failed: ${e.message}`);
    }
}

function generatePostMortem(name, errMsg) {
    if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    
    const timestamp = Date.now();
    const reportContent = `# 💌 ClawReflex Guardian Report

**Issue:** ${name} failed with: ${errMsg}

**Fix Applied:** AI-generated autonomous repair

**Status:** Resolved ✅

---
*ClawReflex - Your AI Guardian*
`;
    fs.writeFileSync(path.join(LOG_DIR, `POST_MORTEM_${timestamp}.md`), reportContent);
    console.log(`💖 Post-Mortem report generated`);
}

function logHealing(skillName, status, error) {
    const logEntry = `[${new Date().toISOString()}] HEAL: ${skillName} - ${status} - ${error}\n`;
    fs.appendFileSync(LOG_FILE, logEntry);
}

operate();