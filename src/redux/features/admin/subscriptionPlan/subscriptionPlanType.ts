export type SubscriptionPlanType = "FREE" | "MONTHLY" | "YEARLY";

export interface ISubscriptionPlan {
  id: string;
  name: string;
  type: SubscriptionPlanType;
  description: string;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  businesses?: Array<{
    id: string;
    businessName: string;
    name?: string;
  }>;
}

export interface ICreateSubscriptionPlanRequest {
  name: string;
  type: SubscriptionPlanType;
  description: string;
  amount: number;
  currency?: string;
  isActive?: boolean;
}

export interface IUpdateSubscriptionPlanRequest {
  name?: string;
  type?: SubscriptionPlanType;
  description?: string;
  amount?: number;
  currency?: string;
  isActive?: boolean;
}

// Aliases for compatibility
export type SubscriptionPlan = ISubscriptionPlan;
export type CreateSubscriptionPlanDto = ICreateSubscriptionPlanRequest;
export type UpdateSubscriptionPlanDto = IUpdateSubscriptionPlanRequest;
