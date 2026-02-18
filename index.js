import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import basketRoutes from "./routes/basket.router.js";
import AuthRoutes from "./routes/customerToken.routes.js";
import orderRoutes from "./routes/productOrder.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://vidadiali.github.io/teck-admin/",
    "https://vidadiali.github.io/teck-web/",
    "https://vidadiali.github.io/",
    "https://vidadiali.github.io/",
    "https://teck-web-back-1.onrender.com/"
  ],
  credentials: true,
}));


app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/basket", basketRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
