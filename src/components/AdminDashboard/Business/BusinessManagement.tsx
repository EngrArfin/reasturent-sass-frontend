import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaUsersCog, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import RolesManagementModal from "./RolesManagementModal";
import { CreateBusinessUserModal } from "./CreateBusinessUserModal";
import { EditBusinessUserModal } from "./EditBusinessUserModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

export interface Business {
  id: string;
  name: string;
  industry: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  subscriptionFee: number;
  lastSync: string;
  createdAt: string;
}

export interface BusinessUser {
  id: string;
  name: string;
  email: string;
  pin: string;
  role: {
    name: string;
  };
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
}

// Initial Mock Data
const initialBusinesses: Business[] = [
  {
    id: "1",
    name: "Burger Craft",
    industry: "Food & Beverage",
    status: "ACTIVE",
    subscriptionFee: 49.99,
    lastSync: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "Pizza Palazzo",
    industry: "Food & Beverage",
    status: "ACTIVE",
    subscriptionFee: 79.99,
    lastSync: new Date().toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "Sushi Zen",
    industry: "Food & Beverage",
    status: "INACTIVE",
    subscriptionFee: 99.99,
    lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initialRoles: Record<string, Role[]> = {
  "1": [
    {
      id: "r1",
      name: "manager",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r2",
      name: "server",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r3",
      name: "kitchen",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r4",
      name: "cashier",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  "2": [
    {
      id: "r5",
      name: "manager",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r6",
      name: "server",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r7",
      name: "kitchen",
      isActive: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r8",
      name: "cashier",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
  ],
  "3": [
    {
      id: "r9",
      name: "manager",
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r10",
      name: "server",
      isActive: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r11",
      name: "kitchen",
      isActive: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "r12",
      name: "cashier",
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ],
};

const initialUsers: Record<string, BusinessUser[]> = {
  "1": [
    {
      id: "u1",
      name: "Alice Johnson",
      email: "alice@burgercraft.com",
      pin: "1234",
      role: { name: "manager" },
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "u2",
      name: "Bob Smith",
      email: "bob@burgercraft.com",
      pin: "4321",
      role: { name: "server" },
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "2": [
    {
      id: "u3",
      name: "Charlie Brown",
      email: "charlie@pizzapalazzo.com",
      pin: "5678",
      role: { name: "manager" },
      status: "ACTIVE",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  "3": [],
};

const BusinessManagement = () => {
  const [businesses] = useState<Business[]>(initialBusinesses);
  const [roles, setRoles] = useState<Record<string, Role[]>>(initialRoles);
  const [users, setUsers] =
    useState<Record<string, BusinessUser[]>>(initialUsers);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BusinessUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    userId: string;
    businessId: string;
    userName: string;
  } | null>(null);
  const [selectedBusinessForUsers, setSelectedBusinessForUsers] =
    useState<Business | null>(null);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleManageRoles = (business: Business) => {
    setSelectedBusiness(business);
    setShowRolesModal(true);
  };

  const handleAddUser = (business: Business) => {
    setSelectedBusinessForUsers(business);
    setShowCreateUserModal(true);
  };

  const handleEditUser = (user: BusinessUser, business: Business) => {
    setSelectedUser(user);
    setSelectedBusinessForUsers(business);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    const { businessId, userId, userName } = userToDelete;
    const businessUsers = users[businessId] || [];
    const updated = businessUsers.filter((u) => u.id !== userId);

    setUsers({
      ...users,
      [businessId]: updated,
    });

    toast.success(`User ${userName} deleted successfully`);
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const openDeleteModal = (
    userId: string,
    businessId: string,
    userName: string,
  ) => {
    setUserToDelete({ userId, businessId, userName });
    setShowDeleteModal(true);
  };

  // Callback from Create modal
  const handleCreateUserSuccess = (data: {
    name: string;
    email: string;
    pin: string;
    role: string;
  }) => {
    if (!selectedBusinessForUsers) return;
    const businessId = selectedBusinessForUsers.id;
    const businessUsers = users[businessId] || [];
    const newUser: BusinessUser = {
      id: "u_" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      email: data.email,
      pin: data.pin,
      role: { name: data.role },
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    setUsers({
      ...users,
      [businessId]: [newUser, ...businessUsers],
    });
  };

  // Callback from Edit modal
  const handleEditUserSuccess = (data: {
    id: string;
    name: string;
    email: string;
    pin: string;
    role: string;
    status: "ACTIVE" | "INACTIVE";
  }) => {
    if (!selectedBusinessForUsers) return;
    const businessId = selectedBusinessForUsers.id;
    const businessUsers = users[businessId] || [];
    const updated = businessUsers.map((u) => {
      if (u.id === data.id) {
        return {
          ...u,
          name: data.name,
          email: data.email,
          pin: data.pin,
          role: { name: data.role },
          status: data.status,
        };
      }
      return u;
    });

    setUsers({
      ...users,
      [businessId]: updated,
    });
  };

  // Callback from Roles modal
  const handleRolesSuccess = (updatedRolesState: {
    server: boolean;
    kitchen: boolean;
    cashier: boolean;
  }) => {
    if (!selectedBusiness) return;
    const businessId = selectedBusiness.id;
    const currentRoles = roles[businessId] || [];
    const updated = currentRoles.map((r) => {
      if (r.name === "server")
        return { ...r, isActive: updatedRolesState.server };
      if (r.name === "kitchen")
        return { ...r, isActive: updatedRolesState.kitchen };
      if (r.name === "cashier")
        return { ...r, isActive: updatedRolesState.cashier };
      return r;
    });

    setRoles({
      ...roles,
      [businessId]: updated,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const getUserStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Filter and Paginate Businesses
  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const limit = 10;
  const total = filteredBusinesses.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedBusinesses = filteredBusinesses.slice(
    (page - 1) * limit,
    page * limit,
  );

  const activeBusinessUsers = selectedBusinessForUsers
    ? users[selectedBusinessForUsers.id] || []
    : [];

  return (
    <>
      <div className="p-6 rounded-3xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 w-full sm:max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by business name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-3 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#052350] bg-[#1a243d] border border-[#1F2E4D] text-white placeholder-slate-400"
              />
              <CiSearch
                onClick={handleSearch}
                className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white"
              />
            </div>
          </div>

          <div className="text-sm text-slate-400">
            Total Businesses:{" "}
            <span className="font-semibold text-white">{total}</span>
          </div>
        </div>

        {/* Businesses Table */}
        <div className="grid grid-cols-1 gap-5">
          <div className="w-full">
            <div className="w-full overflow-x-auto bg-[#131b2e] rounded-xl border border-[#1F2E4D]">
              <table className="min-w-[1000px] w-full text-sm text-slate-300">
                <thead className="border-b border-[#1F2E4D] bg-[#1a243d]">
                  <tr>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Business Name
                    </th>
                    <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold">
                      Industry
                    </th>
                    <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Subscription Fee
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Last Sync
                    </th>
                    <th className="px-6 py-4 text-left whitespace-nowrap text-slate-300 text-base font-semibold">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-center text-slate-300 text-base font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBusinesses.map((business: Business) => (
                    <tr
                      key={business.id}
                      className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition cursor-pointer"
                      onClick={() => setSelectedBusinessForUsers(business)}
                    >
                      <td className="px-6 py-5">
                        <div className="whitespace-nowrap font-semibold text-white">
                          {business.name}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="whitespace-nowrap capitalize px-2 py-1 bg-[#1a243d] rounded-full text-xs text-slate-300">
                          {business.industry}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(business.status)}`}
                        >
                          {business.status?.charAt(0).toUpperCase() +
                            business.status?.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="whitespace-nowrap font-semibold text-white">
                          ${business.subscriptionFee}
                        </span>
                        /mo
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-slate-400">
                        {formatDate(business.lastSync)}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-slate-400">
                        {formatDate(business.createdAt)}
                      </td>
                      <td
                        className="px-6 py-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleAddUser(business)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#052350] rounded-lg cursor-pointer whitespace-nowrap hover:bg-[#041a3d] border border-[#1F2E4D] transition duration-200 shadow-sm"
                            title="Add User"
                          >
                            <FaUserPlus className="text-white" />
                            <span>Add User</span>
                          </button>
                          <button
                            onClick={() => handleManageRoles(business)}
                            className="p-2 text-sm font-medium text-slate-300 bg-[#1a243d] hover:bg-[#232f4c] rounded-lg cursor-pointer transition duration-200 border border-[#1F2E4D]"
                            title="Manage Roles"
                          >
                            <FaUsersCog className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedBusinesses.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <p>No businesses found</p>
                          {searchTerm && (
                            <button
                              onClick={() => {
                                setSearchInput("");
                                setSearchTerm("");
                              }}
                              className="text-[#10B981] underline"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-6 flex items-center justify-between px-2 sm:px-4 py-3 flex-wrap gap-3">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-medium text-white">
                {paginatedBusinesses.length}
              </span>{" "}
              of <span className="font-medium text-white">{total}</span>{" "}
              businesses
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="min-w-[50px] rounded-md border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-center text-sm font-medium text-white shadow-sm">
                {page} / {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer rounded-lg border border-[#1F2E4D] bg-[#1a243d] px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-[#232f4c] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users List Section (when a business is selected for user management) */}
      {selectedBusinessForUsers && (
        <div className="mt-6 p-6 rounded-3xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Users - {selectedBusinessForUsers.name}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Manage users for this business
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBusinessForUsers(null);
                setShowCreateUserModal(false);
                setShowEditUserModal(false);
              }}
              className="px-4 py-2 text-sm text-slate-300 hover:text-white bg-[#1a243d] hover:bg-[#232f4c] rounded-lg border border-[#1F2E4D] transition cursor-pointer"
            >
              Close
            </button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto border border-[#1F2E4D] rounded-xl bg-[#131b2e]">
            <table className="w-full text-sm text-slate-300">
              <thead className="bg-[#1a243d] border-b border-[#1F2E4D]">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    PIN
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-slate-300 font-semibold">
                    Created At
                  </th>
                  <th className="px-4 py-3 text-center text-slate-300 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {activeBusinessUsers.length > 0 ? (
                  activeBusinessUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition"
                    >
                      <td className="px-4 py-3 font-medium text-white">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="capitalize px-2 py-1 bg-[#1a243d] text-slate-300 rounded-full text-xs border border-[#1F2E4D]">
                          {user.role?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        ••••
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getUserStatusBadge(user.status)}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEditUser(user, selectedBusinessForUsers)
                            }
                            className="p-1.5 text-blue-400 hover:bg-[#1a243d] rounded-lg transition cursor-pointer"
                            title="Edit User"
                          >
                            <FaEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              openDeleteModal(
                                user.id,
                                selectedBusinessForUsers.id,
                                user.name,
                              )
                            }
                            className="p-1.5 text-red-400 hover:bg-[#1a243d] rounded-lg transition cursor-pointer"
                            title="Delete User"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <p>No users found for this business</p>
                        <button
                          onClick={() =>
                            handleAddUser(selectedBusinessForUsers)
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#052350] rounded-lg hover:bg-[#041a3d] border border-[#1F2E4D] transition cursor-pointer"
                        >
                          <FaUserPlus className="w-4 h-4" />
                          Add First User
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Management Modal */}
      {selectedBusiness && showRolesModal && (
        <RolesManagementModal
          business={selectedBusiness}
          roles={roles[selectedBusiness.id] || []}
          onClose={() => {
            setShowRolesModal(false);
            setSelectedBusiness(null);
          }}
          onSuccess={handleRolesSuccess}
        />
      )}

      {/* Create User Modal */}
      {selectedBusinessForUsers && showCreateUserModal && (
        <CreateBusinessUserModal
          isOpen={showCreateUserModal}
          onClose={() => {
            setShowCreateUserModal(false);
          }}
          businessId={selectedBusinessForUsers.id}
          roles={roles[selectedBusinessForUsers.id] || []}
          onSuccess={handleCreateUserSuccess}
        />
      )}

      {/* Edit User Modal */}
      {selectedUser && selectedBusinessForUsers && showEditUserModal && (
        <EditBusinessUserModal
          isOpen={showEditUserModal}
          onClose={() => {
            setShowEditUserModal(false);
            setSelectedUser(null);
          }}
          businessId={selectedBusinessForUsers.id}
          user={selectedUser}
          roles={roles[selectedBusinessForUsers.id] || []}
          onSuccess={handleEditUserSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <DeleteConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete user "${userToDelete.userName}"? This action cannot be undone.`}
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}
    </>
  );
};

export default BusinessManagement;
