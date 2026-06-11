import type { Request, Response} from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";


// Get all products (public)
export const getAllProducts = async(req:Request,res:Response) => {
  try{
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Failed to get products, something broken in your code"});
  }
};

// Get my product by current user (protected)
export const getMyProducts = async (req:Request, res:Response) => {
  try {
    const { userId } = getAuth(req)
    if(!userId) return res.status(401).json({ error: "User Unauthorized"});

    const products = await queries.getProductByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting your product", error)
    res.status(500).json({ error: "Failed to get your product"});
  }
}

// Get product by Id (public)
interface ProductParams {
  id: string;
}
export const getProductById = async(req:Request<ProductParams>,res:Response) => {
  try {
    const {id} = req.params;
    const product = await queries.getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found"});

    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product", error);
    res.status(500).json({ error: "Failed to get product"});
  }
};

// Create Product (protected)
export const createProduct = async (req:Request,res:Response) => {
  try {
    const { userId } = getAuth(req)
    if(!userId) return res.status(401).json({ error: "User Unauthorized" });
    const { title, description, imageUrl } = req.body;
    if(!title || !description || !imageUrl ) {
      res.status(400).json({ error: "Title, description, and imageUrl are required!"});
      return;
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId
    });    
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product", error);
    res.status(500).json({ error: "Failed to create product, something broken in your code!"});
  }
};

// Update Product (protected -- owner only)
export const updateProduct = async (req:Request,res:Response) => {
  try {
    const { userId } = getAuth(req);
    if(!userId) return res.status(401).json({ error: "User Unauthorized" });
    const id = String(req.params.id);
    const { title, description, imageUrl } = req.body;

    // Check if product exist and belong to user
    const existingProduct = await queries.getProductById(id);
    if(!existingProduct) {
      res.status(404).json({ error: "Product not found!" })
      return;
    }

    // Verify the current user own the product
    if(existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can only update your own products" });
      return;
    }

    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product, something broken in your code!"});
  }
};

// Delete Product (protected -- owner only)
export const deleteProduct = async (req:Request,res:Response) => {
  try {
    const { userId } = getAuth(req)
    if(!userId) return res.status(401).json({ error: "User Unauthorized" });
    const id = String(req.params.id);

    // Check if product exist and belong to user
    const existingProduct = await queries.getProductById(id);
    if(!existingProduct) {
      res.status(404).json({ error: "Product not found!" })
      return;
    }

    // Verify the current user own the product
    if(existingProduct.userId !== userId) {
      res.status(403).json({ error: "You can only delete your own products" });
      return;
    }

    await queries.deleteProduct(id);

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product, something broken in your code!"});
  }
};