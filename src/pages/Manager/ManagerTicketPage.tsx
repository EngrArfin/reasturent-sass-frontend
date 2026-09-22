import ManagerTicket from "@/components/ManagerDashboard/ManagerTicket/ManagerTicket";

const ManagerTicketPage = () => {
  return (
    <div className="w-full space-y-6 pb-12 font-sans">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-white">
          Support & Diagnostics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Submit technical tickets, review system telemetry, and chat live with central support engineers
        </p>
      </div>

      {/* Main Ticket & Chat Component */}
      <ManagerTicket />
    </div>
  );
};

export default ManagerTicketPage;

