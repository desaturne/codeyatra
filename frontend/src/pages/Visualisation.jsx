import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import api from "../lib/axios";

// ---------------------------------------------------------------------------
// Vaccination schedule constants
// ---------------------------------------------------------------------------

// Vaccines required at each age milestone (in days).
// For 6w/10w/14w series: all three doses must be complete → check at 14 weeks (98 days).
const VACCINATION_SCHEDULE = [
  { minDays: 0,    vaccines: ["BCG", "Hepatitis B", "OPV/HPV"] },
  { minDays: 98,   vaccines: ["Pentavalent", "OPV/HPV", "PCV", "Rotavirus"] }, // all 3 doses done by 14w
  { minDays: 273,  vaccines: ["Measles Rubella", "PCV Booster"] },              // 9 months
  { minDays: 365,  vaccines: ["Japanese Encephalitis"] },                       // 12 months
  { minDays: 456,  vaccines: ["MR (Second Dose)", "TCV"] },                     // 15 months
  { minDays: 3650, vaccines: ["HPV"] },                                          // 10 years
];

function getAgeInDays(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  return Math.floor((Date.now() - birth.getTime()) / 86400000);
}

function getRequiredVaccines(ageInDays) {
  if (ageInDays === null) return [];
  return VACCINATION_SCHEDULE
    .filter(({ minDays }) => ageInDays >= minDays)
    .flatMap(({ vaccines }) => vaccines);
}

function isChildHighRisk(child) {
  const ageInDays = getAgeInDays(child.dob);
  if (ageInDays === null) return false;
  const required = getRequiredVaccines(ageInDays);
  const given = Array.isArray(child.vaccines) ? child.vaccines : [];
  return required.some((v) => !given.includes(v));
}

function isMaternalHighRisk(patient) {
  return Array.isArray(patient.symptoms) && patient.symptoms.length > 0;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${min}`;
}

function formatChildAge(dob) {
  const days = getAgeInDays(dob);
  if (days === null) return "";
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.floor(days / 30)}m`;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  return months > 0 ? `${years}y ${months}m` : `${years}y`;
}

// ---------------------------------------------------------------------------
// Export utilities (unchanged logic from Dashboard)
// ---------------------------------------------------------------------------

function toCsvValue(value) {
  const s = value == null ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

function buildCsvRows(patients, inventoryMap) {
  const resolveMedicines = (ids) => {
    if (!Array.isArray(ids) || ids.length === 0) return "";
    return ids.map((id) => inventoryMap.get(id) || `ID:${id}`).join("; ");
  };
  const headers = [
    "id","type","name","createdAt","age","contactNumber","wardToleNo",
    "husbandName","lastMenstrualPeriod","parity","pregnancyMonth","weight",
    "bloodPressure","symptoms","dob","gender","birthWeight","muac",
    "breastfeedingStatus","vaccines","medicinesProvided",
  ];
  const rows = patients.map((p) => ({
    id: p.id ?? "",
    type: p.type ?? "",
    name: p.name ?? "",
    createdAt: formatDateTime(p.createdAt),
    age: p.age ?? "",
    contactNumber: p.contactNumber ?? "",
    wardToleNo: p.wardToleNo ?? "",
    husbandName: p.husbandName ?? "",
    lastMenstrualPeriod: formatDate(p.lastMenstrualPeriod),
    parity: p.parity ?? "",
    pregnancyMonth: p.pregnancyMonth ?? "",
    weight: p.weight ?? "",
    bloodPressure: p.bloodPressure ?? "",
    symptoms: Array.isArray(p.symptoms) ? p.symptoms.join("; ") : "",
    dob: formatDate(p.dob),
    gender: p.gender ?? "",
    birthWeight: p.birthWeight ?? "",
    muac: p.muac ?? "",
    breastfeedingStatus: p.breastfeedingStatus ?? "",
    vaccines: Array.isArray(p.vaccines) ? p.vaccines.join("; ") : "",
    medicinesProvided: resolveMedicines(p.medicinesProvided),
  }));
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((k) => toCsvValue(row[k])).join(","));
  }
  return lines.join("\n");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Table sub-component
// ---------------------------------------------------------------------------

function ScrollTable({ headers, rows, emptyMsg }) {
  return (
    <div style={{ overflowX: "auto", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.15)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 12px",
                  background: "#3E3425",
                  color: "#F5F0EB",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  whiteSpace: "nowrap",
                  borderBottom: "2px solid rgba(255,255,255,0.2)",
                  textAlign: "left",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                style={{ padding: "16px 12px", color: "#C9B99A", textAlign: "center", fontStyle: "italic" }}
              >
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={i}
                style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.04)" : "transparent" }}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      padding: "9px 12px",
                      color: "#F5F0EB",
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                      whiteSpace: j === row.length - 1 ? "normal" : "nowrap",
                      maxWidth: "220px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

function Visualisation() {
  const navigate = useNavigate();

  const [maternalHighRiskOnly, setMaternalHighRiskOnly] = useState(false);
  const [childHighRiskOnly, setChildHighRiskOnly] = useState(false);
  const [allPatients, setAllPatients] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [sendingAlerts, setSendingAlerts] = useState(false);

  useEffect(() => {
    api.get("/patients").then((r) => setAllPatients(r.data)).catch(() => toast.error("Failed to load patients"));
    api.get("/inventory").then((r) => setInventoryItems(r.data)).catch(() => toast.error("Failed to load inventory"));
  }, []);

  const inventoryMap = new Map(inventoryItems.map((item) => [item.id, item.name]));

  const maternalAll = allPatients.filter((p) => p.type === "maternal");
  const childAll = allPatients.filter((p) => p.type === "child");

  const maternalRows = (maternalHighRiskOnly ? maternalAll.filter(isMaternalHighRisk) : maternalAll).map(
    (p) => [
      p.name ?? "",
      p.age ?? "",
      p.pregnancyMonth ?? "",
      Array.isArray(p.symptoms) && p.symptoms.length > 0 ? p.symptoms.join(", ") : "—",
    ]
  );

  const childRows = (childHighRiskOnly ? childAll.filter(isChildHighRisk) : childAll).map((p) => [
    p.name ?? "",
    formatDate(p.dob),
    formatChildAge(p.dob),
    Array.isArray(p.vaccines) ? p.vaccines.length : 0,
    isChildHighRisk(p) ? "⚠ High Risk" : "✓ On Track",
  ]);

  // Calculate high-risk maternal patients
  const highRiskMaternalPatients = maternalAll.filter(isMaternalHighRisk);

  // Handler for sending high-risk alerts
  const handleSendHighRiskAlerts = async () => {
    if (highRiskMaternalPatients.length === 0) {
      toast.error("No high-risk maternal patients found");
      return;
    }

    setSendingAlerts(true);
    const loadingToast = toast.loading(`Sending alerts to ${highRiskMaternalPatients.length} high-risk patients...`);

    try {
      const response = await api.post("/patients/send-high-risk-alerts");
      const { alertsSent, alerts } = response.data;

      toast.dismiss(loadingToast);
      
      // Show success toast with count
      toast.success(
        `✅ Successfully sent ${alertsSent} alert${alertsSent !== 1 ? 's' : ''} to high-risk patients!`,
        { duration: 5000 }
      );

      // Show individual patient notifications
      if (alerts && alerts.length > 0) {
        setTimeout(() => {
          alerts.forEach((alert, index) => {
            setTimeout(() => {
              toast(
                `📱 Alert sent to ${alert.patientName}\nRisk: ${alert.riskLevel}\nSymptoms: ${alert.symptoms.join(", ")}`,
                {
                  icon: "🚨",
                  duration: 4000,
                  style: {
                    background: "#5E503C",
                    color: "#F5F0EB",
                    border: "2px solid #C9B99A",
                  },
                }
              );
            }, index * 1000); // Stagger notifications by 1 second
          });
        }, 500);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Failed to send alerts");
    } finally {
      setSendingAlerts(false);
    }
  };

  // ── Export handlers (same logic as Dashboard) ──

  const handleExportCsv = async () => {
    try {
      const patients = allPatients;
      if (patients.length === 0) { toast("No patient data to export"); return; }
      const iMap = inventoryMap;
      const csv = buildCsvRows(patients, iMap);
      downloadBlob(csv, "patients-export.csv", "text/csv;charset=utf-8;");
      toast.success("CSV downloaded");
    } catch {
      toast.error("Unable to export CSV");
    }
  };

  const handleExportPdf = async () => {
    try {
      const patients = allPatients;
      if (patients.length === 0) { toast("No patient data to export"); return; }
      const iMap = inventoryMap;

      const maternal = patients.filter((p) => p.type === "maternal");
      const child = patients.filter((p) => p.type === "child");

      const resolveMeds = (ids) => {
        if (!Array.isArray(ids) || ids.length === 0) return "";
        return ids.map((id) => iMap.get(id) || `ID:${id}`).join("; ");
      };

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFontSize(16);
      doc.text("Patient Export", pageWidth / 2, 36, { align: "center" });
      doc.setFontSize(10);
      doc.text(`Generated: ${formatDateTime(new Date())}`, 40, 54);

      let cursorY = 72;

      if (maternal.length > 0) {
        doc.setFontSize(12);
        doc.text("Maternal Patients", 40, cursorY);
        cursorY += 8;
        autoTable(doc, {
          startY: cursorY,
          head: [["Name","Age","Contact","Ward","LMP","Parity","Preg Month","Weight","BP","Symptoms","Medicines"]],
          body: maternal.map((p) => [
            p.name ?? "",
            p.age ?? "",
            p.contactNumber ?? "",
            p.wardToleNo ?? "",
            formatDate(p.lastMenstrualPeriod),
            p.parity ?? "",
            p.pregnancyMonth ?? "",
            p.weight ?? "",
            p.bloodPressure ?? "",
            Array.isArray(p.symptoms) ? p.symptoms.join(", ") : "",
            resolveMeds(p.medicinesProvided),
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [94, 80, 60] },
        });
        cursorY = doc.lastAutoTable.finalY + 24;
      } else {
        doc.setFontSize(11);
        doc.text("Maternal Patients: none", 40, cursorY);
        cursorY += 20;
      }

      if (cursorY > pageHeight - 180) { doc.addPage(); cursorY = 50; }

      if (child.length > 0) {
        doc.setFontSize(12);
        doc.text("Child Patients", 40, cursorY);
        cursorY += 8;
        autoTable(doc, {
          startY: cursorY,
          head: [["Name","DOB","Gender","Birth Weight","MUAC","Breastfeeding","Vaccines","Medicines"]],
          body: child.map((p) => [
            p.name ?? "",
            formatDate(p.dob),
            p.gender ?? "",
            p.birthWeight ?? "",
            p.muac ?? "",
            p.breastfeedingStatus ?? "",
            Array.isArray(p.vaccines) ? p.vaccines.join(", ") : "",
            resolveMeds(p.medicinesProvided),
          ]),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [94, 80, 60] },
        });
      } else {
        doc.setFontSize(11);
        doc.text("Child Patients: none", 40, cursorY);
      }

      doc.save("patients-export.pdf");
      toast.success("PDF downloaded");
    } catch {
      toast.error("Unable to export PDF");
    }
  };

  // ── Styles ──

  const filterBtnStyle = (active) => ({
    padding: "6px 14px",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    background: active ? "#F5F0EB" : "rgba(245,240,235,0.2)",
    color: active ? "#3E3425" : "#F5F0EB",
    transition: "all 0.15s",
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#D6CDB8",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px 8px 16px",
          maxWidth: "56rem",
          margin: "0 auto",
          width: "100%",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: "#fff",
            color: "#5E503C",
            border: "none",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            cursor: "pointer",
          }}
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </button>

        <img
          src="/assets/logo.png"
          alt="AASHA"
          style={{ height: "60px", width: "60px", objectFit: "contain" }}
        />
      </div>

      {/* ── Page title ── */}
      <div
        style={{
          padding: "8px 24px 20px 24px",
          maxWidth: "56rem",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#3E3425",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          VISUALISATION TABLE
        </h1>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          maxWidth: "56rem",
          margin: "0 auto",
          width: "100%",
          padding: "0 20px 32px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        {/* ════ MATERNAL TABLE ════ */}
        <div
          style={{
            background: "#5E503C",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#F5F0EB",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              Maternal Table
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C9B99A",
                }}
              >
                ({maternalAll.length} records)
              </span>
            </h2>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                style={filterBtnStyle(!maternalHighRiskOnly)}
                onClick={() => setMaternalHighRiskOnly(false)}
              >
                All
              </button>
              <button
                style={filterBtnStyle(maternalHighRiskOnly)}
                onClick={() => setMaternalHighRiskOnly(true)}
              >
                ⚠ High Risk
              </button>
            </div>
          </div>

          {/* High-risk note and alert button */}
          <div style={{ marginBottom: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <p
                style={{
                  fontSize: "0.72rem",
                  color: "#C9B99A",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                High-risk filter shows patients with one or more reported symptoms.
              </p>
              {highRiskMaternalPatients.length > 0 && (
                <button
                  onClick={handleSendHighRiskAlerts}
                  disabled={sendingAlerts}
                  style={{
                    padding: "8px 16px",
                    background: sendingAlerts ? "#7a6b54" : "#C9402A",
                    color: "#F5F0EB",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    cursor: sendingAlerts ? "not-allowed" : "pointer",
                    opacity: sendingAlerts ? 0.7 : 1,
                    boxShadow: sendingAlerts ? "none" : "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {sendingAlerts ? "Sending..." : `🚨 Send Alerts (${highRiskMaternalPatients.length})`}
                </button>
              )}
            </div>
          </div>

          <ScrollTable
            headers={["Name", "Age", "Pregnancy Month", "Symptoms"]}
            rows={maternalRows}
            emptyMsg={
              maternalHighRiskOnly
                ? "No high-risk maternal records found."
                : "No maternal records registered yet."
            }
          />
        </div>

        {/* ════ CHILD TABLE ════ */}
        <div
          style={{
            background: "#5E503C",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        >
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "#F5F0EB",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              Child Table
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#C9B99A",
                }}
              >
                ({childAll.length} records)
              </span>
            </h2>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <button
                style={filterBtnStyle(!childHighRiskOnly)}
                onClick={() => setChildHighRiskOnly(false)}
              >
                All
              </button>
              <button
                style={filterBtnStyle(childHighRiskOnly)}
                onClick={() => setChildHighRiskOnly(true)}
              >
                ⚠ Overdue Vaccines
              </button>
            </div>
          </div>

          {/* Vaccine schedule legend */}
          <div
            style={{
              fontSize: "0.72rem",
              color: "#C9B99A",
              marginBottom: "14px",
              fontStyle: "italic",
              lineHeight: 1.6,
            }}
          >
            High-risk = child has reached a vaccination milestone but the vaccine is not yet recorded.
            Schedule: Birth → BCG, Hep B, OPV &nbsp;|&nbsp; 14 wks → Pentavalent, OPV, PCV, Rotavirus (all 3 doses) &nbsp;|&nbsp;
            9 mo → MR, PCV Booster &nbsp;|&nbsp; 12 mo → JE &nbsp;|&nbsp; 15 mo → MR 2nd, TCV &nbsp;|&nbsp; 10 yr → HPV
          </div>

          <ScrollTable
            headers={["Name", "DOB", "Age", "Vaccines Given", "Status"]}
            rows={childRows}
            emptyMsg={
              childHighRiskOnly
                ? "No children with overdue vaccines found."
                : "No child records registered yet."
            }
          />
        </div>

        {/* ════ EXPORT BUTTONS ════ */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
            paddingTop: "8px",
          }}
        >
          <button
            onClick={handleExportCsv}
            style={{
              height: "44px",
              minWidth: "140px",
              padding: "0 24px",
              background: "#5E503C",
              color: "#F5F0EB",
              fontWeight: 700,
              borderRadius: "12px",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            Export CSV
          </button>
          <button
            onClick={handleExportPdf}
            style={{
              height: "44px",
              minWidth: "140px",
              padding: "0 24px",
              background: "#5E503C",
              color: "#F5F0EB",
              fontWeight: 700,
              borderRadius: "12px",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Visualisation;
