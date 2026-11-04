import { useState } from "react";
import AdminTitle from "@/common/AdminTitle";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubscriptionModal from "./SubscriptionModal";
import FormalDeleteModal from "@/components/Reuseable/FormalDeleteModal";
import {
  useGetSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  SubscriptionPlan,
} from "@/redux/features/admin/subscriptionPlan/subscriptionPlanApi";
import { toast } from "sonner";

const SubscriptionCard = () => {
  const { data: apiPlans = [], isLoading } = useGetSubscriptionPlansQuery();
  const [createPlan] = useCreateSubscriptionPlanMutation();
  const [updatePlan] = useUpdateSubscriptionPlanMutation();
  const [deletePlan, { isLoading: isDeletingPlan }] = useDeleteSubscriptionPlanMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);

  const plans: SubscriptionPlan[] = apiPlans;

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "GBP":
        return "£";
      case "CFA":
        return "CFA ";
      default:
        return "$";
    }
  };

  const handleOpenCreateModal = () => {
    setEditPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan: SubscriptionPlan) => {
    setEditPlan(plan);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      await deletePlan(planToDelete.id).unwrap();
      toast.success("Subscription plan deleted successfully");
      setPlanToDelete(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete plan");
    }
  };

  const handleSavePlan = async (savedPlan: SubscriptionPlan) => {
    try {
      if (editPlan && editPlan.id) {
        await updatePlan({
          id: editPlan.id,
          data: {
            name: savedPlan.name,
            type: savedPlan.type,
            description: savedPlan.description,
            amount: savedPlan.amount,
            currency: savedPlan.currency,
            isActive: savedPlan.isActive,
          },
        }).unwrap();
        toast.success("Subscription plan updated successfully");
      } else {
        await createPlan({
          name: savedPlan.name,
          type: savedPlan.type,
          description: savedPlan.description,
          amount: savedPlan.amount,
          currency: savedPlan.currency,
          isActive: savedPlan.isActive,
        }).unwrap();
        toast.success("Subscription plan created successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save plan");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <AdminTitle title="Subscription" />
        </div>
        <div>
          <Button
            onClick={handleOpenCreateModal}
            className="w-full sm:w-auto bg-[#052350] hover:bg-[#061E49] text-white font-semibold px-5 py-2.5 rounded-xl border border-[#1F2E4D] cursor-pointer flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" />
            <span className="text-sm sm:text-base">Create New Plan</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-slate-400 bg-[#131b2e] rounded-2xl border border-[#1F2E4D]">
          Loading subscription plans...
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.map((plan) => {
            const getBadgeStyles = () => {
              if (!plan.isActive) {
                return "bg-red-950/40 text-red-400 border border-red-900/30";
              }
              switch (plan.type) {
                case "FREE":
                  return "bg-slate-800 text-slate-300 border border-slate-700/50";
                case "MONTHLY":
                  return "bg-blue-900/40 text-blue-300 border border-blue-800/30";
                case "YEARLY":
                  return "bg-purple-900/40 text-purple-300 border border-purple-800/30";
                default:
                  return "bg-blue-900/40 text-blue-300 border border-blue-800/30";
              }
            };

            return (
              <div
                key={plan.id}
                className={`relative bg-[#131b2e] rounded-2xl sm:rounded-3xl border p-5 sm:p-6 lg:p-8 flex flex-col justify-between items-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 min-h-[340px] sm:min-h-[370px] lg:min-h-[390px] h-full ${
                  plan.isActive
                    ? "border-[#1F2E4D] hover:border-[#2b416e]"
                    : "border-dashed border-slate-700 opacity-60"
                }`}
              >
                <div className="relative w-full flex items-center justify-center mb-4 sm:mb-6">
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider uppercase ${getBadgeStyles()}`}
                    >
                      {plan.isActive ? plan.type : "INACTIVE"}
                    </span>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-[#1a243d] transition cursor-pointer focus:outline-none">
                        <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#131b2e] border border-[#1F2E4D] text-white rounded-xl shadow-xl w-36">
                        <DropdownMenuItem
                          onClick={() => handleOpenEditModal(plan)}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer text-slate-300 hover:text-white hover:bg-[#1a243d] focus:bg-[#1a243d] focus:text-white rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPlanToDelete(plan)}
                          className="flex items-center gap-2 px-3 py-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-950/20 focus:bg-red-950/20 focus:text-red-300 rounded-lg transition-colors text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Delete Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center items-center w-full my-auto">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                    {plan.name}
                  </h3>

                  {plan.type === "FREE" || plan.amount === 0 ? (
                    <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-4 select-none">
                      FREE
                    </div>
                  ) : (
                    <div className="flex items-baseline justify-center gap-0.5 mb-3 sm:mb-4 text-white select-none">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {getCurrencySymbol(plan.currency)}
                        {plan.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-slate-400 text-xs sm:text-sm font-semibold ml-0.5">
                        /{plan.type === "MONTHLY" ? "month" : "year"}
                      </span>
                    </div>
                  )}

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 sm:mb-6 max-w-xs sm:max-w-[260px] break-words">
                    {plan.description}
                  </p>
                </div>

                <div className="w-full mt-auto pt-2">
                  <button
                    type="button"
                    className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm md:text-base tracking-wide transition cursor-pointer select-none ${
                      plan.type === "FREE"
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        : "bg-[#052350] hover:bg-[#061E49] text-white shadow-md hover:shadow-lg hover:scale-[1.01]"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center text-slate-400 bg-[#131b2e] rounded-2xl border border-[#1F2E4D]">
          <p className="text-base font-semibold text-slate-300">No subscription plans found</p>
          <p className="text-xs text-slate-500 mt-1">
            Click "Create New Plan" to set up your subscription tiers.
          </p>
        </div>
      )}

      {/* Subscription Edit / Create Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePlan}
        editPlan={editPlan}
      />

      {/* Formal Delete Modal for Subscription Plan */}
      <FormalDeleteModal
        isOpen={Boolean(planToDelete)}
        title="Delete Subscription Plan?"
        itemName={planToDelete?.name}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeletingPlan}
        onConfirm={handleConfirmDelete}
        onClose={() => setPlanToDelete(null)}
      />
    </div>
  );
};

export default SubscriptionCard;
