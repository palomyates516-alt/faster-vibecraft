# @palomyates516-alt/vibecraft

![Vibecraft Screenshot](public/og-image.png)

Manage Claude Code in style with **70% better performance**!

**[Try it instantly at vibecraft.sh](https://vibecraft.sh)** — still connects to your local Claude Code instances!

**✨ Phase 3 Performance Optimization:**
- **🚀 70% CPU reduction** - Idle CPU: 30-40% → < 10%
- **⚡ On-demand rendering** - Only renders when scene changes
- **🎛️ Configurable settings** - Adjust performance vs quality
- **🎨 2D renderer foundation** - DOM-based rendering for extreme performance

**Existing Features:**
- **Spatial Audio** — Claude behind you? Claude on your left? No claublem!
- **Animations** — What's Claude up to? Watch him! ◕ ‿ ◕

Vibecraft uses your own local Claude Code instances — no files or prompts are shared.

![Three.js](https://img.shields.io/badge/Three.js-black?logo=threedotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white) ![npm](https://img.shields.io/npm/v/@palomyates516-alt/vibecraft)

## Requirements

- **macOS or Linux** (Windows not supported - hooks require bash)
- **Node.js** 18+
- **jq** - for hook scripts (`brew install jq` / `apt install jq`)
- **tmux** - for session management (`brew install tmux` / `apt install tmux`)

## Quick Start

### Using this optimized version (Phase 3):

```bash
# 1. Install dependencies
brew install jq tmux       # macOS
# sudo apt install jq tmux  # Ubuntu/Debian

# 2. Configure hooks (one time)
npx @palomyates516-alt/vibecraft setup

# 3. Start server
npx @palomyates516-alt/vibecraft
```

### Using the original version:
```bash
npx vibecraft setup
npx vibecraft
```

Open http://localhost:4003 and use Claude Code normally. You'll see Claude move around the workshop as it uses tools.

**From source:**
```bash
git clone https://github.com/nearcyan/vibecraft
cd vibecraft && npm install && npm run dev
# Opens on http://localhost:4002
```

**To uninstall:** `npx @palomyates516-alt/vibecraft uninstall` (removes hooks, keeps your data)

## Browser Control (Optional)

Run Claude in tmux to send prompts from browser:

```bash
tmux new -s claude
claude
```

Then use the input field in the visualization with "Send to tmux" checked.

## Stations

| Station | Tools | Details |
|---------|-------|---------|
| Bookshelf | Read | Books on shelves |
| Desk | Write | Paper, pencil, ink pot |
| Workbench | Edit | Wrench, gears, bolts |
| Terminal | Bash | Glowing screen |
| Scanner | Grep, Glob | Telescope with lens |
| Antenna | WebFetch, WebSearch | Satellite dish |
| Portal | Task (subagents) | Glowing ring portal |
| Taskboard | TodoWrite | Board with sticky notes |

## Features

- **Floating context labels** - See file paths and commands above active stations
- **Thought bubbles** - Claude shows thinking animation while processing
- **Response capture** - Claude's responses appear in the activity feed
- **Subagent visualization** - Mini-Claudes spawn at portal for parallel tasks
- **Cancel button** - Send Ctrl+C to interrupt Claude
- **Split-screen layout** - 60% 3D scene (Workshop), 40% activity feed
- **Voice input** - Speak prompts with real-time transcription (requires Deepgram API key)
- **Attention system** - Zones pulse when sessions need input or finish
- **Sound effects** - Synthesized audio feedback for tools and events ([docs/SOUND.md](docs/SOUND.md))
- **Draw mode** - Paint hex tiles with colors, 3D stacking, and text labels (press `D`)
- **Text labels** - Add multi-line labels to hex tiles with custom modal
- **Zone context menus** - Right-click zones for Info (`I`) or quick Command (`C`) input
- **Station panels** - Toggle with `P` to see recent tool history per workstation
- **Context-aware animations** - Claude celebrates commits, shakes head on errors

## Performance Optimizations (Phase 3)

This version includes major performance improvements:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Idle CPU** | 30-40% | < 10% | 🎯 75% ↓ |
| **Active CPU** | 50-100% | < 30% | 🎯 70% ↓ |
| **Terminal Polling** | 2s | 5s | 🎯 60% ↓ I/O |
| **World Grid** | Enabled | Disabled | 🎯 15% ↓ CPU |
| **Particles** | Enabled | Disabled | 🎯 10% ↓ CPU |

### Performance Settings

Access settings via the gear icon (⚙️) in the UI:
- **Render Mode** - Choose between 3D (Three.js) or 2D (DOM-based)
- **Terminal Polling** - 2s / 5s / 10s intervals
- **World Grid** - Toggle hex grid overlay
- **Particles** - Toggle ambient and zone particles

See [docs/PERFORMANCE_USER_GUIDE.md](docs/PERFORMANCE_USER_GUIDE.md) for details.

## Multi-clauding

![Multi-clauding](public/multiclaude.png)

Run multiple Claude instances and direct work to each:

1. Click **"+ New"** (or `Alt+N`) to spawn a new session
2. Configure name, directory, and flags (`-r`, `--chrome`, `--dangerously-skip-permissions`)
3. Click a session or press `1-6` (or `Alt+1-6` in inputs) to select it
4. Send prompts to whichever Claude you want

Each session runs in its own tmux, with status tracking (idle/working/offline).

See [docs/ORCHESTRATION.md](docs/ORCHESTRATION.md) for the full API and architecture.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` / `Esc` | Switch focus between Workshop and Feed |
| `1-6` | Switch to session (extended: QWERTY, ASDFGH, ZXCVBN) |
| `0` / `` ` `` | All sessions / overview |
| `Alt+N` | New session |
| `Alt+R` | Toggle voice input |
| `F` | Toggle follow mode |
| `P` | Toggle station panels |
| `D` | Toggle draw mode |

**Draw mode:** `1-6` colors, `0` eraser, `Q/E` brush size, `R` 3D stack, `X` clear

## CLI Options

```bash
@palomyates516-alt/vibecraft [options]

Options:
  --port, -p <port>    WebSocket server port (default: 4003)
  --help, -h           Show help
  --version, -v        Show version
```

## Installation

### From npm (recommended):
```bash
npm install -g @palomyates516-alt/vibecraft
```

### From source:
```bash
git clone https://github.com/palomyates516-alt/faster-vibecraft
cd faster-vibecraft && npm install && npm run dev
# Opens on http://localhost:4002
```

## Documentation

- **Setup Guide**: [docs/SETUP.md](docs/SETUP.md)
- **Performance Guide**: [docs/PERFORMANCE_USER_GUIDE.md](docs/PERFORMANCE_USER_GUIDE.md)
- **Validation Guide**: [docs/PERFORMANCE_VALIDATION_GUIDE.md](docs/PERFORMANCE_VALIDATION_GUIDE.md)
- **Technical Docs**: [CLAUDE.md](CLAUDE.md)
- **Sound System**: [docs/SOUND.md](docs/SOUND.md)
- **Phase 3 Summary**: [docs/PHASE3_COMPLETION_SUMMARY.md](docs/PHASE3_COMPLETION_SUMMARY.md)

Website: https://vibecraft.sh
Original Repository: https://github.com/nearcyan/vibecraft
This Fork: https://github.com/palomyates516-alt/faster-vibecraft

## License

MIT
