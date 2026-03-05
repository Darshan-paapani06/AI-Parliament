// ─────────────────────────────────────────────────────────────────────────────
//  PROJECT SYNAPSE — App.jsx
//  Main orchestrator: manages all state, runs the parliament debate
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback } from "react";
import { AGENTS } from "./agents/agents.js";
import { runParliament } from "./agents/api.js";
import TopBar from "./components/TopBar.jsx";
import AgentSeat from "./components/AgentSeat.jsx";
import SpeechCard from "./components/SpeechCard.jsx";
import VerdictCard from "./components/VerdictCard.jsx";
import InputBar from "./components/InputBar.jsx";
import EmptyState from "./components/EmptyState.jsx";

export default function App() {
  const [query, setQuery]               = useState("");
  const [phase, setPhase]               = useState("idle"); // idle | running | done
  const [speeches, setSpeeches]         = useState([]);     // array of speech objects
  const [agentStatus, setAgentStatus]   = useState({});     // { agentId: "thinking"|"done"|"idle" }
  const [activeAgent, setActiveAgent]   = useState(null);   // currently streaming agent id
  const [verdict, setVerdict]           = useState("");
  const [verdictStreaming, setVerdictStreaming] = useState(false);
  const [error, setError]               = useState(null);

  const feedRef = useRef(null);

  // Auto-scroll debate feed
  const scrollFeed = useCallback(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, []);

  // Upsert a speech in the list (add or update streaming text)
  const upsertSpeech = useCallback((agentId, text, round, streaming) => {
    setSpeeches((prev) => {
      const idx = prev.findIndex((s) => s.agentId === agentId && s.round === round);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], text, streaming };
        return updated;
      }
      return [
        ...prev,
        { agentId, text, round, streaming, id: `${agentId}-${round}-${Date.now()}` },
      ];
    });
    setTimeout(scrollFeed, 40);
  }, [scrollFeed]);

  const setStatus = useCallback((id, status) => {
    setAgentStatus((prev) => ({ ...prev, [id]: status }));
  }, []);

  // ── Start the parliament session ────────────────────────────────────────
  const convene = async () => {
    if (!query.trim() || phase === "running") return;

    setPhase("running");
    setSpeeches([]);
    setVerdict("");
    setVerdictStreaming(false);
    setAgentStatus({});
    setActiveAgent(null);
    setError(null);

    try {
      await runParliament(query.trim(), AGENTS, {
        onAgentStart: (agentId, round) => {
          setActiveAgent(agentId);
          setStatus(agentId, "thinking");
        },
        onAgentChunk: (agentId, text, round) => {
          upsertSpeech(agentId, text, round, true);
        },
        onAgentDone: (agentId, text, round) => {
          upsertSpeech(agentId, text, round, false);
          setStatus(agentId, "done");
          setActiveAgent(null);
        },
        onVerdictChunk: (text) => {
          setVerdictStreaming(true);
          setVerdict(text);
          setTimeout(scrollFeed, 40);
        },
        onVerdictDone: (text) => {
          setVerdict(text);
          setVerdictStreaming(false);
          setStatus("synthesizer", "done");
          setActiveAgent(null);
          setPhase("done");
          setTimeout(scrollFeed, 100);
        },
      });
    } catch (err) {
      console.error("Parliament error:", err);
      setError(err.message);
      setPhase("idle");
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────
  const reset = () => {
    setPhase("idle");
    setSpeeches([]);
    setVerdict("");
    setVerdictStreaming(false);
    setAgentStatus({});
    setActiveAgent(null);
    setError(null);
    setQuery("");
  };

  // ── Group speeches by round ─────────────────────────────────────────────
  const round1 = speeches.filter((s) => s.round === 1);
  const round2 = speeches.filter((s) => s.round === 2);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "#02040a",
      color: "#fff",
      overflow: "hidden",
      position: "relative",
    }}>

      {/* ── Scanline FX ── */}
      <div style={{
        position: "fixed", left: 0, right: 0, height: 1,
        pointerEvents: "none", zIndex: 999,
        background: "linear-gradient(90deg, transparent, rgba(0,255,136,0.4), transparent)",
        animation: "scanline 6s linear infinite",
      }} />

      {/* ── Grid BG ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }} />

      {/* ── TOP BAR ── */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <TopBar
          agents={AGENTS}
          agentStatus={agentStatus}
          activeAgent={activeAgent}
          phase={phase}
          onReset={reset}
        />
      </div>

      {/* ── MAIN BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* ── LEFT: CHAMBER ── */}
        <div style={{
          width: 190,
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          padding: "24px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
          background: "rgba(255,255,255,0.01)",
          overflowY: "auto",
        }}>
          <div style={{
            fontSize: 7,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.18)",
            fontFamily: "'Space Mono', monospace",
            textAlign: "center",
          }}>
            THE CHAMBER
          </div>
          {AGENTS.map((a) => (
            <AgentSeat
              key={a.id}
              agent={a}
              status={agentStatus[a.id] || "idle"}
              isActive={activeAgent === a.id}
            />
          ))}

          {/* Session stats */}
          {speeches.length > 0 && (
            <div style={{
              marginTop: "auto",
              padding: "12px 14px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 12,
            }}>
              <div style={{
                fontSize: 7,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.2)",
                fontFamily: "'Space Mono', monospace",
                marginBottom: 6,
              }}>SESSION STATS</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", fontFamily: "'Orbitron', monospace" }}>
                {speeches.length}
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", fontFamily: "'Space Mono', monospace" }}>
                ARGUMENTS
              </div>
            </div>
          )}
        </div>

        {/* ── CENTER: DEBATE FEED ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Feed scroll area */}
          <div
            ref={feedRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "28px 28px",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Empty state */}
            {phase === "idle" && speeches.length === 0 && (
              <EmptyState onSelectExample={(q) => setQuery(q)} />
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: "18px 22px",
                background: "rgba(255,55,95,0.08)",
                border: "1px solid rgba(255,55,95,0.3)",
                borderRadius: 14,
                color: "#ff375f",
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Round 1 */}
            {round1.length > 0 && (
              <div>
                <RoundDivider label="ROUND 1 — INITIAL POSITIONS" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {round1.map((s) => {
                    const agent = AGENTS.find((a) => a.id === s.agentId);
                    return agent ? (
                      <SpeechCard
                        key={s.id}
                        agent={agent}
                        text={s.text}
                        round={1}
                        isStreaming={s.streaming}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Round 2 */}
            {round2.length > 0 && (
              <div>
                <RoundDivider label="ROUND 2 — REACTIONS & COUNTER-ARGUMENTS" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {round2.map((s) => {
                    const agent = AGENTS.find((a) => a.id === s.agentId);
                    return agent ? (
                      <SpeechCard
                        key={s.id}
                        agent={agent}
                        text={s.text}
                        round={2}
                        isStreaming={s.streaming}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Verdict */}
            {(verdict || verdictStreaming) && (
              <div>
                <RoundDivider label="FINAL VERDICT — THE SYNTHESIZER" color="#00ff88" />
                <VerdictCard text={verdict} isStreaming={verdictStreaming} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <InputBar
            query={query}
            setQuery={setQuery}
            onSubmit={convene}
            isRunning={phase === "running"}
          />
        </div>

        {/* ── RIGHT: AGENT GUIDE ── */}
        <div style={{
          width: 200,
          flexShrink: 0,
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          padding: "24px 14px",
          background: "rgba(255,255,255,0.01)",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          <div style={{
            fontSize: 7,
            letterSpacing: 3,
            color: "rgba(255,255,255,0.18)",
            fontFamily: "'Space Mono', monospace",
          }}>
            AGENT ROLES
          </div>
          {AGENTS.map((a) => (
            <div key={a.id} style={{
              padding: "10px 12px",
              background: activeAgent === a.id ? `${a.color}10` : "rgba(255,255,255,0.02)",
              border: `1px solid ${activeAgent === a.id ? a.color + "35" : "rgba(255,255,255,0.05)"}`,
              borderRadius: 10,
              transition: "all 0.3s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 14 }}>{a.icon}</span>
                <span style={{
                  fontSize: 7.5,
                  color: a.color,
                  fontFamily: "'Space Mono', monospace",
                  letterSpacing: 0.8,
                }}>
                  {a.role}
                </span>
              </div>
              <div style={{
                fontSize: 10.5,
                color: "rgba(255,255,255,0.48)",
                lineHeight: 1.55,
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 6,
              }}>
                {a.shortDesc}
              </div>
              <a
                href={a.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 8,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "'Space Mono', monospace",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
                onMouseEnter={(e) => { e.target.style.color = a.color; }}
                onMouseLeave={(e) => { e.target.style.color = "rgba(255,255,255,0.2)"; }}
              >
                ↗ {a.params} · GitHub
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Round divider ─────────────────────────────────────────────────────────
function RoundDivider({ label, color = "rgba(255,255,255,0.15)" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 16px" }}>
      <div style={{ height: 1, flex: 1, background: `${color}40` }} />
      <span style={{
        fontSize: 8,
        letterSpacing: 2.5,
        fontFamily: "'Space Mono', monospace",
        color: color,
        padding: "4px 12px",
        background: `${color}10`,
        border: `1px solid ${color}30`,
        borderRadius: 20,
        whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div style={{ height: 1, flex: 1, background: `${color}40` }} />
    </div>
  );
}
