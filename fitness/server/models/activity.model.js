const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Activity name is required"],
        minlength: [3, "Activity name must be at least 3 characters long"],
        trim: true
    },
    type: {
        type: String,
        required: [true, "Activity type is required"],
        enum: {
            values: ['cardio', 'strength', 'flexibility', 'sports'],
            message: "Activity type must be either 'cardio', 'strength', 'flexibility', or 'sports'"
        }
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 minute"],
        max: [1440, "Duration cannot exceed 24 hours (1440 minutes)"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        validate: {
            validator: function(value) {
                // Ensure date is not in the future
                return value <= new Date();
            },
            message: "Activity date cannot be in the future"
        }
    },
    description: {
        type: String,
        maxlength: [500, "Description cannot exceed 500 characters"],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required"]
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Add index for efficient querying
ActivitySchema.index({ user: 1, date: -1 });

// Virtual for duration in hours (getter only)
ActivitySchema.virtual('durationHours').get(function() {
    return (this.duration / 60).toFixed(2);
});

// Ensure virtuals are included in JSON output
ActivitySchema.set('toJSON', { virtuals: true });
ActivitySchema.set('toObject', { virtuals: true });

// Pre-save middleware for additional validations
ActivitySchema.pre('save', function(next) {
    // Additional custom validations could go here
    next();
});

// Custom method to format date
ActivitySchema.methods.formatDate = function() {
    return this.date.toLocaleDateString();
};

// Static method to find user's activities by type
ActivitySchema.statics.findByType = function(userId, type) {
    return this.find({ user: userId, type: type }).sort({ date: -1 });
};

// Static method to get user's activity summary
ActivitySchema.statics.getUserSummary = async function(userId) {
    return this.aggregate([
        { $match: { user: mongoose.Types.ObjectId(userId) } },
        { 
            $group: {
                _id: "$type",
                totalDuration: { $sum: "$duration" },
                count: { $sum: 1 },
                avgDuration: { $avg: "$duration" }
            }
        }
    ]);
};

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity; 