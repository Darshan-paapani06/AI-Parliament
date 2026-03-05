// ─────────────────────────────────────────────────────────────────────────────
//  TopBar — Navigation header with agent status indicators
// ─────────────────────────────────────────────────────────────────────────────

export default function TopBar({ agents, agentStatus, activeAgent, phase, onReset }) {
  return (
    <div style={{
      flexShrink: 0,
      padding: "12px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(2,4,10,0.95)",
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      gap: 16,
      zIndex: 10,
      position: "relative",
    }}>
      {/* Logo */}
      <div style={{ flexShrink: 0 }}>
        <div style={{
          fontSize: 16,
          fontWeight: 900,
          fontFamily: "'Orbitron', monospace",
          letterSpacing: -0.5,
          background: "linear-gradient(90deg, #ff6b35, #bf5af2, #00c8ff, #00ff88)",
          backgroundSize: "200% auto",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          animation: "shimmer 4s linear infinite",
        }}>
          PROJECT SYNAPSE
        </div>
        <div style={{
          fontSize: 8,
          color: "rgba(255,255,255,0.18)",
          fontFamily: "'Space Mono', monospace",
          letterSpacing: 2.5,
          marginTop: 2,
        }}>
          AI PARLIAMENT · MULTI-LLM DEBATE ENGINE
        </div>
      </div>

      {/* Agent Pills */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
        {agents.map((a) => {
          const isActive = activeAgent === a.id;
          const isDone = agentStatus[a.id] === "done";
          const isThinking = agentStatus[a.id] === "thinking";
          return (
            <div key={a.id} style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 20,
              background: isActive ? `${a.color}20` : "rgba(255,255,255,0.03)",
              border: `1px solid ${isActive ? a.color + "50" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.3s ease",
            }}>
              <span style={{ fontSize: 13 }}>{a.icon}</span>

              {isThinking && (
                <div style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  border: `1.5px solid ${a.color}`,
                  borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                }} />
              )}
              {isDone && !isThinking && (
                <div style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: a.color,
                  boxShadow: `0 0 5px ${a.color}`,
                }} />
              )}

              <span style={{
                fontSize: 8,
                color: isActive ? a.color : "rgba(255,255,255,0.2)",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 0.5,
                transition: "color 0.3s",
              }}>
                {a.name.split(" ")[0].toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Phase + Reset */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: phase === "running" ? "#ff6b35" : phase === "done" ? "#00ff88" : "rgba(255,255,255,0.15)",
            boxShadow: phase === "running" ? "0 0 8px #ff6b35" : phase === "done" ? "0 0 8px #00ff88" : "none",
            animation: phase === "running" ? "pulse 1s ease infinite" : "none",
          }} />
          <span style={{
            fontSize: 9,
            color: phase === "running" ? "#ff6b35" : phase === "done" ? "#00ff88" : "rgba(255,255,255,0.25)",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: 1,
          }}>
            {phase === "idle" ? "AWAITING QUERY" : phase === "running" ? "IN SESSION" : "CONCLUDED"}
          </span>
        </div>

        {phase !== "idle" && (
          <button
            onClick={onReset}
            style={{
              padding: "6px 14px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.35)",
              fontSize: 9,
              fontFamily: "'Space Mono', monospace",
              letterSpacing: 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.color = "rgba(255,255,255,0.6)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.color = "rgba(255,255,255,0.35)"; }}
          >
            NEW SESSION
          </button>
        )}
      </div>
    </div>
  );
}
