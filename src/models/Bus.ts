import mongoose from "mongoose";

const BusSchema = new mongoose.Schema(
    {
        route: {
            type: String,
            required: true,
            trim: true,
        },

        time: {
            type: String,
            required: true,
        },

        busName: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["Government", "Private"],
            default: "Government",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Bus ||
mongoose.model("Bus", BusSchema);