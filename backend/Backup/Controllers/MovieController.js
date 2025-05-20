const Movie = require('../Model/MovieModel');

// Generate Movie ID with leading zeros
const generateMovieId = async () => {
    const lastMovie = await Movie.findOne().sort({ MID: -1 }).limit(1);
    const lastId = lastMovie ? parseInt(lastMovie.MID.replace('M', ''), 10) : 0;
    const newId = `M${(lastId + 1).toString().padStart(3, '0')}`; // Adjust padding as needed
    return newId;
};

// Create a new Movie item
exports.createMovie = async (req, res) => {
    try {
        const {image, name, rate, status, description } = req.body;
        const MID = await generateMovieId(); // Generate new Movie ID
        const newMovie = new Movie({ MID, name, rate, status, image, description });
        await newMovie.save();

        res.status(201).json({ message: 'Movie created successfully', Movie: newMovie });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Movie', error });
    }
};

// Get all Movie items
exports.getAllMovie = async (req, res) => {
    try {
        const Movie = await Movie.find();
        res.status(200).json(movie);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving movie', error });
    }
};

// Get a single Movie item by ID
exports.getMovieById = async (req, res) => {
    const id = req.params.id;

    try {
        const Movie = await Movie.findById(id);
        if (!Movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(Movie);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving Movie', error });
    }
};

// Update a Movie item by ID
exports.updateMovie = async (req, res) => {
    const id = req.params.id;
    const { image ,name, rate, status, description } = req.body;

    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            { name, rate, status, image, description },
            { new: true } // Return the updated Movie
        );

        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ message: 'Movie updated successfully', Movie: updatedMovie });
    } catch (error) {
        res.status(500).json({ message: 'Error updating Movie', error });
    }
};

// Delete a Movie item by ID
exports.deleteMovie = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting Movie', error });
    }
};
