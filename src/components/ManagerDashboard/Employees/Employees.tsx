import { useState } from "react";
import { Plus, Trash2, Edit3, X, Save, UserCheck } from "lucide-react";
import { toast } from "sonner";
import NewEmployee, { Employee, EmployeeRole } from "./NewEmployee";

const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Sarah",
    role: "Manager",
    pin: "1234",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "2",
    name: "John",
    role: "Server",
    pin: "5678",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "3",
    name: "Mick",
    role: "Kitchen",
    pin: "9012",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "4",
    name: "Olly Schroeder",
    role: "Cashier",
    pin: "3456",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "5",
    name: "Emily Watson",
    role: "Server",
    pin: "7890",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "6",
    name: "David Khan",
    role: "Manager",
    pin: "2345",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "7",
    name: "Ayaan Rahman",
    role: "Kitchen",
    pin: "6789",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "8",
    name: "Sophia Lee",
    role: "Cashier",
    pin: "0123",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "9",
    name: "Michael Brown",
    role: "Server",
    pin: "4567",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "10",
    name: "Isabella Ahmed",
    role: "Manager",
    pin: "8901",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "11",
    name: "Daniel Roy",
    role: "Kitchen",
    pin: "2345",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "12",
    name: "Emma Johnson",
    role: "Cashier",
    pin: "6789",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
];

const roleStyles: Record<EmployeeRole, { bg: string; text: string; border: string }> = {
  Manager: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  Server: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },
  Kitchen: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  Cashier: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = (newEmpData: Omit<Employee, "id">) => {
    const newEmp: Employee = {
      ...newEmpData,
      id: Date.now().toString(),
    };
    setEmployees([newEmp, ...employees]);
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
    toast.success(`Removed employee ${name}`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setEmployees(
      employees.map((emp) =>
        emp.id === editingEmployee.id ? editingEmployee : emp
      )
    );
    toast.success("Employee profile updated!");
    setEditingEmployee(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header / Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide">
              Employees Management
            </h1>
            <p className="text-xs text-slate-400">
              Total staff members: {employees.length}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowNewEmployeeForm(!showNewEmployeeForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all duration-200"
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

      {/* New Employee Form Box */}
      {showNewEmployeeForm && (
        <NewEmployee
          onAddEmployee={handleAddEmployee}
          onClose={() => setShowNewEmployeeForm(false)}
        />
      )}

      {/* Employees Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {employees.map((emp) => {
          const roleStyle = roleStyles[emp.role] || roleStyles.Cashier;

          return (
            <div
              key={emp.id}
              className="group bg-[#131b2e] rounded-2xl p-5 border border-[#1F2E4D] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Avatar & Role Badge */}
                <div className="flex items-center justify-between mb-4">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#1F2E4D] shadow-sm"
                  />
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}
                  >
                    {emp.role}
                  </span>
                </div>

                {/* Card Info: Name & PIN */}
                <div className="space-y-0.5 mb-5">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {emp.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    PIN: **** (Hidden)
                  </p>
                </div>
              </div>

              {/* Card Bottom: Delete & Edit Profile */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1F2E4D]/50">
                <button
                  type="button"
                  onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                  title="Delete Employee"
                  className="w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setEditingEmployee(emp)}
                  className="px-3 py-1.5 rounded-xl bg-[#17223b] hover:bg-[#1f2d4e] border border-[#1F2E4D] text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Employee Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-[#131b2e] rounded-2xl p-6 sm:p-7 max-w-lg w-full border border-[#1F2E4D] shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#1F2E4D]/50">
              <h3 className="text-lg font-bold text-white">
                Edit Employee Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditingEmployee(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#1a243b] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Employee Name
                </label>
                <input
                  type="text"
                  value={editingEmployee.name}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, name: e.target.value })
                  }
                  required
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  System Role
                </label>
                <select
                  value={editingEmployee.role}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      role: e.target.value as EmployeeRole,
                    })
                  }
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="Manager" className="bg-[#131b2e]">Manager</option>
                  <option value="Server" className="bg-[#131b2e]">Server</option>
                  <option value="Kitchen" className="bg-[#131b2e]">Kitchen</option>
                  <option value="Cashier" className="bg-[#131b2e]">Cashier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Quick-Login PIN (4 digits)
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={editingEmployee.pin}
                  onChange={(e) =>
                    setEditingEmployee({
                      ...editingEmployee,
                      pin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  required
                  className="w-full bg-[#0b101d] text-white border border-[#1F2E4D] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F2E4D]/50">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#1F2E4D] bg-[#1a243b] hover:bg-[#22304e] text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
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
