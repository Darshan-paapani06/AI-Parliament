// ─────────────────────────────────────────────────────────────────────────────
//  SpeechCard — A single agent's speech bubble in the debate feed
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";

function BlinkCursor({ color }) {
  return (
    <span style={{
      display: "inline-block",
      width: 2,
      height: "1em",
      background: color,
      marginLeft: 3,
      verticalAlign: "text-bottom",
      animation: "blink 0.7s step-end infinite",
    }} />
  );
}

export default function SpeechCard({ agent, text, round, isStreaming }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(14px)",
      transition: "all 0.4s ease",
    }}>
      {/* Avatar */}
      <div style={{ flexShrink: 0, textAlign: "center" }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: `${agent.color}18`,
          border: `1.5px solid ${agent.color}50`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          boxShadow: isStreaming ? `0 0 16px ${agent.glow}` : "none",
          transition: "box-shadow 0.3s ease",
        }}>
          {agent.icon}
        </div>
        <div style={{
          fontSize: 7,
          color: agent.color,
          fontFamily: "'Space Mono', monospace",
          marginTop: 4,
          letterSpacing: 0.8,
          maxWidth: 52,
          lineHeight: 1.3,
          wordBreak: "break-word",
        }}>
          {agent.role.replace("THE ", "")}
        </div>
      </div>

      {/* Bubble */}
      <div style={{
        flex: 1,
        background: `${agent.color}08`,
        border: `1px solid ${agent.color}28`,
        borderRadius: "4px 14px 14px 14px",
        padding: "14px 18px",
        boxShadow: isStreaming ? `0 0 22px ${agent.glow}` : "none",
        transition: "box-shadow 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            color: agent.color,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: 0.8,
          }}>
            {agent.name}
          </span>
          <span style={{
            fontSize: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: "2px 8px",
            color: "rgba(255,255,255,0.28)",
            fontFamily: "'Space Mono', monospace",
          }}>
            {round === 1 ? "INITIAL" : round === 2 ? "REACTION" : "VERDICT"}
          </span>
          <span style={{
            fontSize: 8,
            color: "rgba(255,255,255,0.15)",
            fontFamily: "'Space Mono', monospace",
            marginLeft: "auto",
          }}>
            ROUND {round}
          </span>
        </div>

        {/* Text */}
        <p style={{
          fontSize: 13.5,
          color: "rgba(255,255,255,0.78)",
          lineHeight: 1.78,
          margin: 0,
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "pre-wrap",
        }}>
          {text}
          {isStreaming && <BlinkCursor color={agent.color} />}
        </p>
      </div>
    </div>
  );
}
