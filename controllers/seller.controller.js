import { Seller } from "../models/seller.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../models/token.model.js";

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

    const accessToken = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: seller._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    await Token.create({ admin: seller._id, token: refreshToken });

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
    const seller = await Seller.findById(req.seller.id).select("-password");
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


export const refreshSellerToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const existingToken = await Token.findOne({ token: refreshToken });
    if (!existingToken)
      return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const seller = await Seller.findById(decoded.id);
    if (!seller)
      return res.status(404).json({ message: "Seller not found" });

    const newAccessToken = jwt.sign(
      { id: seller._id, email: seller.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Refresh token expired or invalid" });
  }
};
