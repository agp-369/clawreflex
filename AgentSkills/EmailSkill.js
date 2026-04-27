/**
 * EmailSkill.js
 * An OpenClaw skill for sending emails with autonomous error handling using SendGrid.
 */

const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || 'demo-key';
const FROM_EMAIL = process.env.FROM_EMAIL || 'example@example.com';

sgMail.setApiKey(SENDGRID_API_KEY);

async function sendEmail(to, subject, body) {
    console.log(`[EmailSkill] Sending email to ${to}...`);
    
    try {
        const msg = {
            to,
            from: FROM_EMAIL,
            subject,
            text: body,
            html: body,
        };

        const response = await sgMail.send(msg);
        
        console.log(`[EmailSkill] Email sent successfully!`);
        return { success: true, messageId: response[0].headers['x-message-id'] };
    } catch (error) {
        const errorMsg = error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' 
            ? `Connection failed to email service - ${error.code}. Retrying...`
            : error.response?.body?.errors?.[0]?.message || error.message;
            
        console.error(`[CRITICAL_FAILURE] EmailSkill failed: ${errorMsg}`);
        
        // Implement retry logic with exponential backoff
        const retryCount = 3;
        const retryDelay = 500; // initial delay in milliseconds
        let retryAttempts = 0;
        
        while (retryAttempts < retryCount) {
            try {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                const response = await sgMail.send(msg);
                console.log(`[EmailSkill] Email sent successfully after retry!`);
                return { success: true, messageId: response[0].headers['x-message-id'] };
            } catch (error) {
                retryAttempts++;
                retryDelay *= 2; // exponential backoff
                console.error(`[CRITICAL_FAILURE] EmailSkill failed after retry ${retryAttempts}: ${error.message}`);
            }
        }
        
        throw new Error(errorMsg);
    }
}

async function sendReminderEmail(recipient, reminderText, dueDate) {
    const subject = `Reminder: ${reminderText}`;
    const body = `Don't forget! ${reminderText} is due on ${dueDate}.`;
    return sendEmail(recipient, subject, body);
}

module.exports = { sendEmail, sendReminderEmail };
