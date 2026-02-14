import ItemStatus from "../models/user.js";

export const getRequestResultFromSalesCompany = async (req, res) => {
    try {
        const users = await ItemStatus.find().exec();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            err: error,
            message: 'Məlumatlar alınarkən xəta baş verdi'
        })
    }
};


export const createRequestForSalesCompany = async (req, res) => {
    try {
        const newItemStatus = await ItemStatus.create(req.body);

        res.status(201).json({
            message: "Məlumat uğurla yaradıldı ✅",
            data: newItemStatus,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Məlumat yaradılarkən xəta baş verdi",
        });
    }
};
