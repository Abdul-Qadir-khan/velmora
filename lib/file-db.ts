import fs from "fs";
import path from "path";

// Path to JSON file
const filePath = path.join(process.cwd(), "data/products.json");

// Read products from JSON
export const readProducts = () => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // console.error("Error reading products.json:", error);
    return [];
  }
};

// Write products to JSON
export const writeProducts = (data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    // console.error("Error writing products.json:", error);
    return false;
  }
};