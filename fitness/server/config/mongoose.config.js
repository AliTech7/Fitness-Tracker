const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitness_tracker';

mongoose.connect(dbUri)
    .then(() => {
        console.log('Successfully connected to MongoDB.');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    });

mongoose.set('debug', process.env.NODE_ENV !== 'production'); // Enable debugging in development

// Handle MongoDB connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected.');
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    });
});

module.exports = mongoose;
