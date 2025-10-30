import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getAllUsers, addUser } from "./db/queries.js";

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
    .then(() => console.log('mongodb connected'))
    .catch(err => console.error('mongodb connection error:', err));

//routes
app.get("/", async (req, res) => {
    const users = await getAllUsers();
    res.render("index", { users });
});

app.post("/add", async (req, res) => {
    await addUser(req.body.name, req.body.email);
    res.redirect("/");
});

//listener
app.listen(process.env.PORT, () => {
    console.log('server running on port: ', process.env.PORT);
});





