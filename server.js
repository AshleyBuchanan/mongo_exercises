import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getAllUsers, addUser, getMoviesByDirector, getMoviesByGenre, getMoviesByIMDB } from "./db/queries.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ejs, views, static (public)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('- mongodb connected'))
    .catch(err => console.error('- mongodb connection error:', err));

//routes
app.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.render("index", { users });
});

app.post("/addUser", async (req, res) => {
    await addUser(req.body.name, req.body.email);
    res.redirect("/");
});

app.post("/getMoviesByDirector", async (req, res) => {
    const movies = await getMoviesByDirector(req.body.directorName);
    movies.forEach(m => { console.log('---',m.title)});
    res.redirect("/");
});

app.post("/getMoviesByGenre", async (req, res) => {
    const movies = (await getMoviesByGenre(req.body.genre));
    //movies.forEach(m => { console.log('---',m.title)});
    console.log(`--- there are ${movies.length} sorted in descending order`);
    console.log(`--- starting with:  ${movies[0].title}, ${movies[1].title}, ${movies[2].title}`);
    console.log(`--- ending with: ...${movies[movies.length-3].title}, ${movies[movies.length-2].title}, ${movies[movies.length-1].title}`);
    res.redirect("/");
});

app.post("/getMoviesByIMDB", async (req, res) => {
    console.log(req.body.imdbRating);
    const movies = await getMoviesByIMDB(req.body.imdbRating);
    movies.forEach(m => { console.log(`--- ${m.title} ${m.imdb.rating}`)});
    res.redirect("/");
});

//listener
app.listen(process.env.PORT, () => {
    console.log('- server running on port: ', process.env.PORT);
});





