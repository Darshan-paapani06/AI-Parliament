# ⚡ Project Synapse — The AI Parliament

> **The world's first multi-LLM debate engine.** Five AI agents with different cognitive styles argue any question, challenge each other's reasoning, and reach a consensus verdict with a confidence score.

![Project Synapse](https://img.shields.io/badge/Project-Synapse-ff6b35?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)
![Claude](https://img.shields.io/badge/Powered%20by-Claude%20Sonnet-cc785c?style=for-the-badge)

---

## 🧠 What Is This?

No single AI is infallible. Human civilizations figured this out millennia ago — we invented parliaments, juries, peer review, and adversarial debate precisely because **one voice is never enough**.

**Project Synapse applies this wisdom to AI for the first time.**

Ask any question. Five specialized agents — each modeled after a real open-source LLM — debate it across two structured rounds:

| Agent | Model Inspiration | Role |
|-------|------------------|------|
| 🧠 THE REASONER | DeepSeek-R1 (671B) | Step-by-step deductive logic |
| 📚 THE SCHOLAR | Qwen 2.5 (72B) | Historical analogies & cross-domain knowledge |
| ⚗️ THE VALIDATOR | WizardCoder (34B) | Empirical testing & falsifiability |
| 👹 DEVIL'S ADVOCATE | Phi-3.5 (3.8B) | Counter-arguments & hidden flaws |
| ⚖️ THE SYNTHESIZER | Mistral 7B | Final consensus + confidence score |

**Round 1** → All 4 agents give their initial positions (in parallel)  
**Round 2** → Agents read each other's arguments and react/counter  
**Final Verdict** → The Synthesizer weighs everything and delivers a Parliament ruling with 0–100% confidence  

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/project-synapse.git
cd project-synapse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your API key
```bash
cp .env.example .env
```
Open `.env` and replace `sk-ant-your-key-here` with your real key from [console.anthropic.com](https://console.anthropic.com).

```
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...your-actual-key...
```

### 4. Run it
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and ask the Parliament anything.

---

## 🏗️ Project Structure

```
project-synapse/
├── src/
│   ├── agents/
│   │   ├── agents.js        ← All 5 agent definitions & personas
│   │   └── api.js           ← Anthropic API + Parliament orchestration
│   ├── components/
│   │   ├── AgentSeat.jsx    ← Animated agent icons in left sidebar
│   │   ├── SpeechCard.jsx   ← Individual speech bubble with streaming
│   │   ├── VerdictCard.jsx  ← Final Parliament verdict display
│   │   ├── TopBar.jsx       ← Header with live agent status
│   │   ├── InputBar.jsx     ← Query input + submit
│   │   └── EmptyState.jsx   ← Welcome screen with example questions
│   ├── App.jsx              ← Main orchestrator (all state lives here)
│   ├── main.jsx             ← React entry point
│   └── index.css            ← Global styles + animations
├── public/
│   └── icon.svg
├── .env.example             ← Copy to .env and add your key
├── .gitignore               ← .env is excluded — your key stays safe
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔧 Customization

### Add your own agent
Open `src/agents/agents.js` and add a new entry to the `AGENTS` array:

```js
{
  id: "my_agent",
  name: "My Custom Agent",
  role: "THE EXPERT",
  icon: "🔭",
  color: "#ff00ff",
  glow: "rgba(255,0,255,0.4)",
  params: "13B",
  githubUrl: "https://github.com/...",
  shortDesc: "What this agent specializes in",
  persona: `You are THE EXPERT in the Synapse Parliament...
  [describe their cognitive style and rules]`,
}
```

> Note: The last agent in the array is always used as The Synthesizer.

### Change the model
In `src/agents/api.js`, update the `model` field:
```js
model: "claude-opus-4-20250514",  // or any other Claude model
```

### Change example questions
Edit the `EXAMPLE_QUESTIONS` array in `src/components/EmptyState.jsx`.

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/`. Deploy anywhere: Vercel, Netlify, Cloudflare Pages.

**Deploy to Vercel in one command:**
```bash
npx vercel --prod
```
> Remember to add `VITE_ANTHROPIC_API_KEY` as an environment variable in your hosting platform.

---

## 💡 Why This Matters

| Human System | The Problem It Solved | Synapse Equivalent |
|---|---|---|
| Jury of 12 | One judge can be biased or wrong | 5 agents with conflicting views |
| Peer review | One scientist can miss flaws | Devil's Advocate finds every flaw |
| Parliament debate | One party has blind spots | Each agent has a different architecture |
| Superforecasting | Individual experts are overconfident | Confidence score via consensus |

Research in cognitive science (Tetlock, 2015) shows that **structured, diverse groups of thinkers consistently outpredict individual experts** — even world-class ones. Synapse automates this insight.

---

## 🛣️ Roadmap

- [ ] Session history (save & replay past debates)
- [ ] Export verdict as PDF/markdown
- [ ] Custom agent builder UI
- [ ] Vote weighting per agent (based on domain)
- [ ] Public question feed (share your debates)
- [ ] API endpoint for developers

---

## 🔐 Security Note

Your API key is stored locally in `.env` and **never committed to GitHub** (it's in `.gitignore`). Never paste your key directly into source code files.

---

## 📄 License

MIT — Use it, fork it, build on it. If you ship something cool, drop a star ⭐

---

*Built with React + Vite + Claude Sonnet. Inspired by the philosophy that diversity of thought produces better truth.*
