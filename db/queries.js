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
    console.log('-- searching for: ', directorName);
    try { 
        const movies = await Movie.find({ directors: directorName });
        return movies;
    } catch (err) {
        console.log('! error getting director:', err);
        return [];
    }
}

export async function getMoviesByGenre(genre) {
    console.log('-- searching for: ', genre);
    try { 
        const movies = await Movie.find({ genres: genre }).sort({ title: -1 });
        return movies;
    } catch (err) {
        console.log('! error getting genre:', err);
        return [];
    }
}

export async function getMoviesByIMDB(imdbRating) {
    console.log('-- searching for: ', imdbRating);
    try { 
        const movies = await Movie.find({ "imdb.rating": { $gt: Number(imdbRating) } });
        return movies;
    } catch (err) {
        console.log('! error getting rating:', err);
        return [];
    }
}

export async function getMoviesByActorsNames(actorsNames) {
    const names = actorsNames.split(',').map(n => n.trim());
    console.log('-- searching for: ', names);
    try { 
        const movies = await Movie.find({ 
            cast: { $all: names }
        });
        return movies;
    } catch (err) {
        console.log('! error getting actorsNames:', err);
        return [];
    }
}

export async function getMoviesByOnlyActorsNames(onlyActorsNames) {
    const names = onlyActorsNames.split(',').map(n => n.trim());
    console.log('-- searching for: ', names);
    try { 
        const movies = await Movie.find({ 
            cast: { $all: names, $size: 2 }
        });
        return movies;
    } catch (err) {
        console.log('! error getting onlyActorsNames:', err);
        return [];
    }
}

export async function updateMovieAvailability(title, platform) {
    const onPlatforms = platform.split(',').map(p => p.trim());
    console.log(`-- updating ${title}'s availability on ${onPlatforms}`);
    try {
        const movie = await Movie.updateOne(
            { title },
            { $addToSet: { available_on: { $each: onPlatforms } } }
        );
        return movie;
    } catch (err) {
        console.log('! error updating movie availability:', err);
        return null;
    }
}

export async function updateMovieMetacritic(title, value) {
    console.log(`-- updating (incrementing) ${title}'s metacritic value by ${value}`);
    try {
        const movie = await Movie.updateOne(
            { title },
            { $inc: { metacritic: value } }
        );
        return movie;
    } catch (err) {
        console.log('! error updating movie metacritic value:', err);
        return null;
    }
}


