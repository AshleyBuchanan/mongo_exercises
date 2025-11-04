import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    name: String,
    movie_id: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" }
});

export default mongoose.model("Comment", commentSchema);
