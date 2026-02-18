import Basket from "../models/basket.model.js";
import { Product } from "../models/product.model.js";

// Customer-in basket-i al
export const getBasket = async (req, res) => {
    try {
        const customerId = req.user.id;
        const basket = await Basket.findOne({ customer: customerId });

        if (!basket || !basket.products.length) {
            return res.json({ items: [], count: 0 });
        }

        // Hər productId üzrə tam məlumatı çəkirik
        const detailedItems = await Promise.all(
            basket.products.map(async (bItem) => {
                const product = await Product.findById(bItem.productId).lean();
                if (!product) return null; // product tapılmazsa skip et
                return {
                    ...product,
                    quantity: bItem.quantity || 1
                };
            })
        );

        // null-ları filter edirik
        const items = detailedItems.filter(Boolean);

        const totalCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);

        res.json({ items, count: totalCount });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


// Basket-ə product əlavə et

export const addToBasket = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId, quantity = 1, itemName, price, productBarcod } = req.body;

        let basket = await Basket.findOne({ customer: customerId });

        if (!basket) {
            basket = new Basket({ customer: customerId, products: [] });
        }

        // products yoxdursa boş array set et
        if (!basket.products) basket.products = [];

        const existingItem = basket.products.find(
            i => i.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            basket.products.push({
                productId,
                itemName,
                price,
                quantity,
                productBarcod
            });
        }

        await basket.save();

        const totalCount = basket.products.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ count: totalCount });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Quantity artırma
export const increaseQuantity = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.body;

        const basket = await Basket.findOne({ customer: customerId });
        if (!basket) return res.status(404).json({ message: "Basket tapılmadı" });

        const item = basket.products.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item tapılmadı" });

        item.quantity += 1;
        await basket.save();

        const totalCount = basket.products.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ count: totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Quantity azaltma
export const decreaseQuantity = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.body;

        const basket = await Basket.findOne({ customer: customerId });
        if (!basket) return res.status(404).json({ message: "Basket tapılmadı" });

        const item = basket.products.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: "Item tapılmadı" });

        item.quantity -= 1;
        if (item.quantity <= 0) {
            basket.products = basket.products.filter(i => i.productId.toString() !== productId);
        }

        await basket.save();

        const totalCount = basket.products.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ count: totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete item completely
export const removeFromBasket = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId } = req.body;

        const basket = await Basket.findOne({ customer: customerId });
        if (!basket)
            return res.status(404).json({ message: "Basket tapılmadı" });

        basket.products = basket.products.filter(
            (item) => item.productId.toString() !== productId
        );

        await basket.save();

        const totalCount = basket.products.reduce(
            (acc, item) => acc + item.quantity,
            0
        );

        res.json({ count: totalCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Basket element sayını almaq
export const getBasketCount = async (req, res) => {
  try {
    const customerId = req.user.id;
    const basket = await Basket.findOne({ customer: customerId });

    const totalCount = basket && basket.products
      ? basket.products.reduce((acc, item) => acc + item.quantity, 0)
      : 0;

    res.json({ count: totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

