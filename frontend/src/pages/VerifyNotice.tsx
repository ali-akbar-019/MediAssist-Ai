import { motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Mail, ArrowRight, CheckCircle2, ShieldCheck, Clock, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/button";
import { ROUTES, BACKEND_URL } from "../constants";
import { toast } from "sonner";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

const VerifyNotice = () => {
    const location = useLocation();
    const { user, updateUser } = useAuthStore();
    const [isResending, setIsResending] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const email = location.state?.email || user?.email;

    // If no email and no user, redirect to login
    if (!email && !user) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    // If user is already verified, redirect to dashboard
    if (user?.isVerified) {
        return <Navigate to={ROUTES.DASHBOARD} replace />;
    }

    const handleResendEmail = async () => {
        setIsResending(true);
        try {
            const res = await axios.post(`${BACKEND_URL}/api/auth/resend-verification`, { email });
            if (res.data.success) {
                toast.success("Verification email resent!");
            }
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to resend email.";
            toast.error(message);
            
            // If already verified according to backend, update store
            if (message.toLowerCase().includes("already verified")) {
                updateUser({ isVerified: true });
            }
        } finally {
            setIsResending(false);
        }
    };

    const refreshStatus = async () => {
        setIsRefreshing(true);
        try {
            const res = await axios.get(`${BACKEND_URL}/api/auth/me`);
            if (res.data.success && res.data.data.user.isVerified) {
                updateUser({ isVerified: true });
                toast.success("Email verified!");
            } else {
                toast.info("Email not verified yet.");
            }
        } catch (err) {
            toast.error("Failed to refresh status.");
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="medical-mesh min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-xl w-full relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] -z-10 animate-pulse" />
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-[3rem] p-10 md:p-16 text-center space-y-10 relative overflow-hidden"
                >
                    <div className="relative inline-block">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 bg-navy-900 rounded-[2rem] flex items-center justify-center shadow-navy mx-auto relative z-10"
                        >
                            <Mail className="w-10 h-10 text-emerald-400" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center z-20 shadow-emerald"
                        >
                            <Clock className="w-5 h-5 text-white" />
                        </motion.div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black text-navy-900 leading-[1.1] tracking-tight">
                            Verify <br />
                            <span className="gradient-text-luxe">Your Identity.</span>
                        </h1>
                        <p className="text-slate-500 text-lg leading-relaxed max-w-sm mx-auto">
                            We've sent a secure verification link to <br />
                            <span className="font-bold text-navy-900 underline decoration-emerald-200 underline-offset-4">{email}</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider text-left leading-tight">Secure <br/>Data</span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-2xl border border-navy-100/50">
                            <Clock className="w-5 h-5 text-navy-600 shrink-0" />
                            <span className="text-[11px] font-bold text-navy-800 uppercase tracking-wider text-left leading-tight">24h <br/>Expiry</span>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={refreshStatus}
                                disabled={isRefreshing}
                                className="w-full h-16 bg-navy-900 hover:bg-navy-950 text-white rounded-2xl font-bold text-lg shadow-navy transition-all flex items-center justify-center gap-2 group"
                            >
                                {isRefreshing ? <RefreshCw className="animate-spin" /> : <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />}
                                I've Verified
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm text-slate-400 font-medium tracking-tight">
                                Didn't receive the email?
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={handleResendEmail}
                                    disabled={isResending}
                                    className="px-6 py-2 rounded-full border border-medical-border text-xs font-bold text-navy-900 hover:bg-navy-50 transition-colors uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isResending ? "Resending..." : "Resend Email"}
                                </button>
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest underline decoration-emerald-200 underline-offset-4"
                                >
                                    Login with different account
                                </Link>
                            </div>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto leading-relaxed pt-6">
                        Verification is mandatory to ensure the integrity of clinical AI analysis and your personal medical data.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default VerifyNotice;
