import { ProductOrder } from "../models/productOrder.model.js";

// Yeni order yaratmaq
export const createProductOrder = async (req, res) => {
  try {
    const customerId = req.user.id; // verifyCustomerToken vasitəsilə gəlir
    const { productId, orderStatus } = req.body;

    if (!productId)
      return res.status(400).json({ message: "productId lazımdır" });

    const order = await ProductOrder.create({
      customer: customerId,        // burada req.user.id istifadə olunur
      product: productId,
      orderStatus: orderStatus || "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Müştərinin bütün sifarişlərini çəkmək
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id; // verifyCustomerToken middleware ilə gəlir

    const orders = await ProductOrder.find({ customer: customerId })
      .populate("product") // productun bütün məlumatlarını gətir
      .sort({ createdAt: -1 }); // sonuncu sifariş yuxarıda

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getOrdersAsSeller = async (req, res) => {
  try {
    const sellerId = req.user.id; // seller token-dən gəlir

    const orders = await ProductOrder.find()
      .populate({
        path: "product",
        match: { sellerId: sellerId } // yalnız bu sellerin məhsulları
      })
      .populate("customer")
      .sort({ createdAt: -1 });

    // match null olanları silirik
    const filteredOrders = orders.filter(order => order.product !== null);

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { status } = req.body;

    const order = await ProductOrder.findById(req.params.id).populate("product");

    if (!order) return res.status(404).json({ message: "Order tapılmadı" });

    // seller yalnız öz məhsulunu dəyişə bilər
    if (order.product.sellerId.toString() !== sellerId) {
      return res.status(403).json({ message: "Bu order sizə aid deyil" });
    }

    if (!["completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Yanlış status" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Status yeniləndi", order });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
