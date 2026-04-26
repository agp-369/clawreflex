# ClawReflex

**Self-Healing Immune System for OpenClaw**

## What is ClawReflex?

ClawReflex is an autonomous monitoring and healing system for OpenClaw agents. When your AI skills crash due to API changes, service outages, or code rot, ClawReflex detects the failure and autonomously repairs your code in real-time.

## Features

- **Real-time Log Monitoring** - Watches gateway logs for CRITICAL_FAILURE patterns
- **Autonomous Code Surgery** - Automatically fixes broken API endpoints
- **Git-Based Rollbacks** - Creates backup commits before healing
- **Module Verification** - Ensures fixed code loads correctly
- **Peace of Mind Reports** - Generates supportive Post-Mortem notes

## Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start the monitor
npm start

# Trigger manual healing
npm run heal
```

## Project Structure

```
AgentSkills/          - OpenClaw skills (WeatherSkill, EmailSkill)
src/
  monitor.js        - Guardian that watches logs
  surgeon.js       - Heals broken skills
logs/              - Gateway logs and Post-Mortem reports
tests/             - Test suites
```

## Architecture

```
[gateway.log] → [Monitor] → [Surgeon] → [Healed Skill]
                    ↓
              [Git Backup]
              [Verification]
              [Post-Mortem Report]
```

## Tech Stack

- Node.js
- OpenClaw Framework
- axios (HTTP client)
- Mocha (testing)

## Demo

Watch the demo video following `VIDEO_GUIDE.md` to see ClawReflex in action.

## License

ISC