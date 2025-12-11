import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    hrEmail: {
        type: String,
        required: true,
    },
    packageName: {
        type: String,
        required: true,
    },
    employeeLimit: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    transactionId: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["completed", "failed", "pending"],
        default: "pending",
    },
});

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
