import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import Mascot from "../components/Mascot";

function getRowStatus(item) {
  const now = new Date();
  const expiry = new Date(item.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiry <= 0) return "expired";
  if (daysUntilExpiry <= 14) return "nearExpiry";
  return "normal";
}

function Tracker() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [longPressId, setLongPressId] = useState(null);
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    api.get("/inventory").then((r) => setItems(r.data)).catch(() => toast.error("Failed to load inventory"));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/inventory/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setLongPressId(null);
      toast.success("Deleted successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleStockChange = useCallback(async (id, delta) => {
    try {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const newStock = Math.max(0, item.stock + delta);
      await api.put(`/inventory/${id}`, { stock: newStock });
      setItems((prev) => prev.map((i) => i.id === id ? { ...i, stock: newStock } : i));
    } catch {
      toast.error("Something went wrong");
    }
  }, [items]);

  const startLongPress = useCallback((id) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      setLongPressId((prev) => (prev === id ? null : id));
    }, 600);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleRowClick = useCallback((id) => {
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    setLongPressId(null);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}/${m}/${day}`;
  };

  const getRowBg = (item) => {
    const status = getRowStatus(item);
    if (status === "expired") return "#F8D7DA";
    if (status === "nearExpiry") return "#FFF9C4";
    return "#9ac99bff";
  };

  const getRowColor = (item) => {
    const status = getRowStatus(item);
    if (status === "expired") return "#721C24";
    if (status === "nearExpiry") return "#856404";
    return "#3E3425";
  };

  const stockBtnStyle = {
    width: "22px",
    height: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "#5E503C",
    color: "#F5F0EB",
    border: "none",
    cursor: "pointer",
    flexShrink: 0,
    fontSize: "0.75rem",
    fontWeight: 700,
    padding: 0,
  };

  return (
    <div style={{ height: "100dvh", background: "#D6CDB8", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px 16px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0 }}>
        <button
          onClick={() => navigate("/dashboard")}
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

      <div style={{ display: "flex", alignItems: "center", padding: "20px 24px 14px 24px", maxWidth: "32rem", margin: "0 auto", width: "100%", flexShrink: 0, gap: "8px" }}>
        <div style={{ width: "120px", height: "120px", flexShrink: 0 }}>
          <Mascot size="md" height="120px" width="120px"/>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#3E3425", lineHeight: 1.15, letterSpacing: "0.05em", textAlign: "center", flex: 1, paddingTop: "8px" }}>
          TRACKER
        </h1>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", maxWidth: "32rem", margin: "0 auto", width: "100%", padding: "0 20px 24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
          <button
            onClick={() => navigate("/add")}
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#5E503C", color: "#F5F0EB", border: "none", boxShadow: "0 2px 6px rgba(0,0,0,0.15)", cursor: "pointer" }}
            aria-label="Add medicine"
          >
            <Plus size={18} />
          </button>
        </div>
        <div style={{ flex: 1, minHeight: 0, background: "#5E503C", borderRadius: "24px", overflowY: "auto", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", scrollbarWidth: "none", WebkitOverflowScrolling: "touch", msOverflowStyle: "none" }}>
          <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr>
                  <th style={{ padding: "16px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#F5F0EB", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", borderBottom: "2px solid #C9B99A", width: "34%" }}>
                    NAME
                  </th>
                  <th style={{ padding: "16px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#F5F0EB", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", borderBottom: "2px solid #C9B99A", width: "34%" }}>
                    EXPIRY DATE
                  </th>
                  <th style={{ padding: "16px 12px", fontSize: "0.8rem", fontWeight: 800, color: "#F5F0EB", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center", borderBottom: "2px solid #C9B99A", width: "32%" }}>
                    STOCK
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: "40px 16px", textAlign: "center", color: "#C9B99A", fontSize: "0.875rem" }}>
                      No medicines added yet
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isLongPressed = longPressId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onMouseDown={() => startLongPress(item.id)}
                        onMouseUp={cancelLongPress}
                        onMouseLeave={cancelLongPress}
                        onTouchStart={() => startLongPress(item.id)}
                        onTouchEnd={cancelLongPress}
                        onClick={() => handleRowClick(item.id)}
                        style={{ background: getRowBg(item), cursor: "pointer", transition: "background 0.2s ease" }}
                      >
                        <td style={{ padding: "14px 12px", fontSize: "0.85rem", fontWeight: 600, color: getRowColor(item), textAlign: "center", borderBottom: "1px solid rgba(94,80,60,0.15)" }}>
                          {isLongPressed ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, margin: "0 auto" }}
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          ) : (
                            <span>{item.name}</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 12px", fontSize: "0.85rem", fontWeight: 600, color: getRowColor(item), textAlign: "center", borderBottom: "1px solid rgba(94,80,60,0.15)" }}>
                          {formatDate(item.expiryDate)}
                        </td>
                        <td style={{ padding: "14px 6px", fontSize: "0.85rem", fontWeight: 600, color: getRowColor(item), textAlign: "center", borderBottom: "1px solid rgba(94,80,60,0.15)" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStockChange(item.id, -1); }}
                              style={stockBtnStyle}
                              aria-label="Decrease stock"
                            >
                              <Minus size={12} />
                            </button>
                            <span style={{ minWidth: "24px", textAlign: "center" }}>{item.stock}</span>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStockChange(item.id, 1); }}
                              style={stockBtnStyle}
                              aria-label="Increase stock"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracker;
