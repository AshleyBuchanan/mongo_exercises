import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: String,
    directors: Array,
    imdb: Object
});

export default mongoose.model("Movie", movieSchema);
