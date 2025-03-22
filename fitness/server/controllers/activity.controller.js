const Activity = require('../models/activity.model');

module.exports = {
    // Create a new activity
    createActivity: async (req, res) => {
        try {
            // Add user ID from JWT token to the activity data
            const activityData = { ...req.body, user: req.user._id };
            
            const activity = await Activity.create(activityData);
            res.status(201).json(activity);
        } catch (err) {
            res.status(400).json({ 
                message: "Error creating activity",
                errors: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
                    acc[key] = err.errors[key].message;
                    return acc;
                }, {}) : err.message
            });
        }
    },

    // Get all activities for the logged-in user
    getAllActivities: async (req, res) => {
        try {
            const activities = await Activity.find({ user: req.user._id })
                .sort({ date: -1 }); // Sort by date descending
            res.json(activities);
        } catch (err) {
            res.status(400).json({ 
                message: "Error fetching activities",
                error: err.message 
            });
        }
    },

    // Get one activity by id
    getOneActivity: async (req, res) => {
        try {
            const activity = await Activity.findOne({ 
                _id: req.params.id,
                user: req.user._id 
            });
            
            if (!activity) {
                return res.status(404).json({ message: "Activity not found" });
            }
            
            res.json(activity);
        } catch (err) {
            res.status(400).json({ 
                message: "Error fetching activity",
                error: err.message 
            });
        }
    },

    // Update an activity
    updateActivity: async (req, res) => {
        try {
            const activity = await Activity.findOneAndUpdate(
                { 
                    _id: req.params.id,
                    user: req.user._id 
                },
                req.body,
                { 
                    new: true,
                    runValidators: true 
                }
            );

            if (!activity) {
                return res.status(404).json({ message: "Activity not found" });
            }

            res.json(activity);
        } catch (err) {
            res.status(400).json({ 
                message: "Error updating activity",
                errors: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
                    acc[key] = err.errors[key].message;
                    return acc;
                }, {}) : err.message
            });
        }
    },

    // Delete an activity
    deleteActivity: async (req, res) => {
        try {
            const activity = await Activity.findOneAndDelete({ 
                _id: req.params.id,
                user: req.user._id 
            });

            if (!activity) {
                return res.status(404).json({ message: "Activity not found" });
            }

            res.json({ message: "Activity successfully deleted" });
        } catch (err) {
            res.status(400).json({ 
                message: "Error deleting activity",
                error: err.message 
            });
        }
    },

    // Get activity statistics for the logged-in user
    getActivityStats: async (req, res) => {
        try {
            const stats = await Activity.aggregate([
                { $match: { user: req.user._id } },
                { 
                    $group: {
                        _id: "$type",
                        totalDuration: { $sum: "$duration" },
                        count: { $sum: 1 },
                        avgDuration: { $avg: "$duration" }
                    }
                }
            ]);

            res.json(stats);
        } catch (err) {
            res.status(400).json({ 
                message: "Error fetching activity statistics",
                error: err.message 
            });
        }
    }
}; 