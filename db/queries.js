import Movie from "../models/Movie.js";
import User from "../models/User.js";

export async function getAllUsers() {
    try {
        const users = await User.find();
        return users;
    } catch (err) {
        console.error('error getting users:', err);
        return [];
    }
}

export async function addUser(name, email) {
    try {
        const user = new User({ name, email });
        await user.save();
        console.log('-- added user:', name);
    } catch (err) {
        console.log('! error adding user:', err);
    }
}

export async function getMoviesByDirector(directorName) {
    console.log('--searching for: ', directorName);
    try { 
        const movies = await Movie.find({ directors: directorName });
        return movies;
    } catch (err) {
        console.log('! error getting director:', err);
        return [];
    }
}

export async function getMoviesByGenre(genre) {
    console.log('--searching for: ', genre);
    try { 
        const movies = await Movie.find({ genres: genre }).sort({ title: -1 });
        return movies;
    } catch (err) {
        console.log('! error getting genre:', err);
        return [];
    }
}

export async function getMoviesByIMDB(imdbRating) {
    console.log('--searching for: ', imdbRating);
    try { 
        const movies = await Movie.find({ "imdb.rating": { $gt: Number(imdbRating) } });
        console.log(movies[0])
        return movies;
    } catch (err) {
        console.log('! error getting rating:', err);
        return [];
    }
}


