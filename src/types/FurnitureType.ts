export default class FurnitureType {
    furnitureId?: number;
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;

    status?: "available" | "visible" | "hidden";
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
    stores?: {
        storeId: number;
        address: string;
        name: string;
        geoLat: number;
        geoLng: number;
    }[];
    categoryId?: number;
    category?: {
        name: string;
    }
}