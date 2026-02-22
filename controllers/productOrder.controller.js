import { ProductOrder } from "../models/productOrder.model.js";
import { Product } from "../models/product.model.js";

// 🔹 Yeni order yaratmaq
export const createProductOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { productId } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId lazımdır" });

    const productExists = await Product.findById(productId);
    if (!productExists)
      return res.status(404).json({ message: "Product tapılmadı" });

    const order = await ProductOrder.create({
      customer: customerId,
      product: productId
    });


    const orderCount = await ProductOrder.find({ customer: customerId });

    const totalCount = orderCount ? orderCount.length : 0;

    res.status(201).json({ count: totalCount });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Müştərinin bütün sifarişləri
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;

    const orders = await ProductOrder.find({ customer: customerId })
      .populate("product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Seller üçün sifarişləri almaq
export const getOrdersAsSeller = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await ProductOrder.find()
      .populate({
        path: "product",
        match: { sellerId },
      })
      .populate("customer")
      .sort({ createdAt: -1 });

    const filteredOrders = orders.filter(order => order.product !== null);

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Order statusunu yeniləmək
export const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status } = req.body;

    const order = await ProductOrder.findById(req.params.id).populate("product");

    if (!order) return res.status(404).json({ message: "Order tapılmadı" });

    if (order.product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "Bu order sizə aid deyil" });
    }

    const allowedStatus = ["completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: `Status yalnız ${allowedStatus.join(", ")} ola bilər` });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Status yeniləndi", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyOrderCount = async (req, res) => {
  try {
    const customerId = req.user.id;
    const order = await ProductOrder.find({ customer: customerId });

    const totalCount = order ? order.length : 0;

    res.json({ count: totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};