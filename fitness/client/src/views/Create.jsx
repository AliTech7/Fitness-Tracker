import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
    const [activity, setActivity] = useState({
        name: "",
        duration: "",
        type: "",
        date: "",
        description: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post("http://localhost:8000/activity", activity, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            console.log("Activity created:", res.data);
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
            <h2 className="mb-4">Add New Activity</h2>
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

                <button type="submit" className="btn btn-primary">Add Activity</button>
            </form>
        </div>
    );
}

export default Create; 