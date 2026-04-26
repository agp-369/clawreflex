# 🎬 Demo Video Choreography: ClawReflex

To win the "OpenClaw in Action" prompt, your video needs to be clear, fast-paced, and dramatic. Follow this 60-second script:

### 1. The Setup (0:00 - 0:10)
- **Visual:** Open a split-screen terminal or VS Code window.
- **Left Side:** The `logs/gateway.log` file (use `tail -f logs/gateway.log` if possible).
- **Right Side:** Your terminal running the monitor: `node src/monitor.js`.
- **Narration:** "This is ClawReflex, the self-healing immune system for OpenClaw. On the right, our monitor is guarding the system. On the left, we're watching the heartbeat of our agents."

### 2. The Crash (0:10 - 0:25)
- **Action:** In a THIRD small window (or a pre-written script), run the command to break the skill:
  `Add-Content -Path logs/gateway.log -Value "[2026-04-19 15:00:00] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service"`
- **Visual:** Watch the error appear in the log, and immediately see the Monitor react.
- **Narration:** "Suddenly, a skill fails. An old API from 2025 has gone offline. Usually, this means the agent is dead. But ClawReflex catches it instantly."

### 3. The Surgery (0:25 - 0:45)
- **Visual:** Focus on the Monitor's output showing: `🔍 Diagnosing`, `✨ Applying autonomous fix`, and `✅ Healed`.
- **Action:** Switch to `AgentSkills/WeatherSkill.js` to show the code has changed from the old URL to `wttr.in`.
- **Narration:** "The Surgeon agent analyzes the stack trace, identifies the dead service, and autonomously rewrites the code. It even creates a Git backup before it touches a single line."

### 4. The Emotional Hook (0:45 - 0:60)
- **Visual:** Open the newly generated `logs/POST_MORTEM_...md` file.
- **Narration:** "But here's the best part. Instead of a cold error message, I get this: a Peace of Mind report. ClawReflex tells me exactly what happened and reminds me that it has my back. No more 2 AM fire drills."

### 🏁 Technical Tips for Recording:
- **Resolution:** 1080p or 4K.
- **Font Size:** Increase your terminal/IDE font size (at least 18pt) so it's readable on mobile.
- **Speed:** If the `npm install` part is slow, edit it out. The focus should be on the **instant** detection and fix.
