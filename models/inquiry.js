import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
    id: Number,
    email: String,
    phone: String,
    subject: String,
    message: String,
    reply: { type: String, default: "" },
    repliedAt: { type: Date, default: null },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
