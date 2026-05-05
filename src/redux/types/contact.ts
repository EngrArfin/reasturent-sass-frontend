// src/types/contact.ts
export type TContact = {
  id: string;
  name: string;
  email: string;
  number: string;
  message: string;
  createdAt: string;
};

export type TContactFormData = {
  name: string;
  email: string;
  number: string;
  message: string;
};

export type TContactResponse = {
  success: boolean;
  message: string;
  data: TContact;
};

export type TContactListResponse = {
  success: boolean;
  message: string;
  data: {
    data: TContact[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};
