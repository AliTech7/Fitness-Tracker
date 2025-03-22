import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("authToken");

    // If user is already logged in, redirect to dashboard
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="container-fluid p-0">
            {/* Hero Section */}
            <div className="bg-primary text-white py-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="display-4.8 fw-bold text-green">Monitor Your Fitness Progress</h1>
                            <p className="lead">
                                Track your workouts, monitor your progress, and reach your fitness goals effortlessly 
                                with our user-friendly fitness tracking application.
                            </p>
                            <div className="d-flex gap-3 mt-4">
                                <Link to="/register" className="btn btn-light btn-lg">
                                    Get Started
                                </Link>
                                <Link to="/login" className="btn btn-outline-light btn-lg">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {/* You can add an illustration or image here */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="container py-5">
                <h2 className="text-center mb-5">Key Features</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <i className="bi bi-calendar3 fs-1 text-primary"></i>
                                </div>
                                <h3 className="card-title h5">Activity Tracking</h3>
                                <p className="card-text">
                                Record and track your daily workouts with comprehensive details on duration, 
                                type, and progress.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <i className="bi bi-graph-up fs-1 text-primary"></i>
                                </div>
                                <h3 className="card-title h5">Progress Monitoring</h3>
                                <p className="card-text">
                                See your fitness journey progress with detailed logs and 
                                track your improvements over time.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body text-center">
                                <div className="mb-3">
                                    <i className="bi bi-person-check fs-1 text-primary"></i>
                                </div>
                                <h3 className="card-title h5">Personal Dashboard</h3>
                                <p className="card-text">
                                Access your personalized dashboard to track your activities 
                                and view your fitness stats.                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="bg-light py-5">
                <div className="container text-center">
                    <h2 className="mb-4">Ready to Start Your Fitness Journey?</h2>
                    <p className="lead mb-4">
                    Sign up today and take the first step toward reaching your fitness goals.</p>
                    <Link to="/register" className="btn btn-primary btn-lg">
                        Create Free Account
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-dark text-white py-4">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">© 2025</p>
                        </div>
                        <div className="col-md-6 text-md-end">
                        </div>

                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home; 