import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaUsersCog, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import RolesManagementModal from "./RolesManagementModal";
import { CreateBusinessUserModal } from "./CreateBusinessUserModal";
import { EditBusinessUserModal } from "./EditBusinessUserModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import {
  useGetBusinessesQuery,
} from "@/redux/features/admin/business/businessApi";
import { useDeleteUserMutation } from "@/redux/features/auth/userApi";
import { IBusiness, IBusinessUser } from "@/redux/features/admin/business/businessType";

import Loader from "../Shared/Loader";

const BusinessManagement = () => {
  const { data: businesses = [], isLoading, refetch } = useGetBusinessesQuery();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [selectedBusiness, setSelectedBusiness] = useState<IBusiness | null>(null);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IBusinessUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<{
    userId: string;
    userName: string;
  } | null>(null);
  const [selectedBusinessForUsers, setSelectedBusinessForUsers] = useState<IBusiness | null>(null);

  const handleSearch = () => {
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleManageRoles = (business: IBusiness) => {
    setSelectedBusiness(business);
    setShowRolesModal(true);
  };

  const handleAddUser = (business: IBusiness) => {
    setSelectedBusinessForUsers(business);
    setShowCreateUserModal(true);
  };

  const handleEditUser = (user: IBusinessUser, business: IBusiness) => {
    setSelectedUser(user);
    setSelectedBusinessForUsers(business);
    setShowEditUserModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete.userId).unwrap();
      toast.success(`User ${userToDelete.userName} deleted successfully`);
      setShowDeleteModal(false);
      setUserToDelete(null);
      refetch();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.error || "Failed to delete user.";
      toast.error(typeof errorMsg === "string" ? errorMsg : JSON.stringify(errorMsg));
    }
  };

  const openDeleteModal = (
    userId: string,
    _businessId: string,
    userName: string,
  ) => {
    setUserToDelete({ userId, userName });
    setShowDeleteModal(true);
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

  const getUserStatusBadge = (isActive: boolean | string) => {
    if (isActive === true || isActive === "ACTIVE") {
      return "bg-emerald-500/10 text-emerald-400";
    }
    return "bg-slate-500/10 text-slate-400";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
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
  const filteredBusinesses = businesses.filter((b) => {
    const term = searchTerm.toLowerCase();
    const name = (b.businessName || b.name || "").toLowerCase();
    const email = (b.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  const limit = 10;
  const total = filteredBusinesses.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedBusinesses = filteredBusinesses.slice((page - 1) * limit, page * limit);

  // Sync selected business for users view
  const activeSelectedBusiness = selectedBusinessForUsers
    ? businesses.find((b) => b.id === selectedBusinessForUsers.id) || selectedBusinessForUsers
    : null;

  const activeBusinessUsers = activeSelectedBusiness?.users || [];

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
            Total Businesses: <span className="font-semibold text-white">{total}</span>
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
                    <th className="px-6 py-4 text-left text-slate-300 text-base font-semibold">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-center text-slate-300 text-base font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <Loader />
                      </td>
                    </tr>
                  ) : paginatedBusinesses.length > 0 ? (
                    paginatedBusinesses.map((business: IBusiness) => (
                    <tr
                      key={business.id}
                      className="border-b border-[#1F2E4D]/60 hover:bg-[#1a243d]/45 transition cursor-pointer"
                      onClick={() => setSelectedBusinessForUsers(business)}
                    >
                      <td className="px-6 py-5">
                        <div className="font-semibold text-white whitespace-nowrap">
                          {business.businessName || business.name}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="capitalize px-2 py-1 bg-[#1a243d] rounded-full text-xs text-slate-300">
                          {business.industry || "Restaurant"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(
                            business.isActive ? "ACTIVE" : "INACTIVE"
                          )}`}
                        >
                          {business.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-semibold text-white">
                          {typeof business.subscriptionFee === "string" &&
                          business.subscriptionFee.includes("$")
                            ? business.subscriptionFee
                            : `$${business.subscriptionFee}/mo`}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        {formatDate(business.lastSync)}
                      </td>
                      <td className="px-6 py-5 text-slate-400">
                        {formatDate(business.createdAt)}
                      </td>
                      <td className="px-6 py-5" onClick={(e) => e.stopPropagation()}>
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
                  ))
                  ) : (
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
                              className="text-[#10B981] underline cursor-pointer"
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
        {totalPages > 0 && paginatedBusinesses.length > 0 && (
          <div className="mt-6 flex items-center justify-between px-2 sm:px-4 py-3 flex-wrap gap-3">
            <div className="text-sm text-slate-400">
              Showing{" "}
              <span className="font-medium text-white">{paginatedBusinesses.length}</span> of{" "}
              <span className="font-medium text-white">{total}</span> businesses
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
      {activeSelectedBusiness && (
        <div className="mt-6 p-6 rounded-3xl bg-[#131b2e] border border-[#1F2E4D] text-slate-300 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Users - {activeSelectedBusiness.businessName || activeSelectedBusiness.name}
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
                  activeBusinessUsers.map((user: IBusinessUser) => (
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
                          {user.role || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        ••••
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getUserStatusBadge(
                            user.isActive
                          )}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleEditUser(user, activeSelectedBusiness)
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
                                activeSelectedBusiness.id,
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
                          onClick={() => handleAddUser(activeSelectedBusiness)}
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
          onClose={() => {
            setShowRolesModal(false);
            setSelectedBusiness(null);
          }}
          onSuccess={() => refetch()}
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
          businessName={selectedBusinessForUsers.businessName || selectedBusinessForUsers.name}
          allowedRoles={selectedBusinessForUsers.allowedRoles}
          onSuccess={() => refetch()}
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
          allowedRoles={selectedBusinessForUsers.allowedRoles}
          onSuccess={() => refetch()}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <DeleteConfirmationModal
          title="Delete User"
          message={`Are you sure you want to delete user "${userToDelete.userName}"? This action cannot be undone.`}
          isLoading={isDeletingUser}
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
