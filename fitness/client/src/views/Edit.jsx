import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Edit() {
    const [activity, setActivity] = useState({
        name: "",
        duration: "",
        type: "",
        date: "",
        description: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        // Fetch the activity data
        axios.get(`http://localhost:8000/activity/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            const activityData = res.data;
            // Format the date to YYYY-MM-DD for the input field
            activityData.date = new Date(activityData.date).toISOString().split('T')[0];
            setActivity(activityData);
        })
        .catch(err => {
            console.log("Error fetching activity:", err);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        });
    }, [id, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.put(`http://localhost:8000/activity/${id}`, activity, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            console.log("Activity updated:", res.data);
            navigate("/dashboard");
        })
        .catch(err => {
            console.log("Error:", err);
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            }
        });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Edit Activity</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Activity Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={activity.name}
                        onChange={handleChange}
                    />
                    {errors.name && <span className="text-danger">{errors.name}</span>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Duration (minutes):</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        value={activity.duration}
                        onChange={handleChange}
                    />
                    {errors.duration && <span className="text-danger">{errors.duration}</span>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Type:</label>
                    <select
                        className="form-control"
                        name="type"
                        value={activity.type}
                        onChange={handleChange}
                    >
                        <option value="">Select Type</option>
                        <option value="cardio">Cardio</option>
                        <option value="strength">Strength Training</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="sports">Sports</option>
                    </select>
                    {errors.type && <span className="text-danger">{errors.type}</span>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={activity.date}
                        onChange={handleChange}
                    />
                    {errors.date && <span className="text-danger">{errors.date}</span>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={activity.description}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                    {errors.description && <span className="text-danger">{errors.description}</span>}
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">Update Activity</button>
                    <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Edit; 