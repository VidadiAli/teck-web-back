import Basket from "../models/basket.model.js";
import { Product } from "../models/product.model.js";

export const getBasket = async (req, res) => {
    try {
        const customerId = req.user.id;

        const basket = await Basket.findOne({ customer: customerId })
            .populate("products.productId")
            .lean();

        if (!basket || !basket.products.length) {
            return res.json({ items: [], count: 0 });
        }

        const items = basket.products
            .filter(item => item.productId) // silinmiş product varsa skip
            .map(item => ({
                ...item.productId,
                quantity: item.quantity
            }));

        const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);

        res.json({ items, count: totalCount });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addToBasket = async (req, res) => {
    try {
        const customerId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product)
            return res.status(404).json({ message: "Product not found" });

        let basket = await Basket.findOne({ customer: customerId });

        if (!basket) {
            basket = new Basket({ customer: customerId, products: [] });
        }

        const existingItem = basket.products.find(
            i => i.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            basket.products.push({
                productId,
                quantity
            });
        }

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

