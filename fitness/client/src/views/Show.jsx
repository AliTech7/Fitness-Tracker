import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import RemoveActivity from "../components/RemoveActivity";

function Show() {
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        fetchActivity();
    }, [id, token, navigate]);

    const fetchActivity = () => {
        axios.get(`http://localhost:8000/activity/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            setActivity(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.log("Error fetching activity:", err);
            setError(err.response?.data?.message || "Error loading activity");
            setLoading(false);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <Link to="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info" role="alert">
                    Activity not found
                </div>
                <Link to="/dashboard" className="btn btn-primary">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header">
                    <h2>{activity.name}</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-8">
                            <dl className="row">
                                <dt className="col-sm-3">Type:</dt>
                                <dd className="col-sm-9">
                                    <span className={`badge bg-${
                                        activity.type === 'cardio' ? 'danger' :
                                        activity.type === 'strength' ? 'primary' :
                                        activity.type === 'flexibility' ? 'success' : 'info'
                                    }`}>
                                        {activity.type}
                                    </span>
                                </dd>

                                <dt className="col-sm-3">Duration:</dt>
                                <dd className="col-sm-9">{activity.duration} minutes</dd>

                                <dt className="col-sm-3">Date:</dt>
                                <dd className="col-sm-9">{formatDate(activity.date)}</dd>

                                <dt className="col-sm-3">Description:</dt>
                                <dd className="col-sm-9">
                                    {activity.description || "No description provided"}
                                </dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <div className="d-flex gap-2">
                        <Link 
                            to={`/activity/edit/${activity._id}`}
                            className="btn btn-warning"
                        >
                            Edit
                        </Link>
                        <RemoveActivity 
                            activityId={activity._id}
                            cd={() => navigate("/dashboard")}
                        />
                        <Link 
                            to="/dashboard"
                            className="btn btn-secondary"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Show; 