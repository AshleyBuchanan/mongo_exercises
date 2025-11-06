import Movie from "../models/Movie.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

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

export async function getMoviesByDirectorAndGenre(genre, directorName) {
    console.log(`-- searching for: ${genre} movies by ${directorName}`);
    try {
        const movies = await Movie.find({
            genres: genre,
            directors: directorName
        });
        return movies;
    } catch (err) {
        console.log('! error getting genre and directorName', err);
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

export async function updateMovieGenres(year, genres) {
    const addGenres = genres.split(',').map(g => g.trim());
    console.log(`-- updating movies from ${year} genres with ${addGenres}`);
    try {
        const movies = await Movie.updateMany(
            { year },
            { $addToSet: { genres: { $each: addGenres } } }
        );
        return movies;
    } catch (err) {
        console.log(`! error updating movies' genres: ${err}`);
        return null;
    }
}

export async function updateMovieIMDBRating(imdbRating, value) {
    console.log(`-- updating movies with imdbRating of ${imdbRating} or less, by ${value}`);
    try {
        const movies = await Movie.updateMany(
            { "imdb.rating": { $lt: Number(imdbRating) }},
            { $inc: { "imdb.rating": Number(value) }}
        );
        return movies;
    } catch (err) {
        console.log(`! error updating movies' imdbRating: ${err}`);
        return null;
    }
}

export async function deleteMovieById(_id) {
    console.log(`-- deleting movie with ${_id}`);
    try {
        const movie = await Movie.deleteOne(
            { _id: _id }
        );
        return movie;
    } catch (err) {
        console.log(`! error deleting movie: ${err}`);
        return null;
    }
}

export async function deleteAllMovieComments(title) {
    console.log(`-- deleting all ${title}'s comments.`);
    try {
        const movie = await Movie.findOne(
            { title: title }
        );
        console.log(movie.id)
        const comments = await Comment.deleteMany(
            { movie_id: movie._id }
        );

        return comments;
    } catch (err) {
        console.log(`! error deleting comments: ${err}`);
        return null;
    }
}

export async function deleteAllMoviesWithNoGenres() {
    console.log('-- deleting all movies with no genres.');
    try {
        const movies = await Movie.deleteMany(
            { $or: [
                { genres: { $exists: false} },
                { genres: { $size: 0 } }
            ] }
        );
        
        return movies;
    } catch (err) {
        console.log(`! error deleting movies: ${err}`);
        return null;
    }
}

export async function aggregateMoviesPerYear() {
    console.log('-- aggregate movies per year.');
    try {
        const movies = await Movie.aggregate(
            [
                { $group: {
                    _id: "$year",           //<-- needed an accumulator
                    total_movies: { $sum: 1 }
                }},

                { $sort: { _id: 1 } },

                { $project: {
                    _id: 0,                 //<-- this removes _id 
                    year: "$_id",           //<-- this adds year 
                    total_movies: 1         //<-- this keeps total_movies
                }}
            ]
        );
        
        return movies;
    } catch (err) {
        console.log(`! error aggregating movies: ${err}`);
        return null;
    }
}

export async function aggregateAverageIMDBRatingsByDirector() {
    console.log('-- aggregate average imdb.rating by directors names.');
    try {
        const movies = await Movie.aggregate(
            [
                { $unwind: "$directors" },      //<-- to get each director in the array

                { $group: {
                    _id: "$directors",           
                    avg_rating: { $avg: "$imdb.rating" }
                }},

                { $sort: { avg_rating: -1 } },  //<-- descending

                { $project: {
                    _id: 0,                                                 //<-- this removes _id 
                    avg_rating: { $round: ["$avg_rating", 2] },             //<-- this keeps avg_rating and rounds to two decimal places
                    director: "$_id"                                        //<-- this adds director 
                }}
            ]
        );
        
        return movies;
    } catch (err) {
        console.log(`! error aggregating movies by director: ${err}`);
        return null;
    }
}

