import { apiClient } from "@/api/client";

type CreateProductDTO = {
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
};

type ProductDTO = {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    imageUrls: string[];
    sellerId: string;
    createdAt: string;
};

export async function createProduct(data: CreateProductDTO): Promise<ProductDTO> {
    const response = await apiClient.post<ProductDTO>("/product", data);
    return response.data;
}
