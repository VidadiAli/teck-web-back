import { Seller } from "../models/seller.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.model.js";
import { generateAccessToken, generateRefreshToken } from "../middleware/generateTokens.js";

export const addSeller = async (req, res) => {
  try {
    const { name, company, email, phone, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = new Seller({ name, company, email, phone, password: hashedPassword });
    await seller.save();
    res.status(201).json(seller);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message });
  }
};

export const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const accessToken = generateAccessToken(seller);
    const refreshToken = generateRefreshToken(seller);

    await Token.create({
      userId: seller._id,
      role: "seller",
      token: refreshToken
    });

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      sellerProfile: {
        name: seller.name,
        email: seller.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getMeAsSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password");
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logoutSeller = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token required" });

    await Token.deleteOne({ token: refreshToken });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
