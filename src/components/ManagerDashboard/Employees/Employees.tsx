import React, { useState, useMemo } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  X,
  Save,
  Search,
  RefreshCw,
  Users,
  Shield,
  Loader2,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import NewEmployee from "./NewEmployee";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "@/redux/features/auth/userApi";
import { IUser } from "@/redux/features/auth/userType";
import { useAppSelector } from "@/redux/hooks/redux-hook";

const roleStyles: Record<string, { bg: string; text: string; border: string }> = {
  supervisor: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  manager: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  server: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  kitchen: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  cashier: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
};

const getRoleStyle = (role?: string) => {
  const normalized = (role || "").toLowerCase();
  return roleStyles[normalized] || {
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  };
};

const Employees: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentRole = (currentUser?.role || currentUser?.systemRole || "").toLowerCase();
  const isCurrentUserManager = currentRole === "manager";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<IUser | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // RTK Query hooks
  const {
    data: employees = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetEmployeesQuery({
    search: searchQuery || undefined,
    role: selectedRole === "ALL" ? undefined : selectedRole.toLowerCase(),
  });

  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("server");
  const [editPin, setEditPin] = useState("");
  const [editIsActive, setEditIsActive] = useState<boolean>(true);

  const openEditModal = (emp: IUser) => {
    const isTargetSupervisor =
      (emp.role || emp.systemRole || "").toLowerCase() === "supervisor";

    if (isCurrentUserManager && isTargetSupervisor) {
      toast.error("Managers are not permitted to edit Supervisor accounts.");
      return;
    }

    setEditingEmployee(emp);
    setEditName(emp.name || "");
    setEditEmail(emp.email || "");
    setEditRole((emp.role || "server").toLowerCase());
    setEditPin(emp.pin || "");
    setEditIsActive(emp.isActive ?? true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    const isTargetSupervisor =
      (editingEmployee.role || editingEmployee.systemRole || "").toLowerCase() === "supervisor";

    if (isCurrentUserManager && isTargetSupervisor) {
      toast.error("Managers are not permitted to edit Supervisor accounts.");
      setEditingEmployee(null);
      return;
    }

    if (isCurrentUserManager && editRole.toLowerCase() === "supervisor") {
      toast.error("Managers cannot assign the Supervisor role.");
      return;
    }

    if (!editName.trim()) {
      toast.error("Employee name is required");
      return;
    }

    if (editPin && editPin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    try {
      await updateEmployee({
        id: editingEmployee.id,
        body: {
          name: editName.trim(),
          role: editRole.toLowerCase(),
          email: editEmail.trim() || undefined,
          pin: editPin || undefined,
          isActive: editIsActive,
        },
      }).unwrap();

      toast.success(`Profile for "${editName}" updated successfully!`);
      setEditingEmployee(null);
      refetch();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to update employee profile";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  const handleDeleteEmployee = async (id: string, name: string) => {
    const targetEmp = employees.find((e) => e.id === id);
    const isTargetSupervisor =
      (targetEmp?.role || targetEmp?.systemRole || "").toLowerCase() === "supervisor";

    if (isCurrentUserManager && isTargetSupervisor) {
      toast.error("Managers are not permitted to delete Supervisor accounts.");
      setDeleteConfirmId(null);
      return;
    }

    try {
      await deleteEmployee(id).unwrap();
      toast.success(`Employee "${name}" deleted successfully`);
      setDeleteConfirmId(null);
      refetch();
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.error || "Failed to delete employee";
      toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
    }
  };

  // KPI Metrics calculation
  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.isActive !== false).length;
    const managers = employees.filter(
      (e) => (e.role || "").toLowerCase() === "manager"
    ).length;
    const staff = total - managers;
    return { total, active, managers, staff };
  }, [employees]);

  return (
    <div className="w-full space-y-6">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Restaurant Staff & Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Employees Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your restaurant staff profiles, POS quick-login PINs, and
            system access roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#131b2e] hover:bg-[#1a243d] border border-[#1F2E4D] rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => setShowNewEmployeeForm(!showNewEmployeeForm)}
            className="px-5 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm cursor-pointer flex items-center gap-2"
          >
            {showNewEmployeeForm ? (
              <>
                <X className="w-4 h-4" />
                <span>Close Form</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Employee</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Employees
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {metrics.total}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">
              Active / Ready
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {metrics.active}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
              Managers
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {metrics.managers}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block">
              Floor Staff
            </span>
            <span className="text-2xl font-bold text-white mt-1 block">
              {metrics.staff}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* New Employee Form Box */}
      {showNewEmployeeForm && (
        <NewEmployee
          onClose={() => setShowNewEmployeeForm(false)}
          onSuccess={() => {
            setShowNewEmployeeForm(false);
            refetch();
          }}
        />
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#131b2e] border border-[#1F2E4D] rounded-xl overflow-x-auto">
          {["ALL", "Manager", "Server", "Kitchen", "Cashier"].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setSelectedRole(role)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${selectedRole === role
                  ? "bg-[#052350] text-blue-400 border border-blue-500/40 shadow-sm"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {role === "ALL" ? "All Roles" : role}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[300px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#131b2e] border border-[#1F2E4D] focus:border-blue-500 focus:outline-none rounded-xl pl-9.5 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-slate-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-[#131b2e] rounded-2xl p-5 border border-[#1F2E4D] animate-pulse space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-full bg-slate-800" />
                <div className="w-16 h-5 rounded-full bg-slate-800" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-4 bg-slate-800 rounded" />
                <div className="w-1/2 h-3 bg-slate-800 rounded" />
              </div>
              <div className="pt-3 border-t border-[#1F2E4D]/40 flex justify-between">
                <div className="w-8 h-8 bg-slate-800 rounded-xl" />
                <div className="w-24 h-8 bg-slate-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : employees.length === 0 ? (
        /* Empty State */
        <div className="bg-[#131b2e] border border-[#1F2E4D] rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1a243d] border border-[#1F2E4D] flex items-center justify-center text-slate-400">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Employees Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedRole !== "ALL"
                ? "No employee records match your search query or role filter."
                : "Your restaurant does not have any employees registered yet."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewEmployeeForm(true)}
            className="px-5 py-2.5 bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Employee</span>
          </button>
        </div>
      ) : (
        /* Employees Card Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {employees.map((emp) => {
            const roleStyle = getRoleStyle(emp.role);
            const avatarUrl =
              emp.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                emp.name || emp.id
              )}`;

            const pinDisplay = emp.pin || emp.accessPin || "1234";

            return (
              <div
                key={emp.id}
                className="group bg-[#131b2e] rounded-2xl p-5 border border-[#1F2E4D] shadow-sm hover:border-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Avatar & Role Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={avatarUrl}
                      alt={emp.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#1F2E4D] bg-[#0b101d] shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                          emp.name || "avatar"
                        )}`;
                      }}
                    />
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                      >
                        {emp.role}
                      </span>
                      {emp.isActive === false ? (
                        <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          Pending Approval
                        </span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Info: Name, Email & Department */}
                  <div className="space-y-1 mb-4">
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {emp.email || "No email assigned"}
                    </p>
                    {emp.department && (
                      <p className="text-[11px] text-slate-500 truncate">
                        {emp.department}
                      </p>
                    )}
                  </div>

                  {/* PIN & Login status */}
                  <div className="bg-[#0b101d] border border-[#1F2E4D] rounded-xl px-3 py-2 flex items-center justify-between mb-4">
                    <span className="text-[11px] text-slate-400 font-medium">
                      POS PIN:
                    </span>
                    <span className="font-mono text-xs font-bold text-emerald-400 tracking-wider">
                      {pinDisplay.startsWith("PIN:") ? pinDisplay : `PIN: ${pinDisplay}`}
                    </span>
                  </div>
                </div>

                {/* Card Bottom: Delete & Edit Profile */}
                <div className="flex items-center justify-between pt-3 border-t border-[#1F2E4D]/60">
                  {isCurrentUserManager &&
                    ((emp.role || emp.systemRole || "").toLowerCase() === "supervisor") ? (
                    <div className="w-full flex items-center justify-between py-1.5 px-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
                      <span className="flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Supervisor Protected</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">View Only</span>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(emp.id)}
                        title="Delete Employee"
                        className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors cursor-pointer border border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => openEditModal(emp)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#052350] hover:bg-[#041a3d] border border-blue-500/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                        <span>Edit Profile</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl p-6 max-w-sm w-full border border-[#1F2E4D] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">
                Delete Employee Profile?
              </h3>
              <p className="text-xs text-slate-400">
                This action is permanent and will remove access for this employee
                from your restaurant.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const emp = employees.find((e) => e.id === deleteConfirmId);
                  handleDeleteEmployee(deleteConfirmId, emp?.name || "Employee");
                }}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl p-6 sm:p-7 max-w-lg w-full border border-[#1F2E4D] shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Edit Profile: {editingEmployee.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                disabled={isUpdating}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a243b] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Employee Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="employee@restaurant.com"
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    System Role *
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 capitalize"
                  >
                    <option value="manager" className="bg-[#131b2e]">Manager</option>
                    <option value="server" className="bg-[#131b2e]">Server</option>
                    <option value="kitchen" className="bg-[#131b2e]">Kitchen</option>
                    <option value="cashier" className="bg-[#131b2e]">Cashier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    4-Digit POS PIN
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={editPin}
                    onChange={(e) =>
                      setEditPin(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="1234"
                    className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 font-mono tracking-widest font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Account Status
                </label>
                <select
                  value={editIsActive ? "active" : "inactive"}
                  onChange={(e) => setEditIsActive(e.target.value === "active")}
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="active" className="bg-[#131b2e]">
                    Active (Can Login)
                  </option>
                  <option value="inactive" className="bg-[#131b2e]">
                    Inactive / Suspended
                  </option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]/60">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl border border-[#1F2E4D] bg-[#1a243d] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-[#052350] hover:bg-[#041a3d] border border-blue-500/40 text-white text-xs font-semibold flex items-center gap-2 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
