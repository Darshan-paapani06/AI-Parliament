// ─────────────────────────────────────────────────────────────────────────────
//  VerdictCard — The final parliament verdict display
// ─────────────────────────────────────────────────────────────────────────────

function BlinkCursor() {
  return (
    <span style={{
      display: "inline-block",
      width: 2,
      height: "1em",
      background: "#00ff88",
      marginLeft: 3,
      verticalAlign: "text-bottom",
      animation: "blink 0.7s step-end infinite",
    }} />
  );
}

export default function VerdictCard({ text, isStreaming }) {
  // Parse out confidence score and clean verdict text
  const confMatch = text.match(/CONFIDENCE:\s*(\d+)%/i);
  const confidence = confMatch ? parseInt(confMatch[1]) : null;

  const cleanText = text
    .replace(/PARLIAMENT VERDICT:\s*/i, "")
    .replace(/CONFIDENCE:\s*\d+%/i, "")
    .trim();

  const confColor =
    confidence === null ? "#ffd60a" :
    confidence >= 70    ? "#00ff88" :
    confidence >= 40    ? "#ffd60a" : "#ff375f";

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(0,255,136,0.07), rgba(0,200,255,0.05))",
      border: "2px solid rgba(0,255,136,0.35)",
      borderRadius: 20,
      padding: "28px 30px",
      boxShadow: "0 0 60px rgba(0,255,136,0.12), 0 0 120px rgba(0,255,136,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, #00ff88, #00c8ff, transparent)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 30 }}>⚖️</div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 10,
            letterSpacing: 4,
            color: "#00ff88",
            fontFamily: "'Space Mono', monospace",
            marginBottom: 4,
          }}>
            PARLIAMENT FINAL VERDICT
          </div>
          <div style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'Space Mono', monospace",
            letterSpacing: 1,
          }}>
            5 AGENTS · 2 DEBATE ROUNDS · CONSENSUS SYNTHESIZED
          </div>
        </div>

        {/* Confidence badge */}
        {confidence !== null && !isStreaming && (
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{
              fontSize: 34,
              fontWeight: 900,
              color: confColor,
              fontFamily: "'Orbitron', monospace",
              lineHeight: 1,
              textShadow: `0 0 20px ${confColor}`,
            }}>
              {confidence}%
            </div>
            <div style={{
              fontSize: 7,
              color: "rgba(255,255,255,0.25)",
              fontFamily: "'Space Mono', monospace",
              letterSpacing: 2,
              marginTop: 4,
            }}>
              CONFIDENCE
            </div>
          </div>
        )}
      </div>

      {/* Confidence bar */}
      {confidence !== null && !isStreaming && (
        <div style={{ marginBottom: 20 }}>
          <div style={{
            height: 4,
            background: "rgba(255,255,255,0.06)",
            borderRadius: 4,
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${confColor}, ${confColor}88)`,
              borderRadius: 4,
              boxShadow: `0 0 10px ${confColor}`,
              transition: "width 1.2s cubic-bezier(0.34,1.2,0.64,1)",
            }} />
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 5,
            fontSize: 8,
            color: "rgba(255,255,255,0.2)",
            fontFamily: "'Space Mono', monospace",
          }}>
            <span>UNCERTAIN</span>
            <span>MODERATE</span>
            <span>CONFIDENT</span>
          </div>
        </div>
      )}

      {/* Verdict text */}
      <p style={{
        fontSize: 14.5,
        color: "rgba(255,255,255,0.85)",
        lineHeight: 1.82,
        margin: 0,
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "pre-wrap",
      }}>
        {cleanText || text}
        {isStreaming && <BlinkCursor />}
      </p>
    </div>
  );
}
