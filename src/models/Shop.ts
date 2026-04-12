import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
        },

        photo: {
            type: String,
        },

        address: {
            type: String,
            required: true,
        },

        location: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },

        phone: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Shop ||
mongoose.model("Shop", ShopSchema);