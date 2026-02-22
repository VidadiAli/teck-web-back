import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

// Yeni məhsul əlavə etmək
export const addProduct = async (req, res) => {
  try {
    const {
      category,
      itemName,
      price,
      serialNumber,
      hasDiscount,
      discountPercent,
      rating,
      salesCount,
      stock,
      itemImage,
      salesCompany,
      productBarcod,
    } = req.body;

    const product = new Product({
      itemName,
      price,
      serialNumber,
      hasDiscount,
      discountPercent,
      rating,
      salesCount,
      stock,
      itemImage,
      salesCompany,
      productBarcod,
      category,
      sellerId: req.user.id, // role sistemi ilə seller və admin üçün
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bütün məhsulları çəkmək
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Seller və ya admin üçün sellerə görə məhsullar
export const getProductsBySeller = async (req, res) => {
  try {
    let filter = {};

    if (req.params.sellerId) {
      // Admin baxışı üçün param varsa
      filter.sellerId = new mongoose.Types.ObjectId(req.params.sellerId);
    } else if (req.user && req.user.role === "seller") {
      // Seller yalnız öz məhsullarını görsün
      filter.sellerId = req.user.id;
    }

    const products = await Product.find(filter).populate("category", "name");

    if (!products.length) return res.status(404).json({ message: "Product not found" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Barcode üzrə məhsul
export const getProductByBarcod = async (req, res) => {
  try {
    const products = await Product.find({ productBarcod: req.params.productByBarcod });
    if (!products || !products.length) return res.status(404).json({ message: "Product not found" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kateqoriya üzrə məhsullar
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const filter = category ? { category } : {};

    const products = await Product.find(filter).populate("category", "name");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ProductId üzrə məhsul
export const getProductsById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate("category", "name");

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};