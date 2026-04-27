# ClawReflex Demo Script

## Pre-Recording Setup

Terminal 1 - Start Monitor:
```bash
cd C:\Users\abhis\Desktop\hackathon_place
npm start
```

Terminal 2 - Trigger Failure:
```bash
cd C:\Users\abhis\Desktop\hackathon_place
echo "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] ERROR: [CRITICAL_FAILURE] WeatherSkill failed: getaddrinfo ENOTFOUND api.legacy-weather.service" | Add-Content logs\gateway.log
```

## Recording Flow

### Scene 1: The Setup (0:00-0:10)
- Show terminal with monitor running
- Say: "This is ClawReflex - the self-healing immune system for your AI agents"

### Scene 2: The Failure (0:10-0:25)
- In Terminal 2, trigger the failure
- Say: "Let me simulate a crash - an API just went down"

### Scene 3: The Detection (0:25-0:40)
- Show monitor detecting in Terminal 1
- Say: "ClawReflex catches it instantly"

### Scene 4: The Healing (0:40-0:55)
- Show surgeon running, healing applied
- Say: "Analyzes, heals, and creates backup"

### Scene 5: The Emotional Hook (0:55-1:00)
- Open POST_MORTEM file
- Say: "Best part - it sends you a Peace of Mind note"

## Post-Recording

1. Upload video to DEV post
2. Include GitHub repo link
3. Add tags: devchallenge, openclawchallenge
4. Publish before 11:59 PM PDT