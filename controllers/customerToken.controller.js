import jwt from "jsonwebtoken";
import { CustomerToken } from "../models/customerToken.model.js";
import { Customer } from "../models/customer.model.js";

// Access token generasiya
export const generateCustomerAccessToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: "customer" },
    process.env.CUSTOMER_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
};

// Refresh token generasiya
export const generateCustomerRefreshToken = (customer) => {
  return jwt.sign(
    { id: customer._id, role: "customer" },
    process.env.CUSTOMER_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

// Refresh token endpoint
export const refreshCustomerToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token yoxdur" });

    const savedToken = await CustomerToken.findOne({ token: refreshToken });
    if (!savedToken) return res.status(403).json({ message: "Token etibarsızdır" });

    const decoded = jwt.verify(refreshToken, process.env.CUSTOMER_REFRESH_SECRET);
    if (decoded.role !== "customer") return res.status(403).json({ message: "Access denied" });

    const customer = await Customer.findById(decoded.id);
    if (!customer) return res.status(404).json({ message: "Customer tapılmadı" });

    const newAccessToken = generateCustomerAccessToken(customer);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const verifyCustomerToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token yoxdur" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.CUSTOMER_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token etibarsızdır" });
    if (decoded.role !== "customer") return res.status(403).json({ message: "Access denied" });

    req.user = decoded;
    next();
  });
};