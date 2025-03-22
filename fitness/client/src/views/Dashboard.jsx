import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import RemoveActivity from "../components/RemoveActivity";

function Dashboard() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // For error handling
    const navigate = useNavigate();
    const token = localStorage.getItem("authToken");

    const fetchActivities = useCallback(() => {
        setLoading(true);
        setError(null); // Reset the error state before making a request
        axios.get("http://localhost:8000/activity", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            setActivities(res.data);
            setLoading(false); // Set loading to false once data is fetched
        })
        .catch(err => {
            setLoading(false); // Set loading to false in case of error
            setError("Failed to fetch activities. Please try again later.");
            console.log("Error fetching activities:", err);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        });
    }, [token, navigate]);

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        fetchActivities();
    }, [token, navigate, fetchActivities]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>My Activities</h2>
                <Link to="/activity/new" className="btn btn-primary">
                    Add New Activity
                </Link>
            </div>

            {loading ? (
                <div className="alert alert-info">Loading activities...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : activities.length === 0 ? (
                <div className="alert alert-info">
                    No activities found. Start by adding a new activity!
                </div>
            ) : (
                <div className="row">
                    {activities.map((activity) => (
                        <div key={activity._id} className="col-md-6 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        <Link 
                                            to={`/activity/${activity._id}`}
                                            className="text-decoration-none"
                                        >
                                            {activity.name}
                                        </Link>
                                    </h5>
                                    <p className="card-text">
                                        <strong>Type:</strong> {activity.type}<br />
                                        <strong>Duration:</strong> {activity.duration} minutes<br />
                                        <strong>Date:</strong> {formatDate(activity.date)}<br />
                                        <strong>Description:</strong> {activity.description}
                                    </p>
                                    <div className="d-flex gap-2">
                                        <Link 
                                            to={`/activity/edit/${activity._id}`}
                                            className="btn btn-warning"
                                        >
                                            Edit
                                        </Link>
                                        <RemoveActivity 
                                            activityId={activity._id} 
                                            cd={fetchActivities}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
