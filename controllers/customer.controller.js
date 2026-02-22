import { Customer } from "../models/customer.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../middleware/generateTokens.js";
import { Token } from "../models/token.model.js";


// REGISTER
export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email artıq mövcuddur" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "customer"
    });

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    await Token.create({
      userId: customer._id,
      role: customer.role,
      token: refreshToken
    });

    res.status(201).json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer)
      return res.status(404).json({ message: "Customer tapılmadı" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Şifrə yanlışdır" });

    const accessToken = generateAccessToken(customer);
    const refreshToken = generateRefreshToken(customer);

    await Token.create({
      userId: customer._id,
      role: "customer",
      token: refreshToken
    });

    res.json({
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email
      },
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL CUSTOMERS (yalnız admin route-da istifadə olunmalıdır)
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};