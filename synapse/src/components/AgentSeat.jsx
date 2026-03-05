// ─────────────────────────────────────────────────────────────────────────────
//  AgentSeat — The hexagonal seat in the left chamber sidebar
// ─────────────────────────────────────────────────────────────────────────────

export default function AgentSeat({ agent, status, isActive }) {
  return (
    <div style={{ textAlign: "center" }}>
      {/* Icon Box */}
      <div style={{
        width: 60,
        height: 60,
        borderRadius: 14,
        background: isActive ? `${agent.color}20` : "rgba(255,255,255,0.03)",
        border: `2px solid ${isActive ? agent.color : "rgba(255,255,255,0.08)"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 6px",
        boxShadow: isActive ? `0 0 24px ${agent.glow}, 0 0 48px ${agent.glow}` : "none",
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Spinning ring when thinking */}
        {status === "thinking" && (
          <div style={{
            position: "absolute",
            inset: -2,
            borderRadius: 14,
            border: `2px solid transparent`,
            borderTopColor: agent.color,
            animation: "spin 1s linear infinite",
          }} />
        )}

        <span style={{ fontSize: 22, position: "relative", zIndex: 1 }}>{agent.icon}</span>

        {/* Done dot */}
        {status === "done" && (
          <div style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: agent.color,
            boxShadow: `0 0 6px ${agent.color}`,
          }} />
        )}
      </div>

      {/* Role label */}
      <div style={{
        fontSize: 7,
        color: isActive ? agent.color : "rgba(255,255,255,0.25)",
        fontFamily: "'Space Mono', monospace",
        letterSpacing: 1.2,
        lineHeight: 1.4,
        transition: "color 0.3s",
        maxWidth: 80,
        margin: "0 auto 2px",
      }}>
        {agent.role}
      </div>

      {/* Model name */}
      <div style={{
        fontSize: 9,
        color: "rgba(255,255,255,0.18)",
        fontFamily: "'Space Mono', monospace",
      }}>
        {agent.name}
      </div>
    </div>
  );
}
