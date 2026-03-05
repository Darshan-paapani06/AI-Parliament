// ─────────────────────────────────────────────────────────────────────────────
//  InputBar — Query input and submit button at the bottom
// ─────────────────────────────────────────────────────────────────────────────

export default function InputBar({ query, setQuery, onSubmit, isRunning }) {
  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div style={{
      flexShrink: 0,
      padding: "16px 24px 18px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(2,4,10,0.92)",
      backdropFilter: "blur(20px)",
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
        {/* Textarea */}
        <div style={{ flex: 1 }}>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask the Parliament anything... (Press Enter to convene, Shift+Enter for new line)"
            rows={2}
            disabled={isRunning}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 14,
              padding: "12px 16px",
              color: "#fff",
              fontSize: 13.5,
              resize: "none",
              lineHeight: 1.6,
              transition: "border-color 0.2s, box-shadow 0.2s",
              opacity: isRunning ? 0.5 : 1,
            }}
            onFocus={(e) => { e.target.style.borderColor = "rgba(255,107,53,0.4)"; e.target.style.boxShadow = "0 0 0 2px rgba(255,107,53,0.1)"; }}
            onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={isRunning || !query.trim()}
          style={{
            padding: "13px 26px",
            borderRadius: 14,
            border: "none",
            background: isRunning
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, #ff6b35, #bf5af2)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: 1.2,
            opacity: !query.trim() && !isRunning ? 0.4 : 1,
            transition: "all 0.25s ease",
            boxShadow: isRunning ? "none" : "0 4px 20px rgba(255,107,53,0.35), 0 1px 0 rgba(255,255,255,0.1) inset",
            minWidth: 130,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
          onMouseEnter={(e) => { if (!isRunning && query.trim()) e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
        >
          {isRunning ? (
            <>
              <div style={{
                width: 11,
                height: 11,
                border: "2px solid rgba(255,255,255,0.25)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              IN SESSION
            </>
          ) : (
            <>⚡ CONVENE</>
          )}
        </button>
      </div>

      {/* Hint */}
      <div style={{
        marginTop: 8,
        fontSize: 9,
        color: "rgba(255,255,255,0.15)",
        fontFamily: "'Space Mono', monospace",
        letterSpacing: 1.2,
      }}>
        5 AGENTS · 2 DEBATE ROUNDS · FINAL SYNTHESIS · CONFIDENCE SCORE
      </div>
    </div>
  );
}
