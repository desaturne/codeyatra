import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import Mascot from "../components/Mascot";

function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hours}:${minutes}`;
  };

  const getInventoryMap = async () => {
    const items = await db.inventory.toArray();
    return new Map(items.map((item) => [item.id, item.name]));
  };

  const resolveMedicines = (ids, inventoryMap) => {
    if (!Array.isArray(ids) || ids.length === 0) return "";
    return ids
      .map((id) => inventoryMap.get(id) || `ID:${id}`)
      .join("; ");
  };

  const toCsvValue = (value) => {
    const stringValue = value == null ? "" : String(value);
    const escaped = stringValue.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const buildCsvRows = (patients, inventoryMap) => {
    const headers = [
      "id",
      "type",
      "name",
      "createdAt",
      "age",
      "contactNumber",
      "wardToleNo",
      "husbandName",
      "lastMenstrualPeriod",
      "parity",
      "pregnancyMonth",
      "weight",
      "bloodPressure",
      "symptoms",
      "dob",
      "gender",
      "birthWeight",
      "muac",
      "breastfeedingStatus",
      "vaccines",
      "medicinesProvided",
    ];

    const rows = patients.map((patient) => {
      const medicines = resolveMedicines(patient.medicinesProvided, inventoryMap);
      return {
        id: patient.id ?? "",
        type: patient.type ?? "",
        name: patient.name ?? "",
        createdAt: formatDateTime(patient.createdAt),
        age: patient.age ?? "",
        contactNumber: patient.contactNumber ?? "",
        wardToleNo: patient.wardToleNo ?? "",
        husbandName: patient.husbandName ?? "",
        lastMenstrualPeriod: formatDate(patient.lastMenstrualPeriod),
        parity: patient.parity ?? "",
        pregnancyMonth: patient.pregnancyMonth ?? "",
        weight: patient.weight ?? "",
        bloodPressure: patient.bloodPressure ?? "",
        symptoms: Array.isArray(patient.symptoms) ? patient.symptoms.join("; ") : "",
        dob: formatDate(patient.dob),
        gender: patient.gender ?? "",
        birthWeight: patient.birthWeight ?? "",
        muac: patient.muac ?? "",
        breastfeedingStatus: patient.breastfeedingStatus ?? "",
        vaccines: Array.isArray(patient.vaccines) ? patient.vaccines.join("; ") : "",
        medicinesProvided: medicines,
      };
    });

    const lines = [headers.join(",")];
    for (const row of rows) {
      lines.push(headers.map((key) => toCsvValue(row[key])).join(","));
    }
    return lines.join("\n");
  };

  const downloadBlob = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportCsv = async () => {
    try {
      const patients = await db.patients.toArray();
      if (patients.length === 0) {
        toast("No patient data to export");
        return;
      }
      const inventoryMap = await getInventoryMap();
      const csv = buildCsvRows(patients, inventoryMap);
      downloadBlob(csv, "patients-export.csv", "text/csv;charset=utf-8;");
      toast.success("CSV downloaded");
    } catch {
      toast.error("Unable to export CSV");
    }
  };

  const buildMaternalRows = (patients, inventoryMap) => (
    patients.map((patient) => [
      patient.name ?? "",
      patient.age ?? "",
      patient.contactNumber ?? "",
      patient.wardToleNo ?? "",
      formatDate(patient.lastMenstrualPeriod),
      patient.parity ?? "",
      patient.pregnancyMonth ?? "",
      patient.weight ?? "",
      patient.bloodPressure ?? "",
      Array.isArray(patient.symptoms) ? patient.symptoms.join(", ") : "",
      resolveMedicines(patient.medicinesProvided, inventoryMap),
    ])
  );

  const buildChildRows = (patients, inventoryMap) => (
    patients.map((patient) => [
      patient.name ?? "",
      formatDate(patient.dob),
      patient.gender ?? "",
      patient.birthWeight ?? "",
      patient.muac ?? "",
      patient.breastfeedingStatus ?? "",
      Array.isArray(patient.vaccines) ? patient.vaccines.join(", ") : "",
      resolveMedicines(patient.medicinesProvided, inventoryMap),
    ])
  );

  const handleExportPdf = async () => {
    try {
      const patients = await db.patients.toArray();
      if (patients.length === 0) {
        toast("No patient data to export");
        return;
      }
      const inventoryMap = await getInventoryMap();
      const maternal = patients.filter((patient) => patient.type === "maternal");
      const child = patients.filter((patient) => patient.type === "child");

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
          head: [[
            "Name",
            "Age",
            "Contact",
            "Ward",
            "LMP",
            "Parity",
            "Preg Month",
            "Weight",
            "BP",
            "Symptoms",
            "Medicines",
          ]],
          body: buildMaternalRows(maternal, inventoryMap),
          styles: { fontSize: 8, cellPadding: 3 },
          headStyles: { fillColor: [94, 80, 60] },
        });
        cursorY = doc.lastAutoTable.finalY + 24;
      } else {
        doc.setFontSize(11);
        doc.text("Maternal Patients: none", 40, cursorY);
        cursorY += 20;
      }

      if (cursorY > pageHeight - 180) {
        doc.addPage();
        cursorY = 50;
      }

      if (child.length > 0) {
        doc.setFontSize(12);
        doc.text("Child Patients", 40, cursorY);
        cursorY += 8;
        autoTable(doc, {
          startY: cursorY,
          head: [[
            "Name",
            "DOB",
            "Gender",
            "Birth Weight",
            "MUAC",
            "Breastfeeding",
            "Vaccines",
            "Medicines",
          ]],
          body: buildChildRows(child, inventoryMap),
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

  const handleLogout = () => {
    toast.success("You're logging out. You need to sign back in!");
    logout();
    navigate("/welcome");
  };

  return (
    <div className="h-screen bg-[#D6CDB8] flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-6 max-w-lg mx-auto w-full shrink-0">
        <img
          src="/assets/logo.png"
          alt="AASHA"
          className="h-20 w-20 object-contain"
        />
        <button
          onClick={handleLogout}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-sm hover:bg-gray-50 transition-colors"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-6">
        <div className="flex flex-col items-center w-full gap-6">
          <Mascot size="xl" variant="circle" />

          <h1 className="text-2xl font-extrabold text-[#3E3425] tracking-[0.25em] text-center uppercase">
            WELCOME HOME!
          </h1>

          <div className="w-full flex flex-col items-center gap-4 mt-4 px-2">
            <button
              onClick={() => navigate("/register")}
              className="w-60 h-12 py-4 px-20 bg-[#5E503C] text-[#F5F0EB] font-bold rounded-full text-base uppercase tracking-wider hover:bg-[#4a3f30] transition-colors"
            >
              REGISTER
            </button>
            <button
              onClick={() => navigate("/tracker")}
              className="w-60 h-12 py-4 bg-white text-[#3E3425] font-bold rounded-full text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              TRACKER
            </button>
            <button
              onClick={() => navigate("/visualisation")}
              className="w-60 h-12 py-4 bg-white text-[#3E3425] font-bold rounded-full text-base uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              VISUALISATION
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate("/info")}
        className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-lg hover:bg-gray-50 transition-colors z-50"
        aria-label="Information"
      >
        <Eye size={24} />
      </button>
    </div>
  );
}

export default Dashboard;
