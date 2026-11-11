import { Product } from "../types/product";
import productsRaw from "./products.json";
import { getProductAuthenticImage } from "./productImageMap";

export const PRODUCTS: Product[] = (productsRaw as Product[]).map((p) => {
  const authenticImage = getProductAuthenticImage(p.reference, p.id);
  return {
    ...p,
    image: authenticImage,
    images: authenticImage ? [authenticImage] : [],
  };
});
