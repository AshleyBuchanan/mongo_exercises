import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: String,
    directors: Array,
    imdb: Object,
    cast: Array,
    available_on: Array,
    metacritic: Number,
    genres: Array,
    year: Number
});

export default mongoose.model("Movie", movieSchema);
