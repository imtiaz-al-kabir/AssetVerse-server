import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    employeeLimit: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        default: [],
    },
});

const Package = mongoose.model("Package", packageSchema);
export default Package;
