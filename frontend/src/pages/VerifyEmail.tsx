import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { BACKEND_URL, ROUTES } from "../constants";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";

const VerifyEmail = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const { updateUser } = useAuthStore();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/auth/verify-email/${token}`);
                if (response.data.success) {
                    setStatus("success");
                    setMessage(response.data.message);
                    toast.success("Email verified successfully!");
                    // Sync store: update isVerified so ProtectedRoute doesn't redirect
                    updateUser({ isVerified: true });
                }
            } catch (error: any) {
                setStatus("error");
                setMessage(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
                toast.error("Verification failed");
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, updateUser]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4" data-testid="verify-email-page">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center"
                data-testid="verify-email-card"
            >
                {status === "loading" && (
                    <div className="space-y-6" data-testid="verify-email-loading">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Verifying your email</h1>
                            <p className="text-slate-500">Please wait while we confirm your email address...</p>
                        </div>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6" data-testid="verify-email-success">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Email Verified!</h1>
                            <p className="text-slate-500" data-testid="verify-email-message">{message}</p>
                        </div>
                        <button
                            onClick={() => navigate(ROUTES.LOGIN)}
                            data-testid="verify-email-login-btn"
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
                        >
                            Back to Login
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6" data-testid="verify-email-error">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
                            <p className="text-slate-500" data-testid="verify-email-error-message">{message}</p>
                        </div>
                        <div className="space-y-4">
                            <Link
                                to={ROUTES.LOGIN}
                                data-testid="verify-email-error-login-link"
                                className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold hover:bg-slate-800 transition-all"
                            >
                                Back to Login
                            </Link>
                            <p className="text-sm text-slate-400">
                                Need help? <span className="text-blue-500 cursor-pointer hover:underline">Contact Support</span>
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
