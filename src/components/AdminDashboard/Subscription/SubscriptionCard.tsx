import AdminTitle from "@/common/AdminTitle";
import { Button } from "@/components/ui/button";

const SubscriptionCard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <AdminTitle title="Subscription " />
        </div>
        <div>
          <Button>Create New Plan</Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard;
