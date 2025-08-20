import { ORDER_ITEM_TYPE, ORDER_TYPE, PRODUCT_TYPE } from "../product";

interface RELATED_TYPE {
    id: string;
    name: string;
}
export interface KITCHEN_ORDER_TYPE {
    id?: string;
    completionTime: number;
    status: string;
    cookingTime: number;
    createdAt?: string;
    kitchen: RELATED_TYPE;
    order: ORDER_TYPE;
    tables?: string
    productOrders: {
        totalCount: number,
        edges: { node: ORDER_ITEM_TYPE }[]
    }
}





export const KOT_STATUS_TYPES = [
    { value: "PENDING", label: "Pending" },
    { value: "ACKNOWLEDGED", label: "Acknowledged" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "ON_HOLD", label: "On Hold" },
    { value: "READY", label: "Ready for Serving" },
    { value: "SERVED", label: "Served/Delivered" },
    { value: "CANCELLED", label: "Cancelled" }
]

export interface GetProductsData {
    products: PRODUCT_TYPE[];
}

export interface GetProductByIdData {
    product: PRODUCT_TYPE;
}

export interface CreateProductData {
    createProduct: PRODUCT_TYPE;
}

export interface CreateProductVariables {
    name: string;
    description?: string;
    price: number;
}
