import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // If user is already logged in, redirect to dashboard
        if (localStorage.getItem("authToken")) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // First Name validation
        if (!user.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (user.firstName.length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        }

        // Last Name validation
        if (!user.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (user.lastName.length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        }

        // Email validation
        if (!user.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Email is invalid";
        }

        // Password validation
        if (!user.password) {
            newErrors.password = "Password is required";
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        // Confirm Password validation
        if (!user.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (user.password !== user.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        // Remove confirmPassword before sending to server
        const { confirmPassword, ...registrationData } = user;

        axios.post("http://localhost:8000/user/register", registrationData)
            .then(res => {
                console.log("Registration successful:", res.data);
                // Optionally auto-login user
                localStorage.setItem("authToken", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/dashboard");
            })
            .catch(err => {
                console.log("Registration error:", err);
                if (err.response?.data?.errors) {
                    setErrors(err.response.data.errors);
                } else if (err.response?.data?.message) {
                    setErrors({ general: err.response.data.message });
                } else {
                    setErrors({ general: "An error occurred during registration" });
                }
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Register</h2>
                            
                            {errors.general && (
                                <div className="alert alert-danger">{errors.general}</div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">First Name:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleChange}
                                    />
                                    {errors.firstName && (
                                        <div className="invalid-feedback">{errors.firstName}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Last Name:</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && (
                                        <div className="invalid-feedback">{errors.lastName}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password:</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        name="password"
                                        value={user.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Confirm Password:</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                        name="confirmPassword"
                                        value={user.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    {errors.confirmPassword && (
                                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                                    )}
                                </div>

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Register
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <p>
                                    Already have an account?{" "}
                                    <Link to="/login">Login here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register; 
