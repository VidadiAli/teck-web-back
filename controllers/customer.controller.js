import { Customer } from "../models/customer.model.js"
import bcrypt from "bcryptjs";
import { generateCustomerAccessToken, generateCustomerRefreshToken } from "./customerToken.controller.js";


// 🔹 REGISTER
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
      password: hashedPassword
    });

    const accessToken = generateCustomerAccessToken(customer);
    const refreshToken = generateCustomerRefreshToken(customer);

    res.status(201).json({
      customer,
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 LOGIN
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer)
      return res.status(404).json({ message: "Customer tapılmadı" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(400).json({ message: "Şifrə yanlışdır" });

    const accessToken = generateCustomerAccessToken(customer);
    const refreshToken = generateCustomerRefreshToken(customer);

    res.json({
      customer,
      accessToken,
      refreshToken
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// mövcud register + login funksiyalar burda olmalıdır

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const refreshCustomerToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Refresh token lazım" });

    const decoded = jwt.verify(refreshToken, process.env.CUSTOMER_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: "customer" },
      process.env.CUSTOMER_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token etibarsızdır" });
  }
};