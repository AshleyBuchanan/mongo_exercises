import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { 
    getAllUsers, 
    addUser, 
    getMoviesByDirector, 
    getMoviesByGenre, 
    getMoviesByIMDB, 
    getMoviesByActorsNames, 
    getMoviesByOnlyActorsNames,
    getMoviesByDirectorAndGenre,
    updateMovieAvailability,
    updateMovieMetacritic, 
    updateMovieGenres,
    updateMovieIMDBRating,
    deleteMovieById,
    deleteAllMovieComments,
    deleteAllMoviesWithNoGenres,
    aggregateMoviesPerYear,
    aggregateAverageIMDBRatingsByDirector
} from "./db/queries.js";

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
    //console.log(req.body.imdbRating);
    const movies = await getMoviesByIMDB(req.body.imdbRating);
    movies.forEach(m => { console.log(`--- ${m.title} ${m.imdb.rating}`)});
    res.redirect("/");
});

app.post("/getMoviesByActorsNames", async (req, res) => {
    //console.log(req.body.actorsNames);
    const movies = await getMoviesByActorsNames(req.body.actorsNames);
    movies.forEach(m => { console.log(`--- ${m.title} cast: [ ${m.cast} ]`)});
    res.redirect("/");
});

app.post("/getMoviesByOnlyActorsNames", async (req, res) => {
    //console.log(req.body.onlyActorsNames);
    const movies = await getMoviesByOnlyActorsNames(req.body.onlyActorsNames);
    movies.forEach(m => { console.log(`--- ${m.title} cast: [ ${m.cast} ]`)});
    res.redirect("/");
});

app.post("/getMoviesByDirectorAndGenre", async (req, res) => {
    //console.log(`${req.body.genre} ${req.body.directorName}`);
    const movies = await getMoviesByDirectorAndGenre(req.body.genre, req.body.directorName);
    movies.forEach(m => { console.log(`--- ${m.title} cast: [ ${m.cast} ]`)});
    res.redirect("/");
});

app.post("/updateMovieAvailability", async (req, res) => {
    //console.log(`${req.body.title} ${req.body.platform}`);
    const movie = await updateMovieAvailability(req.body.title, req.body.platform);
    console.log(movie);
    res.redirect("/");
});

app.post("/updateMovieMetacritic", async (req, res) => {
    //console.log(`${req.body.title} ${req.body.value}`);
    const movie = await updateMovieMetacritic(req.body.title, req.body.value);
    console.log(movie);
    res.redirect("/");
});

app.post("/updateMovieGenres", async (req, res) => {
    //console.log(`${req.body.year} ${req.body.genres}`);
    const movies = await updateMovieGenres(req.body.year, req.body.genres);
    console.log(movies);
    res.redirect("/");
});

app.post("/updateMovieIMDBRating", async (req, res) => {
    //console.log(`${req.body.imdbRating} ${req.body.value}`);
    const movies = await updateMovieIMDBRating(req.body.imdbRating, req.body.value);
    console.log(movies);
    res.redirect("/");
});

app.post("/deleteMovieById", async (req, res) => {
    //console.log(req.body._id);
    const movie = await deleteMovieById(req.body._id);
    console.log(movie);
    res.redirect("/");
});

app.post("/deleteAllMovieComments", async (req, res) => {
    //console.log(req.body.title);
    const movie = await deleteAllMovieComments(req.body.title);
    console.log(movie);
    res.redirect("/");
});

app.post("/deleteAllMoviesWithNoGenres", async (req, res) => {
    //console.log('no genres');
    const movies = await deleteAllMoviesWithNoGenres();
    console.log(movies);
    res.redirect("/");
});

app.post("/aggregateMoviesPerYear", async (req, res) => {
    //console.log('aggregate movies per year');
    const movies = await aggregateMoviesPerYear();
    console.log(movies);
    res.redirect("/");
});

app.post("/aggregateAverageIMDBRatingsByDirector", async (req, res) => {
    console.log('aggregate average imdb.rating by directors names');
    const movies = await aggregateAverageIMDBRatingsByDirector();
    console.log(movies);
    res.redirect("/");
});

//listener
app.listen(process.env.PORT, () => {
    console.log('- server running on port: ', process.env.PORT);
});





