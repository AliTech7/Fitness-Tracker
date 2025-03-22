import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
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
        if (!user.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(user.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!user.password) {
            newErrors.password = "Password is required";
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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

        axios.post("http://localhost:8000/user/login", user)
            .then(res => {
                console.log("Login successful:", res.data);
                // Store the token and user info
                localStorage.setItem("authToken", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/dashboard");
            })
            .catch(err => {
                console.log("Login error:", err);
                if (err.response?.data?.message) {
                    setErrors({ general: err.response.data.message });
                } else {
                    setErrors({ general: "An error occurred during login" });
                }
            });
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            
                            {errors.general && (
                                <div className="alert alert-danger">{errors.general}</div>
                            )}

                            <form onSubmit={handleSubmit}>
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

                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        Login
                                    </button>
                                </div>
                            </form>

                            <div className="text-center mt-3">
                                <p>
                                    Don't have an account?{" "}
                                    <Link to="/register">Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login; 