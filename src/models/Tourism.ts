import mongoose from "mongoose";

const TourismSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    place: String,

    location: {
        latitude: Number,
        longitude: Number,
    },
});

export default mongoose.models.Tourism ||
mongoose.model("Tourism", TourismSchema);