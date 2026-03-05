// ─────────────────────────────────────────────────────────────────────────────
//  EmptyState — Shown when no debate has started yet
// ─────────────────────────────────────────────────────────────────────────────

const EXAMPLE_QUESTIONS = [
  "Is artificial general intelligence achievable in the next 10 years?",
  "Should AI systems make autonomous decisions in healthcare?",
  "Will remote work permanently replace office culture?",
  "Is cryptocurrency the future of global finance?",
  "Can renewable energy fully replace fossil fuels by 2050?",
  "Is social media doing more harm than good to society?",
];

export default function EmptyState({ onSelectExample }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 24px",
      animation: "floatIn 0.7s ease both",
    }}>
      {/* Icon */}
      <div style={{
        fontSize: 56,
        marginBottom: 22,
        filter: "drop-shadow(0 0 30px rgba(255,107,53,0.7)) drop-shadow(0 0 60px rgba(255,107,53,0.3))",
        animation: "pulse 3s ease infinite",
      }}>
        ⚡
      </div>

      {/* Title */}
      <h2 style={{
        fontSize: 26,
        fontWeight: 900,
        fontFamily: "'Orbitron', monospace",
        color: "#fff",
        marginBottom: 12,
        letterSpacing: -0.5,
      }}>
        THE PARLIAMENT IS READY
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize: 13.5,
        color: "rgba(255,255,255,0.35)",
        maxWidth: 460,
        lineHeight: 1.75,
        marginBottom: 36,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Ask any hard question. Five AI agents — each with a different cognitive style —
        will debate it across two rounds, challenge each other's arguments, and reach
        a consensus verdict with a confidence score.
      </p>

      {/* Example questions */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        maxWidth: 520,
      }}>
        <div style={{
          fontSize: 8,
          letterSpacing: 3,
          color: "rgba(255,255,255,0.18)",
          fontFamily: "'Space Mono', monospace",
          marginBottom: 6,
        }}>
          TRY ONE OF THESE
        </div>
        {EXAMPLE_QUESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onSelectExample(q)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 10,
              padding: "11px 18px",
              color: "rgba(255,255,255,0.48)",
              fontSize: 12.5,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "left",
              lineHeight: 1.5,
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,107,53,0.35)";
              e.currentTarget.style.color = "rgba(255,255,255,0.78)";
              e.currentTarget.style.background = "rgba(255,107,53,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.48)";
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
          >
            "{q}"
          </button>
        ))}
      </div>
    </div>
  );
}
