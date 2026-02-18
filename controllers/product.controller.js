import { Product } from "../models/product.model.js";
import mongoose from "mongoose";

export const addProduct = async (req, res) => {
  try {
    let { category, itemName, price, serialNumber, hasDiscount, discountPercent, rating, salesCount, stock, itemImage, salesCompany, productBarcod, sellerId } = req.body;

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
      sellerId: req?.admin?.id || req?.seller?.id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({
      sellerId: new mongoose.Types.ObjectId(req.params.sellerId)
    }).populate("category", "name");
    if (!products.length) return res.status(404).json({ message: "Product not found" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductByBarcod = async (req, res) => {
  try {
    const products = await Product.find({ productBarcod: req.params.productByBarcod });
    if (!products) return res.status(404).json({ message: "Product not found" });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const filter = category ? { category } : {};

    const products = await Product
      .find(filter)
      .populate("category");

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductsById = async (req, res) => {

  const { productId } = req.params
  try {
    const products = await Product.findById({ _id: productId }).populate("category", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};