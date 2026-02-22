import { Token } from "../models/token.model.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token" });

    const existingToken = await Token.findOne({ token: refreshToken });
    if (!existingToken)
      return res.status(403).json({ message: "Invalid token" });

    // Refresh token-ı verify et
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Yeni access token yarat
    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error("Refresh error:", err.message);
    res.status(403).json({ message: "Expired or invalid" });
  }
};