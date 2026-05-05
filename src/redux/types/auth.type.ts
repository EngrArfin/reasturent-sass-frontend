export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "marchant";
  businessName?: string;
  address_Pickup_Location?: string;
  phone?: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type TAuth = {
  user: User | null;
  token: string | null;
};

export type RegisterRequest = {
  name: string;
  businessName: string;
  address_Pickup_Location: string;
  phone: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};
