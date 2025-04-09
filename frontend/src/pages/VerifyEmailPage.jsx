import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying...");
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setMessage("Invalid or missing token.");
                setStatus("error");
                return;
            }

            try {
                const res = await axios.get(`/users/verify-email?token=${token}`);

                if (res.data.success) {
                    setMessage("✅ Your email has been verified! You can now log in.");
                    setStatus("success");

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    setMessage("Invalid or expired verification link.");
                    setStatus("error");
                }
            } catch (err) {
                console.error(err);
                setMessage("Invalid or expired verification link.");
                setStatus("error");
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className={`text-2xl font-semibold mb-4 ${status === "success" ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </h1>
                {status === "loading" && <p>Please wait while we verify your email...</p>}
                {status === "success" && <p>Redirecting to login page...</p>}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
