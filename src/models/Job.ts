import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        salary: {
            type: String,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "closed"
            ],
            default: "pending",
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },


        jobType: {
            type: String,
            enum: ["Full-Time", "Part-Time"],
            default: "Full-Time",
        },

        applyLink: {
            type: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Job ||
mongoose.model("Job", JobSchema);