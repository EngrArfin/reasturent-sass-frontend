// src/redux/types/marchant.type.ts

export type Address = {
  id: string;
  addressName: string;
  streetName: string;
  cityOrSuburb: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  additionalNotes?: string;
};

export type PaginatedAddressResponse = {
  data: Address[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetMyAddressResponse = {
  success: boolean;
  message: string;
  data: PaginatedAddressResponse;
};

export type NewAddressRequest = Omit<Address, "id">;

export type AddressResponse = {
  success: boolean;
  message: string;
  data: Address;
};

export interface UpdateAddressRequest extends Partial<Omit<Address, "id">> {
  id: string; // ID is required, rest is optional
}
