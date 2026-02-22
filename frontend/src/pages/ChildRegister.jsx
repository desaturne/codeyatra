import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import db from "../lib/db";
import Mascot from "../components/Mascot";

const VACCINES_PAGE1 = [
  "BCG",
  "Hepatitis B",
  "Pentavalent",
  "OPV/HPV",
  "Rotavirus",
  "PCV",
];

const VACCINES_PAGE2 = [
  "Measles Rubella",
  "PCV Booster",
  "Japanese Encephalitis",
  "MR (Second Dose)",
  "TCV",
  "HPV",
];

function ChildRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    birthWeight: "",
    muac: "",
    breastfeedingStatus: "",
    vaccines: [],
  });

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleVaccineToggle = (vaccine) => {
    setForm((f) => ({
      ...f,
      vaccines: f.vaccines.includes(vaccine)
        ? f.vaccines.filter((v) => v !== vaccine)
        : [...f.vaccines, vaccine],
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const record = {
        ...form,
        type: "child",
        createdAt: new Date().toISOString(),
      };

      const patientId = await db.patients.add(record);

      await db.syncQueue.add({
        operation: "POST",
        table: "patients",
        recordId: patientId,
        payload: record,
        createdAt: new Date().toISOString(),
      });

      toast.success(t("Successfully Registered"));
      navigate("/");
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.name && form.dob && form.gender;

  return (
    <div style={{ height: "100dvh", background: "#D6CDB8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px 16px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0 }}>
        <button
          onClick={() => step === 1 ? navigate(-1) : handlePrevious()}
          style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff", color: "#5E503C", border: "none", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", cursor: "pointer" }}
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

      <div style={{ display: "flex", alignItems: "center", padding: "16px 24px 20px 24px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0, gap: "8px" }}>
        <div style={{ width: "96px", height: "96px", flexShrink: 0 }}>
          <Mascot size="sm" />
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3E3425", lineHeight: 1.15, letterSpacing: "0.05em", textAlign: "center", flex: 1, paddingTop: "8px" }}>
          CHILD<br />REGISTER
        </h1>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "32rem", margin: "0 auto", width: "100%", padding: "0 20px 24px 20px" }}>
        <div style={{ flex: 1, minHeight: 0, background: "#5E503C", borderRadius: "24px", overflowY: "auto", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", msOverflowStyle: "none" }}>
          <div style={{ padding: "28px" }}>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      NAME
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Name"
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      DOB
                    </label>
                    <input
                      type="date"
                      value={form.dob}
                      onChange={handleChange("dob")}
                      placeholder="DD/MM/YYYY"
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      GENDER
                    </label>
                    <select
                      value={form.gender}
                      onChange={handleChange("gender")}
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem", appearance: "auto" }}
                    >
                      <option value="" disabled>Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      BIRTH WEIGHT
                    </label>
                    <input
                      type="number"
                      value={form.birthWeight}
                      onChange={handleChange("birthWeight")}
                      placeholder="XX  kg"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      MUAC
                    </label>
                    <input
                      type="number"
                      value={form.muac}
                      onChange={handleChange("muac")}
                      placeholder="XX cms"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStep1Valid}
                    style={{ width: "100%", padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: isStep1Valid ? "pointer" : "not-allowed", opacity: isStep1Valid ? 1 : 0.5, marginTop: "8px" }}
                  >
                    NEXT
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      BREASTFEEDING STATUS
                    </label>
                    <select
                      value={form.breastfeedingStatus}
                      onChange={handleChange("breastfeedingStatus")}
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem", appearance: "auto" }}
                    >
                      <option value="" disabled>Status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      SYMPTOMS
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {VACCINES_PAGE1.map((vaccine) => (
                        <label
                          key={vaccine}
                          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                        >
                          <input
                            type="checkbox"
                            checked={form.vaccines.includes(vaccine)}
                            onChange={() => handleVaccineToggle(vaccine)}
                            style={{ width: "20px", height: "20px", accentColor: "#5E503C", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: "0.875rem", color: "#F5F0EB" }}>{vaccine}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", paddingTop: "8px" }}>
                    <button
                      type="button"
                      onClick={handlePrevious}
                      style={{ flex: 1, padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
                    >
                      BACK
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{ flex: 1, padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer" }}
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      SYMPTOMS
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {VACCINES_PAGE2.map((vaccine) => (
                        <label
                          key={vaccine}
                          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                        >
                          <input
                            type="checkbox"
                            checked={form.vaccines.includes(vaccine)}
                            onChange={() => handleVaccineToggle(vaccine)}
                            style={{ width: "20px", height: "20px", accentColor: "#5E503C", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: "0.875rem", color: "#F5F0EB" }}>{vaccine}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{ width: "100%", padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.5 : 1, marginTop: "8px" }}
                  >
                    {loading ? "..." : "REGISTER"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChildRegister;
