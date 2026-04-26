# ClawReflex

Self-Healing Immune System for OpenClaw agents.

## Overview

ClawReflex is an autonomous monitoring and healing system for OpenClaw. When skills crash due to API changes or service outages, ClawReflex detects the failure and autonomously repairs code in real-time.

## Features

- Real-time log monitoring with failure pattern detection
- Autonomous code repair for broken API endpoints
- Git-based rollback for safe healing
- Module verification after fixes
- Post-Mortem reports for developers

## Installation

```bash
npm install
```

## Usage

```bash
# Run tests
npm test

# Start monitoring
npm start
```

## To Demonstrate

1. Start monitor: `npm start`
2. In another terminal, trigger failure:
   ```bash
   echo "[2026-04-26] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: ENOTFOUND" >> logs/gateway.log
   ```
3. Watch monitor detect and heal automatically

## Architecture

```
[gateway.log] → [Monitor] → [Surgeon] → [Healed Skill + Git Backup + Post-Mortem]
```

## License

ISC