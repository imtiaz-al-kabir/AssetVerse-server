import express from "express";
import Package from "../models/Package.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const packages = await Package.find();
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
