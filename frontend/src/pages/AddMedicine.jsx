import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import db from "../lib/db";
import useInventoryStore from "../store/useInventoryStore";
import Mascot from "../components/Mascot";

function AddMedicine() {
    const navigate = useNavigate();
    const { setItems } = useInventoryStore();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        expiryDate: "",
        stock: "",
    });

    const handleChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
    };

    const isValid = form.name && form.expiryDate && form.stock;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                stock: parseInt(form.stock, 10),
                threshold: 10,
                expiryDate: form.expiryDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const id = await db.inventory.add(payload);
            await db.syncQueue.add({
                operation: "POST",
                table: "inventory",
                recordId: id,
                payload,
                createdAt: new Date().toISOString(),
            });

            const updatedItems = await db.inventory.toArray();
            setItems(updatedItems);
            toast.success("Medicine added successfully");
            navigate("/tracker");
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: "100dvh", background: "#D6CDB8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px 16px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0 }}>
                <button
                    onClick={() => navigate("/tracker")}
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
                <div style={{ width: "120px", height: "120px", flexShrink: 0 }}>
                    <Mascot size="sm" />
                </div>
                <h1 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#3E3425", lineHeight: 1.15, letterSpacing: "0.05em", textAlign: "center", flex: 1, paddingTop: "8px" }}>
                    ADD<br />MEDICINE
                </h1>
            </div>

            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "32rem", margin: "0 auto", width: "100%", padding: "0 20px 24px 20px" }}>
                <div style={{ flex: 1, minHeight: 0, background: "#5E503C", borderRadius: "24px", overflowY: "auto", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", msOverflowStyle: "none" }}>
                    <div style={{ padding: "28px" }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        NAME
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={handleChange("name")}
                                        placeholder="Medicine Name"
                                        required
                                        style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        EXPIRY DATE
                                    </label>
                                    <input
                                        type="date"
                                        value={form.expiryDate}
                                        onChange={handleChange("expiryDate")}
                                        required
                                        style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 700, color: "#F5F0EB", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                        STOCK
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={handleChange("stock")}
                                        placeholder="Quantity"
                                        required
                                        style={{ width: "100%", padding: "12px 16px", background: "#F5F0EB", color: "#3E3425", textAlign: "center", borderRadius: "8px", border: "none", outline: "none", fontSize: "0.875rem" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!isValid || loading}
                                    style={{ width: "100%", padding: "12px", background: "#F5F0EB", color: "#3E3425", fontWeight: 700, borderRadius: "12px", fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "none", cursor: isValid && !loading ? "pointer" : "not-allowed", opacity: isValid && !loading ? 1 : 0.5, marginTop: "8px" }}
                                >
                                    {loading ? "..." : "ADD MEDICINE"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddMedicine;
