// ─────────────────────────────────────────────────────────────────────────────
//  PROJECT SYNAPSE — Anthropic API Module
//  Handles streaming calls to claude-sonnet with each agent's persona
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = "https://api.anthropic.com/v1/messages";

/**
 * Calls Claude with a given system persona and user prompt.
 * Streams the response token-by-token, calling onChunk with the
 * accumulated text after each chunk arrives.
 *
 * @param {string} systemPersona  - The agent's persona (system prompt)
 * @param {string} userPrompt     - The debate prompt for this round
 * @param {function} onChunk      - Called with accumulated text as it streams
 * @returns {Promise<string>}     - Full completed response text
 */
export async function callAgent(systemPersona, userPrompt, onChunk) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "sk-ant-your-key-here") {
    throw new Error(
      "No API key found!\n\n" +
      "1. Copy .env.example to .env\n" +
      "2. Add your Anthropic API key\n" +
      "3. Restart the dev server (npm run dev)\n\n" +
      "Get your key at: https://console.anthropic.com"
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-calls": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      stream: true,
      system: systemPersona,
      messages: [
        { role: "user", content: userPrompt }
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let msg = `API Error ${response.status}`;
    try {
      const err = JSON.parse(errorText);
      msg = err?.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

    for (const line of lines) {
      try {
        const data = JSON.parse(line.slice(6));
        if (data.type === "content_block_delta" && data.delta?.text) {
          fullText += data.delta.text;
          onChunk(fullText);
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }

  return fullText;
}

/**
 * Runs the full 3-phase Parliament debate.
 *
 * Phase 1: All 4 debate agents give initial positions (parallel)
 * Phase 2: All 4 debate agents react to each other (sequential for coherence)
 * Phase 3: The Synthesizer delivers the final verdict
 *
 * @param {string} question        - The question being debated
 * @param {Array}  agents          - Array of agent objects from agents.js
 * @param {object} callbacks       - { onAgentStart, onAgentChunk, onAgentDone, onVerdictChunk, onVerdictDone }
 */
export async function runParliament(question, agents, callbacks) {
  const { onAgentStart, onAgentChunk, onAgentDone, onVerdictChunk, onVerdictDone } = callbacks;
  const debateAgents = agents.slice(0, 4);   // Reasoner, Scholar, Validator, Devil
  const synthesizer  = agents[4];            // Mistral synthesizer

  // ── ROUND 1: Initial Positions (run in parallel) ──────────────────────
  const r1Prompt = `The Parliament is convening to debate this question:\n\n"${question}"\n\nGive your initial position on this question. Stay true to your unique reasoning style and role. Be direct and take a clear stance.`;

  const r1Results = {};

  await Promise.all(
    debateAgents.map(async (agent) => {
      onAgentStart(agent.id, 1);
      let text = "";
      await callAgent(agent.persona, r1Prompt, (chunk) => {
        text = chunk;
        onAgentChunk(agent.id, chunk, 1);
      });
      r1Results[agent.id] = text;
      onAgentDone(agent.id, text, 1);
    })
  );

  // ── ROUND 2: Reactions (sequential so each agent can read prior reactions) ──
  const roundOneContext = debateAgents
    .map((a) => `${a.role} (${a.name}) argued:\n"${r1Results[a.id]}"`)
    .join("\n\n");

  const r2Prompt =
    `The Parliament has heard the initial positions on: "${question}"\n\n` +
    `Here is what your fellow Parliament members argued in Round 1:\n\n${roundOneContext}\n\n` +
    `Now give your REACTION. Directly challenge, counter, or build on what others said. ` +
    `Be specific — reference the other agents' points. Take a stronger position than before.`;

  const r2Results = {};

  for (const agent of debateAgents) {
    onAgentStart(agent.id, 2);
    let text = "";
    await callAgent(agent.persona, r2Prompt, (chunk) => {
      text = chunk;
      onAgentChunk(agent.id, chunk, 2);
    });
    r2Results[agent.id] = text;
    onAgentDone(agent.id, text, 2);
  }

  // ── FINAL: Synthesizer Verdict ────────────────────────────────────────
  const fullDebate =
    `QUESTION DEBATED: "${question}"\n\n` +
    `═══ ROUND 1 — INITIAL POSITIONS ═══\n\n` +
    debateAgents.map((a) => `${a.role} (${a.name}):\n"${r1Results[a.id]}"`).join("\n\n") +
    `\n\n═══ ROUND 2 — REACTIONS & COUNTER-ARGUMENTS ═══\n\n` +
    debateAgents.map((a) => `${a.role} (${a.name}):\n"${r2Results[a.id]}"`).join("\n\n") +
    `\n\nYou are THE SYNTHESIZER. You have witnessed the full debate. ` +
    `Now deliver the Parliament's final verdict with a confidence score.`;

  onAgentStart(synthesizer.id, 3);
  let verdictText = "";
  await callAgent(synthesizer.persona, fullDebate, (chunk) => {
    verdictText = chunk;
    onVerdictChunk(chunk);
  });
  onVerdictDone(verdictText);
}
