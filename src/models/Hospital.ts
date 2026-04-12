import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        type: {
            type: String,
            required: true,
        },

        photo: {
            type: String, // Image URL (same as Shop)
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

        emergency: {
            type: Boolean,
            default: false,
        },

        description: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Hospital ||
mongoose.model("Hospital", HospitalSchema);