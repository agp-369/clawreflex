# ClawReflex

**Self-Healing Immune System for OpenClaw**

AI-powered autonomous code repair system that detects failures and uses LLM to generate real fixes.

## Overview

ClawReflex monitors your OpenClaw skills, detects when they crash due to API changes or service failures, and uses AI (Groq or Gemini) to autonomously analyze the error and generate working fixes.

## Features

- **Real-time Failure Detection** - Monitors gateway logs for CRITICAL_FAILURE patterns
- **AI-Powered Healing** - Uses Groq/Llama or Gemini to generate real code fixes
- **Git-Based Backups** - Saves code state before every heal
- **Module Verification** - Ensures fixed code loads correctly
- **Post-Mortem Reports** - Documents what was fixed

## Prerequisites

- Node.js 18+
- API key (Groq or Gemini - see below)

## Installation

```bash
npm install
```

## Setup API Key

### Option 1: Groq (Free Tier) - Recommended
1. Get free API key: https://console.groq.com
2. Copy `.env.example` to `.env`
3. Add your key:
```bash
AI_PROVIDER=groq
GROQ_API_KEY=your_key_here
```

### Option 2: Gemini (Free)
1. Get API key: https://makersuite.google.com/app/apikey
2. Add to `.env`:
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key_here
```

## Usage

```bash
# Run tests
npm test

# Start monitoring
npm start

# Or trigger healing directly
node src/surgeon.js WeatherSkill "getaddrinfo ENOTFOUND api.test"
```

## How It Works

```
[gateway.log] → [Monitor detects failure] → [Surgeon calls LLM] → [AI generates fix] → [Apply + Verify]
```

## Architecture

- `src/monitor.js` - Watches logs, triggers healing
- `src/surgeon.js` - AI-powered code repair
- `AgentSkills/` - OpenClaw skills

## License

ISC