import { useState } from "react";

const ForgotPasswordForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await onSubmit(formData.password);
            setSuccessMessage("Password reset successful!");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-4" onSubmit={handleReset}>
            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-center">
                    ❌ {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-center">
                    ✅ {successMessage}
                </div>
            )}
            <div>
                <label className="block text-gray-700 font-medium">New Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium">Confirm New Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
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
                {loading ? "Resetting..." : "Reset Password"}
            </button>
        </form>
    );
};

export default ForgotPasswordForm;