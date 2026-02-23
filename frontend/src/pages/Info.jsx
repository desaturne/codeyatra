import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Mascot from "../components/Mascot";

// prettier-ignore
function Info() {
  const navigate = useNavigate();

  const sectionHeadingStyle = { fontSize: "0.8rem", fontWeight: 800, color: "#F5F0EB", textTransform: "uppercase", letterSpacing: "0.08em", borderBottom: "1px solid rgba(245,240,235,0.25)", paddingBottom: "8px", marginBottom: "12px" };
  const bodyTextStyle = { fontSize: "0.875rem", lineHeight: 1.65, color: "rgba(245,240,235,0.9)" };
  const cardStyle = { background: "rgba(0,0,0,0.15)", borderRadius: "12px", padding: "14px 16px" };
  const cardTitleStyle = { fontSize: "0.8rem", fontWeight: 700, color: "#F5F0EB", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" };
  const cardBodyStyle = { fontSize: "0.875rem", lineHeight: 1.6, color: "rgba(245,240,235,0.85)" };

  return (
    <div style={{ height: "100dvh", background: "#D6CDB8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px 16px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff", color: "#5E503C", border: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", cursor: "pointer" }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>
        <img src="/assets/logo.png" alt="AASHA" style={{ height: "60px", width: "60px", objectFit: "contain" }} />
      </div>

      <div style={{ display: "flex", alignItems: "center", padding: "16px 24px 20px 24px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0, gap: "8px" }}>
        <div style={{ width: "96px", height: "96px", flexShrink: 0 }}>
          <Mascot size="sm" />
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3E3425", lineHeight: 1.15, letterSpacing: "0.05em", textAlign: "center", flex: 1, paddingTop: "8px" }}>
          APP<br />WORKFLOW
        </h1>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "32rem", margin: "0 auto", width: "100%", padding: "0 20px 24px 20px" }}>
        <div style={{ flex: 1, minHeight: 0, background: "#5E503C", borderRadius: "24px", overflowY: "auto", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", msOverflowStyle: "none" }}>
          <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "28px" }}>

            <section>
              <h2 style={sectionHeadingStyle}>1. Dashboard</h2>
              <p style={bodyTextStyle}>
                Your home screen. Tap <strong>Register</strong> to add a new patient, or <strong>Tracker</strong> to check your medicine stock.
              </p>
            </section>

            <section>
              <h2 style={sectionHeadingStyle}>2. Register</h2>
              <p style={{ ...bodyTextStyle, marginBottom: "12px" }}>Two types of patients you can register:</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={cardStyle}>
                  <p style={cardTitleStyle}>Maternal</p>
                  <p style={cardBodyStyle}>For pregnant mothers — records personal info, pregnancy history, weight, BP, danger symptoms, and medicines given.</p>
                </div>
                <div style={cardStyle}>
                  <p style={cardTitleStyle}>Child</p>
                  <p style={cardBodyStyle}>For children and newborns — records birth details, MUAC, vaccination history, and medicines given.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 style={sectionHeadingStyle}>3. Tracker</h2>
              <p style={bodyTextStyle}>
                Keeps track of your medicine stock. Use the <strong>+</strong> button to add new stock. When you give a medicine during registration, it automatically deducts from here — so your count stays accurate without any extra work.
              </p>
            </section>

            <section>
              <h2 style={sectionHeadingStyle}>4. Works Offline</h2>
              <p style={bodyTextStyle}>
                No internet? No problem. Everything saves to your device and syncs automatically once you're back online.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
