// src/redux/features/manager/InventoryManagement/InventoryManagementType.ts

export type StockStatus = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface IProductBusiness {
  id: string;
  businessName?: string;
  name?: string;
}

export interface IProduct {
  id: string;
  name: string;
  barcode: string;
  sku?: string;
  stock: number;
  initialStock?: number;
  price: number;
  formattedPrice?: string;
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | string;
  businessId?: string;
  businessName?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  business?: IProductBusiness;
}

export interface GetProductsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  stockStatus?: StockStatus | string;
  businessId?: string;
}

export interface GetProductsResponse {
  items: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface InventorySummaryResponse {
  totalProducts: number;
  inStockCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalInventoryValue: number;
  currency?: string;
}

export interface GenerateSkuResponse {
  barcode: string;
  sku: string;
}

export interface CreateProductPayload {
  name: string;
  barcode?: string;
  sku?: string;
  stock: number;
  initialStock?: number;
  price: number;
  businessId?: string;
}

export interface UpdateProductPayload {
  name?: string;
  barcode?: string;
  sku?: string;
  stock?: number;
  initialStock?: number;
  price?: number;
  businessId?: string;
  isActive?: boolean;
}

export interface DeleteProductResponse {
  message: string;
  id: string;
  name?: string;
  barcode?: string;
}

export interface PrintLabelData {
  text: string;
  code: string;
  priceTag: string;
  generatedAt: string;
}

export interface BarcodeLabelData {
  productId: string;
  productName: string;
  barcode: string;
  sku: string;
  price: number;
  formattedPrice: string;
  stock: number;
  businessName?: string;
  printLabelData?: PrintLabelData;
}

export interface AdjustStockPayload {
  quantity: number;
  type: "SET" | "ADD" | "SUBTRACT";
  notes?: string;
}

export interface AdjustStockResponse extends IProduct {
  previousStock?: number;
  adjustedStock?: number;
  adjustmentType?: "SET" | "ADD" | "SUBTRACT";
}

export interface ScanProductResponse {
  success: boolean;
  found: boolean;
  scannedCode: string;
  product: IProduct;
}
