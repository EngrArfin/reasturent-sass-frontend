// src/redux/features/calculate/calculateTypes.ts

export interface CalculateParcelRequest {
  height_cm: number;
  width_cm: number;
  length_cm: number;
  weight_kg: number;
  postcodes: {
    from: string;
    to: string;
  };
}

export interface CalculateParcelResponse {
  success: boolean;
  message: string;
  data: {
    totalPrice: number;
  };
}

export interface CalculateState {
  calculatedPrice: number | null;
  isLoading: boolean;
  error: string | null;
}
