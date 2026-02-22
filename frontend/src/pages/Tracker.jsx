import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import db from "../lib/db";
import useInventoryStore from "../store/useInventoryStore";

function getStockStatus(item) {
  const now = new Date();
  const expiry = new Date(item.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (item.stock === 0 || daysUntilExpiry <= 0) return "red";
  if (item.stock < item.threshold || daysUntilExpiry <= 30) return "yellow";
  return "green";
}

function getStatusLabel(item, t) {
  const now = new Date();
  const expiry = new Date(item.expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) return t("tracker.expired");
  if (item.stock === 0) return t("tracker.outOfStock");
  if (daysUntilExpiry <= 30) return t("tracker.expiringSoon");
  if (item.stock < item.threshold) return t("tracker.lowStock");
  return null;
}

const statusColors = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-red-100 text-red-700 border-red-200",
};

const dotColors = {
  green: "bg-emerald-500",
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

function Tracker() {
  const { t } = useTranslation();
  const items = useLiveQuery(() => db.inventory.toArray()) || [];
  const { setItems } = useInventoryStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    name: "",
    stock: "",
    threshold: "",
    expiryDate: "",
  });

  const resetForm = () => {
    setForm({ name: "", stock: "", threshold: "", expiryDate: "" });
    setEditingItem(null);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      stock: String(item.stock),
      threshold: String(item.threshold),
      expiryDate: item.expiryDate,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      stock: parseInt(form.stock, 10),
      threshold: parseInt(form.threshold, 10),
      expiryDate: form.expiryDate,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingItem) {
        await db.inventory.update(editingItem.id, payload);
        await db.syncQueue.add({
          operation: "PUT",
          table: "inventory",
          recordId: editingItem.id,
          payload,
          createdAt: new Date().toISOString(),
        });
      } else {
        payload.createdAt = new Date().toISOString();
        const id = await db.inventory.add(payload);
        await db.syncQueue.add({
          operation: "POST",
          table: "inventory",
          recordId: id,
          payload,
          createdAt: new Date().toISOString(),
        });
      }

      const updatedItems = await db.inventory.toArray();
      setItems(updatedItems);
      toast.success(t("toast.savedLocally"));
      resetForm();
    } catch {
      toast.error(t("toast.error"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await db.inventory.delete(id);
      await db.syncQueue.add({
        operation: "DELETE",
        table: "inventory",
        recordId: id,
        payload: null,
        createdAt: new Date().toISOString(),
      });
      const updatedItems = await db.inventory.toArray();
      setItems(updatedItems);
      toast.success(t("toast.deletedLocally"));
    } catch {
      toast.error(t("toast.error"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {t("tracker.title")}
        </h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:bg-emerald-800 transition-colors min-h-[44px]"
        >
          <Plus size={18} />
          {t("tracker.addMedicine")}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Plus size={24} className="text-slate-400" />
          </div>
          <p className="text-slate-500">{t("tracker.noItems")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const status = getStockStatus(item);
            const label = getStatusLabel(item, t);
            return (
              <div
                key={item.id}
                className={`p-4 bg-white rounded-xl border ${statusColors[status]} shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${dotColors[status]}`}
                      />
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span>
                        {t("tracker.stock")}: {item.stock}
                      </span>
                      <span>
                        {t("tracker.threshold")}: {item.threshold}
                      </span>
                      <span>
                        {t("tracker.expiryDate")}: {item.expiryDate}
                      </span>
                    </div>
                    {label && (
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}
                      >
                        {label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2.5 rounded-lg hover:bg-slate-100 active:bg-slate-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={t("tracker.edit")}
                    >
                      <Pencil size={16} className="text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label={t("tracker.delete")}
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingItem ? t("tracker.edit") : t("tracker.addMedicine")}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 rounded-lg hover:bg-slate-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label
                  htmlFor="med-name"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("tracker.name")}
                </label>
                <input
                  id="med-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="med-stock"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("tracker.stock")}
                  </label>
                  <input
                    id="med-stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, stock: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                  />
                </div>
                <div>
                  <label
                    htmlFor="med-threshold"
                    className="block text-sm font-medium text-slate-700 mb-1"
                  >
                    {t("tracker.threshold")}
                  </label>
                  <input
                    id="med-threshold"
                    type="number"
                    min="0"
                    value={form.threshold}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, threshold: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="med-expiry"
                  className="block text-sm font-medium text-slate-700 mb-1"
                >
                  {t("tracker.expiryDate")}
                </label>
                <input
                  id="med-expiry"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiryDate: e.target.value }))
                  }
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
                >
                  {t("tracker.cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors min-h-[44px]"
                >
                  {t("tracker.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tracker;
