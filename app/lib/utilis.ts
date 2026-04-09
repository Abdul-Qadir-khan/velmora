export function getProductImage(images: any, index = 0): string {
  if (!images) return "/placeholder-product.jpg";
  
  let imgArray: string[];
  
  if (typeof images === "string") {
    try {
      imgArray = JSON.parse(images);
    } catch {
      return images;
    }
  } else if (Array.isArray(images)) {
    imgArray = images;
  } else {
    return "/placeholder-product.jpg";
  }
  
  return imgArray[index] || "/placeholder-product.jpg";
}