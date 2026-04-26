/**
 * EmailSkill.js
 * An OpenClaw skill for sending emails with autonomous error handling.
 */

const axios = require('axios');

const EMAIL_API = process.env.EMAIL_API_URL || 'https://api.example-email.service/v1/send';
const API_KEY = process.env.EMAIL_API_KEY || 'demo-key';

async function sendEmail(to, subject, body) {
    console.log(`[EmailSkill] Sending email to ${to}...`);
    
    try {
        const response = await axios.post(EMAIL_API, {
            to,
            subject,
            body,
            apiKey: API_KEY
        }, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000
        });
        
        console.log(`[EmailSkill] Email sent successfully!`);
        return { success: true, messageId: response.data.messageId };
    } catch (error) {
        const errorMsg = error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' 
            ? `Connection failed to email service - ${error.code}`
            : error.response?.data?.message || error.message;
            
        console.error(`[CRITICAL_FAILURE] EmailSkill failed: ${errorMsg}`);
        throw new Error(errorMsg);
    }
}

async function sendReminderEmail(recipient, reminderText, dueDate) {
    const subject = `Reminder: ${reminderText}`;
    const body = `Don't forget! ${reminderText} is due on ${dueDate}.`;
    return sendEmail(recipient, subject, body);
}

module.exports = { sendEmail, sendReminderEmail };