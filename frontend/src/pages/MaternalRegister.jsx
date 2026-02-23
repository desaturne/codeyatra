import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import Mascot from "../components/Mascot";

const SYMPTOMS_LIST = [
  "Swelling",
  "Heavy Vaginal Bleeding",
  "Severe lower abdominal pain",
  "Severe breathing difficulty",
  "No fetal movement",
];

function MaternalRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    api.get("/inventory").then((r) => setInventoryItems(r.data)).catch(() => {});
  }, []);

  const [form, setForm] = useState({
    name: "",
    age: "",
    contactNumber: "",
    wardToleNo: "",
    husbandName: "",
    lastMenstrualPeriod: "",
    parity: "",
    pregnancyMonth: "",
    weight: "",
    bloodPressure: "",
    symptoms: [],
    medicinesProvided: [],
  });

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSymptomToggle = (symptom) => {
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(symptom)
        ? f.symptoms.filter((s) => s !== symptom)
        : [...f.symptoms, symptom],
    }));
  };

  const handleMedicineToggle = (medicineId) => {
    setForm((f) => ({
      ...f,
      medicinesProvided: f.medicinesProvided.includes(medicineId)
        ? f.medicinesProvided.filter((id) => id !== medicineId)
        : [...f.medicinesProvided, medicineId],
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
      const payload = {
        name: form.name,
        type: "maternal",
        age: form.age ? parseInt(form.age, 10) : null,
        contactNumber: form.contactNumber || null,
        wardToleNo: form.wardToleNo || null,
        husbandName: form.husbandName || null,
        lastMenstrualPeriod: form.lastMenstrualPeriod || null,
        parity: form.parity || null,
        pregnancyMonth: form.pregnancyMonth || null,
        weight: form.weight || null,
        bloodPressure: form.bloodPressure || null,
        symptoms: form.symptoms,
        medicineId: form.medicinesProvided.length > 0 ? form.medicinesProvided[0] : null,
      };
      await api.post("/patients", payload);
      toast.success(t("Successfully Registered Maternal Data"));
      navigate("/");
    } catch (err) {
      toast.error(err?.response?.data?.message || t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = form.name && form.age && form.contactNumber && form.wardToleNo;
  const isStep2Valid = true;

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
          MATERNAL<br />REGISTER
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
                      AGE
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="60"
                      value={form.age}
                      onChange={handleChange("age")}
                      placeholder="Age"
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      CONTACT NUMBER
                    </label>
                    <input
                      type="tel"
                      value={form.contactNumber}
                      onChange={handleChange("contactNumber")}
                      placeholder="+977 XXXXXXXXXX"
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      WARD/TOLE NO.
                    </label>
                    <input
                      type="number"
                      value={form.wardToleNo}
                      onChange={handleChange("wardToleNo")}
                      placeholder="Ward No."
                      required
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      HUSBAND'S NAME
                    </label>
                    <input
                      type="text"
                      value={form.husbandName}
                      onChange={handleChange("husbandName")}
                      placeholder="Name"
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
                      Last Menstrual Period
                    </label>
                    <input
                      type="date"
                      value={form.lastMenstrualPeriod}
                      onChange={handleChange("lastMenstrualPeriod")}
                      placeholder="DD/MM/YYYY"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      PARITY
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={form.parity}
                      onChange={handleChange("parity")}
                      placeholder="INPUT"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      PREGNANCY MONTH
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.pregnancyMonth}
                      onChange={handleChange("pregnancyMonth")}
                      placeholder="XX Months."
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      HEALTH & RISK
                    </label>
                    <p style={{ fontSize: "0.75rem", color: "#F5F0EB", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase" }}>
                      WEIGHT
                    </p>
                    <input
                      type="text"
                      value={form.weight}
                      onChange={handleChange("weight")}
                      placeholder="XX kg"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
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
                      disabled={!isStep2Valid}
                      style={{ flex: 1, padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: "pointer", opacity: isStep2Valid ? 1 : 0.5 }}
                    >
                      NEXT
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      BLOOD PRESSURE
                    </label>
                    <input
                      type="text"
                      value={form.bloodPressure}
                      onChange={handleChange("bloodPressure")}
                      placeholder="INPUT"
                      style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      SYMPTOMS
                    </label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {SYMPTOMS_LIST.map((symptom) => (
                        <label
                          key={symptom}
                          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                        >
                          <input
                            type="checkbox"
                            checked={form.symptoms.includes(symptom)}
                            onChange={() => handleSymptomToggle(symptom)}
                            style={{ width: "20px", height: "20px", accentColor: "#5E503C", flexShrink: 0 }}
                          />
                          <span style={{ fontSize: "0.875rem", color: "#F5F0EB" }}>{symptom}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      MEDICINES PROVIDED
                    </label>
                    {inventoryItems.length === 0 ? (
                      <p style={{ fontSize: "0.875rem", color: "#C9B99A", fontStyle: "italic" }}>
                        No medicines available in inventory.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {inventoryItems.map((medicine) => (
                          <label
                            key={medicine.id}
                            style={{ display: "flex", alignItems: "center", gap: "12px", cursor: medicine.stock > 0 ? "pointer" : "not-allowed", opacity: medicine.stock > 0 ? 1 : 0.5 }}
                          >
                            <input
                              type="checkbox"
                              checked={form.medicinesProvided.includes(medicine.id)}
                              onChange={() => handleMedicineToggle(medicine.id)}
                              disabled={medicine.stock <= 0}
                              style={{ width: "20px", height: "20px", accentColor: "#5E503C", flexShrink: 0 }}
                            />
                            <span style={{ fontSize: "0.875rem", color: "#F5F0EB" }}>
                              {medicine.name} <span style={{ color: "#C9B99A", fontSize: "0.75rem", marginLeft: "4px" }}>(Stock: {medicine.stock})</span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
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

export default MaternalRegister;
