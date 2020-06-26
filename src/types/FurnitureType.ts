export default class FurnitureType {
    furnitureId?: number;
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;

    status?: "available" | "visible" | "hidden";
    availableOne?: number;
    availableTwo?: number;
    furniturePrices?: {
        furniturePriceId: number;
        price: number;
    }[];
    photos?: {
        photoId: number;
        imagePath: string;
    }[];
    furnitureFeatures?: {
        furnitureFeatureId: number;
        featureId: number;
        value: string;
    }[];
    features?: {
        featureId: number;
        name: string;
    }[];
    categoryId?: number;
    category?: {
        name: string;
    }
}