import Inquiry from "../models/inquiry.js";
import { isItAdmin, isItCustomer } from "./userController.js";

export async function addInquiry(req, res) {
    try {
        if (isItCustomer(req)) {
            const data = req.body;
            data.email = req.user.email;
            data.phone = req.user.phone;

            let id = 0;
            const inquiries = await Inquiry.find().sort({ id: -1 }).limit(1);
            id = inquiries.length === 0 ? 1 : inquiries[0].id + 1;

            data.id = id;
            data.reply = ""; // default empty reply
            data.repliedAt = null;

            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save();

            res.json({ message: "Inquiry added successfully", id: response.id });
        } else {
            res.status(403).json({ message: "You are not a customer" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add inquiry" });
    }
}

export async function getInquiry(req, res) {
    try {
        if (isItCustomer(req)) {
            const inquiries = await Inquiry.find({ email: req.user.email });
            res.json(inquiries);
        } else if (isItAdmin(req)) {
            const inquiries = await Inquiry.find();
            res.json(inquiries);
        } else {
            res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get inquiries" });
    }
}

export async function deleteInquiry(req, res) {
    try {
        const id = req.params.id;
        if (isItAdmin(req)) {
            await Inquiry.deleteOne({ id });
            res.json({ message: "Inquiry deleted successfully" });
        } else if (isItCustomer(req)) {
            const inquiry = await Inquiry.findOne({ id });
            if (!inquiry) {
                res.status(404).json({ message: "Inquiry not found" });
                return;
            }
            if (inquiry.email === req.user.email) {
                await Inquiry.deleteOne({ id });
                res.json({ message: "Inquiry deleted successfully" });
            } else {
                res.status(403).json({ message: "You are not authorized to delete this inquiry" });
            }
        } else {
            res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete inquiry" });
    }
}

export async function updateInquiry(req, res) {
    try {
        const id = req.params.id;
        const data = req.body;

        if (isItAdmin(req)) {
            // Admin can update reply and status
            const updateData = {
                reply: data.reply || "",
                repliedAt: new Date(),
            };
            await Inquiry.updateOne({ id }, updateData);
            res.json({ message: "Admin reply added successfully" });
        } else if (isItCustomer(req)) {
            // Customer can only update their own inquiry message
            const inquiry = await Inquiry.findOne({ id });
            if (!inquiry) {
                res.status(404).json({ message: "Inquiry not found" });
                return;
            }
            if (inquiry.email === req.user.email) {
                await Inquiry.updateOne({ id }, { message: data.message });
                res.json({ message: "Inquiry updated successfully (customer)" });
            } else {
                res.status(403).json({ message: "You are not authorized to perform this action" });
            }
        } else {
            res.status(403).json({ message: "You are not authorized to perform this action" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update inquiry" });
    }
}
