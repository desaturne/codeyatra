import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import db from "../lib/db";
import useInventoryStore from "../store/useInventoryStore";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inventory = useLiveQuery(() => db.inventory.toArray()) || [];
  const { setItems } = useInventoryStore();

  const [form, setForm] = useState({
    name: "",
    type: "maternal",
    medicineId: "",
    quantity: "1",
  });
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedMedicine = inventory.find(
    (item) => String(item.id) === form.medicineId,
  );

  const handleMedicineChange = (e) => {
    const medicineId = e.target.value;
    setForm((f) => ({ ...f, medicineId }));

    const medicine = inventory.find((item) => String(item.id) === medicineId);
    if (medicine && medicine.stock === 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const quantity = parseInt(form.quantity, 10);
      const patientRecord = {
        name: form.name,
        type: form.type,
        medicineId: form.medicineId ? parseInt(form.medicineId, 10) : null,
        quantity: form.medicineId ? quantity : 0,
        createdAt: new Date().toISOString(),
      };

      const patientId = await db.patients.add(patientRecord);

      if (form.medicineId && selectedMedicine) {
        const newStock = Math.max(0, selectedMedicine.stock - quantity);
        await db.inventory.update(selectedMedicine.id, {
          stock: newStock,
          updatedAt: new Date().toISOString(),
        });
      }

      await db.syncQueue.add({
        operation: "POST",
        table: "patients",
        recordId: patientId,
        payload: patientRecord,
        createdAt: new Date().toISOString(),
      });

      const updatedItems = await db.inventory.toArray();
      setItems(updatedItems);
      toast.success(t("register.success"));
      navigate("/");
    } catch {
      toast.error(t("toast.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">
        {t("register.title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="patient-name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {t("register.patientName")}
          </label>
          <input
            id="patient-name"
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
          />
        </div>

        <div>
          <label
            htmlFor="patient-type"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {t("register.type")}
          </label>
          <select
            id="patient-type"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base bg-white"
          >
            <option value="maternal">{t("register.maternal")}</option>
            <option value="child">{t("register.child")}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="medicine-select"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {t("register.selectMedicine")}
          </label>
          <select
            id="medicine-select"
            value={form.medicineId}
            onChange={handleMedicineChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base bg-white"
          >
            <option value="">--</option>
            {inventory.map((item) => (
              <option key={item.id} value={String(item.id)}>
                {item.name} ({item.stock} {t("tracker.remaining")})
              </option>
            ))}
          </select>
        </div>

        {showWarning && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle size={18} className="text-red-500 shrink-0" />
            <span className="text-sm text-red-700 font-medium">
              {t("register.stockWarning")}
            </span>
          </div>
        )}

        {form.medicineId && (
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              {t("register.quantity")}
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={selectedMedicine ? selectedMedicine.stock : 999}
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({ ...f, quantity: e.target.value }))
              }
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            />
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            {t("register.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {loading ? "..." : t("register.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
