import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

function Info() {
    const navigate = useNavigate();

    return (
        <div className="h-screen bg-[#D6CDB8] flex flex-col overflow-hidden">
            {/* Header */}
            <header className="flex items-center px-6 py-6 shrink-0 max-w-lg mx-auto w-full">
                <button
                    onClick={() => navigate("/")}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-[#5E503C] shadow-sm hover:bg-gray-50 transition-colors mr-4"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-[#3E3425] uppercase tracking-wider flex-1 text-center pr-10">
                    App Workflow
                </h1>
            </header>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-8 max-w-lg mx-auto w-full">
                <div className="bg-[#5E503C] rounded-3xl p-6 shadow-md text-[#F5F0EB]">

                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide border-b border-[#F5F0EB]/30 pb-2">
                            1. Dashboard (Home)
                        </h2>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/90">
                            The Dashboard is the central hub. It provides quick access to the main APP functions:
                            <br />• <strong>REGISTER</strong>: Enroll and track patients.
                            <br />• <strong>TRACKER</strong>: Manage your Medicine and Supplies Inventory.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide border-b border-[#F5F0EB]/30 pb-2">
                            2. Registration Module
                        </h2>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/90 mb-3">
                            Allows health workers to enroll patients. There are two primary types:
                        </p>
                        <h3 className="font-semibold text-base mb-1">Maternal Register</h3>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/80 mb-3 pl-2 border-l-2 border-[#D6CDB8]/30">
                            Tracks pregnant mothers. Captures Personal Details, Pregnancy History, Health & Risks (Weight, BP), Danger Symptoms check, and keeps track of Medicines Provided.
                        </p>
                        <h3 className="font-semibold text-base mb-1">Child Register</h3>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/80 pl-2 border-l-2 border-[#D6CDB8]/30">
                            Tracks children and newborns. Captures Birth Details, Nutrition Metrics (MUAC), Vaccination History, and Medicines Provided.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide border-b border-[#F5F0EB]/30 pb-2">
                            3. Inventory Tracker
                        </h2>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/90">
                            Ensures clinics do not run out of essential supplies.
                            <br />• <strong>View Stock</strong>: See all available medicines.
                            <br />• <strong>Add Medicine</strong>: Add newly arrived stock effortlessly.
                            <br />• <strong>Automated Stock</strong>: Providing medicines in Registration automatically deducts from your Tracker inventory.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold mb-2 uppercase tracking-wide border-b border-[#F5F0EB]/30 pb-2">
                            4. Offline Secure Sync
                        </h2>
                        <p className="text-sm leading-relaxed text-[#F5F0EB]/90">
                            AASHA is designed to work seamlessly in low-connectivity areas. All data is securely stored locally and seamlessly synced online whenever internet is available.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Info;
