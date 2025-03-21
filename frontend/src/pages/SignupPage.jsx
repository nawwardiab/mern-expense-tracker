import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Signup = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("http://localhost:8000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccessMessage("Signup successful! Redirecting to Login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setErrorMessage(data.error || "Signup failed");
            }
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            {/* Left Side - Image Section */}
            <div className="w-1/2 bg-white flex items-center justify-center relative">
                <button 
                    onClick={() => navigate("/")} 
                    className="absolute top-4 left-4 text-black hover:text-gray-500 transition text-lg flex items-center"
                >
                    <FaHome className="mr-2" /> Home
                </button>
                <img
                    src="/signup.png"
                    alt="Signup"
                    className="w-full h-full object-contain object-center"
                />
            </div>

            {/* Right Side - Signup Form */}
            <div className="w-1/2 flex items-center justify-center bg-white p-10">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold mb-6">Create Account</h2>

                    {errorMessage && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
                            <span>❌</span> {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center flex items-center justify-center gap-2 mb-4">
                            <span>✅</span> {successMessage}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label className="block text-gray-700 font-medium">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Continue"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;